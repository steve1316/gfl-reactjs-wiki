"""Convert fairy, HOC and T-Doll skin Live2D Unity Cubism bundles into standard Cubism web runtime files.

Each `live2d` inventory item names one bundle holding a `CubismMoc` (`.moc3` bytes) and prefab per form (three for a fairy, one for a
HOC), a texture shared by all forms of a fairy or one-per-slot for a HOC, and a `motions/` folder of `<name>.fade.asset` objects that
already carry every animation curve with its tangents - the Cubism Unity importer keeps this copy, so no `.anim` decoding is needed.

The prefab's `Parameters`, `Parts` and `Drawables` groups are walked by their child GameObject names, which are themselves the Cubism
parameter, part and drawable ids: a `CubismEyeBlinkParameter` or `CubismMouthParameter` marker becomes a model3 `Groups` entry, and a
`CubismHitDrawable` becomes a `HitAreas` entry. Each `.fade.asset` becomes one `<name>.motion3.json`, classified curve by curve as a
`Parameter` or `PartOpacity` target against those same ids; an id that is neither (the model opacity id) is dropped.

Published layout, under `<staging>/assets/live2d/`:
- `fairies/<id>/texture.webp`, `fairies/<id>/form<n>.moc3`, `fairies/<id>/form<n>.model3.json` (n = 1, 2, 3), and
  `fairies/<id>/motions/<name>.motion3.json` - the texture and motions are shared by all three forms.
- `hocs/<id>/model.moc3`, `hocs/<id>/model.model3.json`, `hocs/<id>/texture<n>.webp` (n from 0) and `hocs/<id>/motions/<name>.motion3.json`.
- `tdolls/<id>/<form>/<skin>/<variant>/model.moc3`, `.../model.model3.json`, `.../texture<n>.webp` (n from 0), `.../model.physics3.json`
  when the model has a physics rig, and `.../motions/<name>.motion3.json`. `variant` is `normal` or `damaged`.
"""

import collections
import json
import os
import shutil
import sys

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, TOOLS_DIR)

from extract_game_assets import CARD_QUALITY, FAIRY_FORMS, TREE, encode_webp, new_result, unity_load, write_file  # noqa: E402
from skin_live2d_table import SKIN_LIVE2D_VARIANTS  # noqa: E402

# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

REPORT_TIER_FAIRY = "live2d_fairy"
REPORT_TIER_HOC = "live2d_hoc"
# Report tier a skin Live2D model's written files count under, beside the fairy and HOC tiers.
REPORT_TIER_SKIN = "live2d_skin"
# Unity's CubismPhysicsSourceComponent, the enum both a physics input and output use to say which component of the source it reads.
PHYSICS_COMPONENTS = {0: "X", 1: "Y", 2: "Angle"}

# A walked prefab's classification ids and Cubism marker groups.
PrefabInfo = collections.namedtuple("PrefabInfo", ("params", "parts", "eyeblink", "lipsync", "hit_areas"))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Pure motion3 / model3 conversion


def curve_to_segments(keys):
    """Convert Unity Hermite keyframes into a flat Cubism motion3 curve `Segments` list.

    Each consecutive key pair becomes one bezier segment using the standard 1/3-weighted tangent construction, or a stepped segment
    when either side's slope is infinite (a held value with no interpolation). Every emitted number is rounded to 4 decimal places,
    matching the precision Cubism's own exporter uses.

    Args:
        keys: Ordered keyframe dicts, each with `time`, `value`, `inSlope` and `outSlope`.

    Returns:
        The flat `Segments` list: `[t0, v0]` followed by one `1, t0+dt/3, v0+out0*dt/3, t1-dt/3, v1-in1*dt/3, t1, v1` bezier entry per
        key pair, or `2, t1, v1` when that pair is stepped.
    """
    segments = [round(keys[0]["time"], 4), round(keys[0]["value"], 4)]
    for a, b in zip(keys, keys[1:]):
        dt = b["time"] - a["time"]
        if dt <= 0:
            continue
        if abs(a["outSlope"]) == float("inf") or abs(b["inSlope"]) == float("inf"):
            segments += [2, round(b["time"], 4), round(b["value"], 4)]
        else:
            segments += [
                1,
                round(a["time"] + dt / 3, 4),
                round(a["value"] + a["outSlope"] * dt / 3, 4),
                round(b["time"] - dt / 3, 4),
                round(b["value"] - b["inSlope"] * dt / 3, 4),
                round(b["time"], 4),
                round(b["value"], 4),
            ]
    return segments


def segment_stats(segments):
    """Count the segments and points in a flat `Segments` list, for `Meta.TotalSegmentCount` / `TotalPointCount`.

    Args:
        segments: A flat list from `curve_to_segments`.

    Returns:
        A `(segment_count, point_count)` pair. Each segment, bezier or stepped, counts as 3 points plus the curve's own start point.
    """
    index, count = 2, 0
    while index < len(segments):
        index += 7 if segments[index] == 1 else 3
        count += 1
    return count, 1 + count * 3


def motion_group_name(name):
    """Work out one motion's model3 `FileReferences.Motions` group name.

    The idle clip is exported as a single `daiji_idle_01` motion per model and is grouped under `Idle`, matching the game's own default
    idle play; every other named motion (a random wait or a touch reaction) is its own single-motion group.

    Args:
        name: The motion's own name, the fade asset's file stem.

    Returns:
        The group name.
    """
    return "Idle" if name.startswith("daiji_idle") else name


def fade_to_motion3(fade, param_ids, part_ids):
    """Convert one `CubismFadeMotionData` typetree dict into a Cubism motion3 dict.

    Args:
        fade: The typetree dict of a `<name>.fade.asset`: `ParameterIds`, `ParameterCurves` (each an object with `m_Curve` keyframes),
            `ParameterFadeInTimes`, `ParameterFadeOutTimes`, `MotionLength`, `FadeInTime` and `FadeOutTime`.
        param_ids: The prefab's parameter ids, so a curve id can be classed `Parameter`.
        part_ids: The prefab's part ids, so a curve id can be classed `PartOpacity`.

    Returns:
        The motion3 dict. A curve id that is neither a parameter nor a part id (the model opacity id) is dropped, and a curve with no
        keyframes at all contributes nothing.
    """
    param_set, part_set = set(param_ids), set(part_ids)
    curves, total_segments, total_points = [], 0, 0
    rows = zip(fade["ParameterIds"], fade["ParameterCurves"], fade["ParameterFadeInTimes"], fade["ParameterFadeOutTimes"])
    for parameter_id, curve, fade_in, fade_out in rows:
        keys = curve["m_Curve"]
        if not keys:
            continue
        if parameter_id in param_set:
            target = "Parameter"
        elif parameter_id in part_set:
            target = "PartOpacity"
        else:
            continue
        segments = curve_to_segments(keys)
        count, points = segment_stats(segments)
        entry = {"Target": target, "Id": parameter_id, "Segments": segments}
        if fade_in >= 0:
            entry["FadeInTime"] = fade_in
        if fade_out >= 0:
            entry["FadeOutTime"] = fade_out
        curves.append(entry)
        total_segments += count
        total_points += points
    return {
        "Version": 3,
        "Meta": {
            "Duration": fade["MotionLength"],
            "Fps": 30,
            "Loop": True,
            "AreBeziersRestricted": False,
            "CurveCount": len(curves),
            "TotalSegmentCount": total_segments,
            "TotalPointCount": total_points,
            "UserDataCount": 0,
            "TotalUserDataSize": 0,
            "FadeInTime": fade["FadeInTime"],
            "FadeOutTime": fade["FadeOutTime"],
        },
        "Curves": curves,
    }


def model3(moc_name, texture_names, motion_groups, groups, hit_areas):
    """Build one Cubism model3.json dict.

    Args:
        moc_name: The written `.moc3` file's own name.
        texture_names: Texture file names, in `FileReferences.Textures` slot order.
        motion_groups: Motion group name to its list of `{File, FadeInTime, FadeOutTime}` entries.
        groups: An `(eyeblink_ids, lipsync_ids)` pair, the prefab's `CubismEyeBlinkParameter` / `CubismMouthParameter` ids.
        hit_areas: `{Id, Name}` hit area dicts, from the prefab's `CubismHitDrawable` components.

    Returns:
        The model3 dict.
    """
    eyeblink_ids, lipsync_ids = groups
    return {
        "Version": 3,
        "FileReferences": {"Moc": moc_name, "Textures": list(texture_names), "Motions": motion_groups},
        "Groups": [
            {"Target": "Parameter", "Name": "EyeBlink", "Ids": list(eyeblink_ids)},
            {"Target": "Parameter", "Name": "LipSync", "Ids": list(lipsync_ids)},
        ],
        "HitAreas": list(hit_areas),
    }


def texture_output_names(paths):
    """Name a model's textures by their position rather than by their own file names.

    A skin bundle can hold two textures with the same basename, when a nested model folder repeats `texture_00.png`. Naming output files
    from the basename would write one over the other and lose a texture, so the slot index names the file instead. The order is the
    container order, which is the order each drawable's `CubismRenderer._mainTexture` refers to.

    Args:
        paths: The model's texture container paths, in container order.

    Returns:
        One `texture<n>.webp` name per path, in the same order.
    """
    return [f"texture{slot}.webp" for slot in range(len(paths))]


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Prefab walking

# A GameObject's component list holds the Transform once (structural), plus MonoBehaviours read by their script class name, plus any
# other Unity component kept only to detect its presence (its type name is enough).


def comp_classes(objs, game_object):
    """Map one GameObject typetree's components by class name, and find its own Transform.

    Args:
        objs: Path id to UnityPy object reader, for the whole bundle.
        game_object: A GameObject typetree dict.

    Returns:
        A `(components, transform)` pair: `components` is a dict of class name to a list of typetree dicts (a plain Unity component,
        such as `CubismRenderer`, is kept as `None` since only its presence matters), and `transform` is the GameObject's own Transform
        typetree, or None when it has none.
    """
    components = collections.defaultdict(list)
    transform = None
    for entry in game_object["m_Component"]:
        obj = objs[entry["component"]["m_PathID"]]
        if obj.type.name == "Transform":
            transform = obj.read_typetree()
        elif obj.type.name == "MonoBehaviour":
            components[obj.read().m_Script.read().m_ClassName].append(obj.read_typetree())
        else:
            components[obj.type.name].append(None)
    return components, transform


def prefab_children(objs, transform):
    """Yield the GameObject typetree of each child under a Transform.

    Args:
        objs: Path id to UnityPy object reader, for the whole bundle.
        transform: A Transform typetree dict.

    Yields:
        Each child's GameObject typetree dict.
    """
    for child in transform["m_Children"]:
        child_transform = objs[child["m_PathID"]].read_typetree()
        yield objs[child_transform["m_GameObject"]["m_PathID"]].read_typetree()


def walk_prefab(objs, prefab):
    """Walk one Cubism prefab's `Parameters`, `Parts` and `Drawables` groups.

    The root's direct children are those three named groups; each group's own children are the individual parameter, part and
    drawable GameObjects, named after their own Cubism id.

    Args:
        objs: Path id to UnityPy object reader, for the whole bundle.
        prefab: The prefab root's GameObject typetree dict.

    Returns:
        A `PrefabInfo` of parameter ids, part ids, eye-blink parameter ids, mouth parameter ids and `{Id, Name}` hit area dicts.
    """
    _components, root_transform = comp_classes(objs, prefab)
    params, parts, eyeblink, lipsync, hit_areas = [], [], [], [], []
    for group in prefab_children(objs, root_transform):
        _group_components, group_transform = comp_classes(objs, group)
        if group_transform is None:
            continue
        for child in prefab_children(objs, group_transform):
            child_components, _child_transform = comp_classes(objs, child)
            name = child["m_Name"]
            if group["m_Name"] == "Parameters":
                params.append(name)
                if "CubismEyeBlinkParameter" in child_components:
                    eyeblink.append(name)
                if "CubismMouthParameter" in child_components:
                    lipsync.append(name)
            elif group["m_Name"] == "Parts":
                parts.append(name)
            elif group["m_Name"] == "Drawables" and "CubismHitDrawable" in child_components:
                hit_areas.append({"Id": name, "Name": child_components["CubismHitDrawable"][0]["Name"]})
    return PrefabInfo(params, parts, eyeblink, lipsync, hit_areas)


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Physics


def physics_vector(vector):
    """Convert a Unity vector to the capitalised form physics3.json uses.

    Args:
        vector: A `{"x", "y"}` dict from a typetree.

    Returns:
        An `{"X", "Y"}` dict.
    """
    return {"X": vector["x"], "Y": vector["y"]}


def physics_range(bounds):
    """Convert one Unity normalisation range, reordering it the way physics3.json writes it.

    Args:
        bounds: A `{"Minimum", "Maximum", "Default"}` dict from a typetree.

    Returns:
        The same three values, minimum first.
    """
    return {"Minimum": bounds["Minimum"], "Maximum": bounds["Maximum"], "Default": bounds["Default"]}


def physics3(rig):
    """Convert a `CubismPhysicsController._rig` typetree into a Cubism physics3.json document.

    The Unity rig and the web format hold the same data under different names, so this is a rename
    rather than a computation. A sub-rig becomes one `PhysicsSettings` entry, its `Particles` become
    `Vertices`, and an input or output's `SourceComponent` picks both the entry's `Type` and, for an
    output, which of the two scale fields carries its `Scale`.

    Args:
        rig: The controller's `_rig` dict, or None when the prefab has no `CubismPhysicsController`.

    Returns:
        The physics3 document, or None when there is no rig or it holds no sub-rigs, in which case no
        file should be written.
    """
    if not rig or not rig.get("SubRigs"):
        return None
    settings, dictionary = [], []
    for number, sub in enumerate(rig["SubRigs"], start=1):
        setting_id = f"PhysicsSetting{number}"
        dictionary.append({"Id": setting_id, "Name": setting_id})
        inputs = [
            {
                "Source": {"Target": "Parameter", "Id": entry["SourceId"]},
                "Weight": entry["Weight"],
                "Type": PHYSICS_COMPONENTS[entry["SourceComponent"]],
                "Reflect": bool(entry["IsInverted"]),
            }
            for entry in sub["Input"]
        ]
        outputs = []
        for entry in sub["Output"]:
            component = PHYSICS_COMPONENTS[entry["SourceComponent"]]
            scale = (
                entry["AngleScale"]
                if component == "Angle"
                else entry["TranslationScale"]["x" if component == "X" else "y"]
            )
            outputs.append(
                {
                    "Destination": {"Target": "Parameter", "Id": entry["DestinationId"]},
                    "VertexIndex": entry["ParticleIndex"],
                    "Scale": scale,
                    "Weight": entry["Weight"],
                    "Type": component,
                    "Reflect": bool(entry["IsInverted"]),
                }
            )
        vertices = [
            {
                "Position": physics_vector(particle["InitialPosition"]),
                "Mobility": particle["Mobility"],
                "Delay": particle["Delay"],
                "Acceleration": particle["Acceleration"],
                "Radius": particle["Radius"],
            }
            for particle in sub["Particles"]
        ]
        settings.append(
            {
                "Id": setting_id,
                "Input": inputs,
                "Output": outputs,
                "Vertices": vertices,
                "Normalization": {
                    "Position": physics_range(sub["Normalization"]["Position"]),
                    "Angle": physics_range(sub["Normalization"]["Angle"]),
                },
            }
        )
    return {
        "Version": 3,
        "Meta": {
            "PhysicsSettingCount": len(settings),
            "TotalInputCount": sum(len(setting["Input"]) for setting in settings),
            "TotalOutputCount": sum(len(setting["Output"]) for setting in settings),
            "VertexCount": sum(len(setting["Vertices"]) for setting in settings),
            "EffectiveForces": {
                "Gravity": physics_vector(rig["Gravity"]),
                "Wind": physics_vector(rig["Wind"]),
            },
            "PhysicsDictionary": dictionary,
        },
        "PhysicsSettings": settings,
    }


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Bundle-driven workers


def load_container(bundle_name, cache_dir, loader):
    """Open one bundle and index its objects by lowercased container path and by path id.

    UnityPy's own container keys are always lowercase, while the resolved item paths from `game_bundles.py` keep their real case (for
    display and for matching atlas page names), so every lookup against this container lowercases the path first - the same convention
    `extract_game_assets.write_rig_files` uses.

    Args:
        bundle_name: Bundle name, without the `.ab` extension.
        cache_dir: The bundle cache directory.
        loader: Callable opening one `.ab` file.

    Returns:
        A `(container, objects)` pair: `container` maps the bundle's lowercased container path to its UnityPy object reader, and
        `objects` maps path id to the same readers, for typetree cross-references such as a Transform's children.
    """
    env = loader(os.path.join(cache_dir, f"{bundle_name}.ab"))
    container = {path.lower(): obj for path, obj in env.container.items()}
    return container, {obj.path_id: obj for obj in env.objects}


def read_moc(container, asset):
    """Read one `CubismMoc` asset's raw `.moc3` bytes.

    Args:
        container: The bundle's container, from `load_container`.
        asset: The item's `{bundle, path}` asset dict for the moc role.

    Raises:
        ValueError: When the bytes do not start with the `MOC3` magic.

    Returns:
        The moc3 bytes.
    """
    data = bytes(container[asset["path"].lower()].read_typetree()["_bytes"])
    if data[:4] != b"MOC3":
        raise ValueError("moc3 data does not start with the MOC3 magic")
    return data


def build_motions(container, motions_asset, param_ids, part_ids, folder, tier, staging, result, key):
    """Convert every fade asset under a model's motions folder into a motion3.json, and group them for model3's `Motions` field.

    Args:
        container: The bundle's container, from `load_container`.
        motions_asset: The item's `motions` asset dict, `{bundle, path}` with `path` the folder prefix.
        param_ids: The prefab's parameter ids, passed through to `fade_to_motion3`.
        part_ids: The prefab's part ids, passed through to `fade_to_motion3`.
        folder: Output folder for this model, such as `live2d/fairies/3`.
        tier: Report tier the motion files count under.
        staging: The staging root.
        result: The worker result to append missing rows and written files to.
        key: Item key for missing rows.

    Returns:
        The `FileReferences.Motions` dict, group name to its list of motion entries, sorted by group name.
    """
    prefix = motions_asset["path"].lower()
    names = sorted(path for path, _obj in container.items() if path.startswith(prefix) and path.endswith(".fade.asset"))
    groups = collections.defaultdict(list)
    for path in names:
        name = os.path.basename(path)[: -len(".fade.asset")]
        try:
            fade = container[path].read_typetree()
            motion = fade_to_motion3(fade, param_ids, part_ids)
            data = json.dumps(motion, separators=(",", ":")).encode("utf-8")
            write_file(staging, f"{folder}/motions/{name}.motion3.json", data, tier, result)
        except Exception as exc:
            result["missing"].append({"key": key, "role": f"motion:{name}", "reason": f"failed: {exc!r}"})
            continue
        entry = {"File": f"motions/{name}.motion3.json", "FadeInTime": fade["FadeInTime"], "FadeOutTime": fade["FadeOutTime"]}
        groups[motion_group_name(name)].append(entry)
    return dict(sorted(groups.items()))


def build_fairy_live2d(item, cache_dir, staging, loader):
    """Extract one fairy's three forms: the texture and motions they share, plus each form's own moc3 and model3.json.

    Args:
        item: A resolved `live2d` fairy item.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        loader: Callable opening one `.ab` file.

    Returns:
        A worker result.
    """
    result = new_result()
    key, folder = item["key"], f"live2d/fairies/{item['id']}"
    try:
        container, objs = load_container(item["bundles"][0], cache_dir, loader)
    except Exception as exc:
        result["missing"].append({"key": key, "role": "*", "reason": f"bundle load failed: {exc!r}"})
        return result

    if "texture" not in item["assets"]:
        result["missing"].append({"key": key, "role": "texture", "reason": "not resolved"})
    else:
        try:
            image = container[item["assets"]["texture"]["path"].lower()].read().image.convert("RGBA")
            write_file(staging, f"{folder}/texture.webp", encode_webp(image, CARD_QUALITY), REPORT_TIER_FAIRY, result)
        except Exception as exc:
            result["missing"].append({"key": key, "role": "texture", "reason": f"failed: {exc!r}"})

    infos, param_ids, part_ids = {}, set(), set()
    for form in FAIRY_FORMS:
        moc_role, prefab_role = f"form{form}_moc", f"form{form}_prefab"
        if moc_role not in item["assets"] or prefab_role not in item["assets"]:
            result["missing"].append({"key": key, "role": prefab_role, "reason": "not resolved"})
            continue
        try:
            moc_bytes = read_moc(container, item["assets"][moc_role])
            write_file(staging, f"{folder}/form{form}.moc3", moc_bytes, REPORT_TIER_FAIRY, result)
            prefab = container[item["assets"][prefab_role]["path"].lower()].read_typetree()
            info = walk_prefab(objs, prefab)
        except Exception as exc:
            result["missing"].append({"key": key, "role": prefab_role, "reason": f"failed: {exc!r}"})
            continue
        infos[form] = info
        param_ids.update(info.params)
        part_ids.update(info.parts)

    motion_groups = {}
    if "motions" not in item["assets"]:
        result["missing"].append({"key": key, "role": "motions", "reason": "not resolved"})
    elif infos:
        motion_groups = build_motions(container, item["assets"]["motions"], param_ids, part_ids, folder, REPORT_TIER_FAIRY, staging, result, key)

    for form, info in infos.items():
        try:
            built = model3(f"form{form}.moc3", ["texture.webp"], motion_groups, (info.eyeblink, info.lipsync), info.hit_areas)
            data = json.dumps(built, indent=1).encode("utf-8")
            write_file(staging, f"{folder}/form{form}.model3.json", data, REPORT_TIER_FAIRY, result)
        except Exception as exc:
            result["missing"].append({"key": key, "role": f"form{form}_prefab", "reason": f"model3 write failed: {exc!r}"})
    return result


def build_hoc_live2d(item, cache_dir, staging, loader):
    """Extract one HOC's single model: its textures, moc3 and model3.json, and its motions.

    Args:
        item: A resolved `live2d` HOC item.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        loader: Callable opening one `.ab` file.

    Returns:
        A worker result.
    """
    result = new_result()
    key, folder = item["key"], f"live2d/hocs/{item['id']}"
    try:
        container, objs = load_container(item["bundles"][0], cache_dir, loader)
    except Exception as exc:
        result["missing"].append({"key": key, "role": "*", "reason": f"bundle load failed: {exc!r}"})
        return result

    texture_names = []
    for slot, role in enumerate(("texture0", "texture1")):
        if role not in item["assets"]:
            continue
        try:
            image = container[item["assets"][role]["path"].lower()].read().image.convert("RGBA")
            name = f"texture{slot}.webp"
            write_file(staging, f"{folder}/{name}", encode_webp(image, CARD_QUALITY), REPORT_TIER_HOC, result)
            texture_names.append(name)
        except Exception as exc:
            result["missing"].append({"key": key, "role": role, "reason": f"failed: {exc!r}"})

    if "moc" not in item["assets"] or "prefab" not in item["assets"]:
        result["missing"].append({"key": key, "role": "moc", "reason": "not resolved"})
        return result
    try:
        moc_bytes = read_moc(container, item["assets"]["moc"])
        write_file(staging, f"{folder}/model.moc3", moc_bytes, REPORT_TIER_HOC, result)
        prefab = container[item["assets"]["prefab"]["path"].lower()].read_typetree()
        info = walk_prefab(objs, prefab)
    except Exception as exc:
        result["missing"].append({"key": key, "role": "moc", "reason": f"failed: {exc!r}"})
        return result

    motion_groups = {}
    if "motions" not in item["assets"]:
        result["missing"].append({"key": key, "role": "motions", "reason": "not resolved"})
    else:
        motion_groups = build_motions(container, item["assets"]["motions"], info.params, info.parts, folder, REPORT_TIER_HOC, staging, result, key)

    try:
        built = model3("model.moc3", texture_names, motion_groups, (info.eyeblink, info.lipsync), info.hit_areas)
        data = json.dumps(built, indent=1).encode("utf-8")
        write_file(staging, f"{folder}/model.model3.json", data, REPORT_TIER_HOC, result)
    except Exception as exc:
        result["missing"].append({"key": key, "role": "prefab", "reason": f"model3 write failed: {exc!r}"})
    return result


def cleanup_variant_folder(staging, folder, result):
    """Remove a skin variant's folder after its build failed partway through, so a partial write never stays published.

    `write_file` writes each texture, the moc3, physics and motions file to disk as soon as its own step succeeds, so a later step
    failing (the moc3 read, or the final model3.json write) can leave earlier files sitting on disk with nothing to make them
    playable. `build_manifest.scan_live2d_tdolls` and `build_live2d_index.index_tdolls` both require `model.moc3` and
    `model.model3.json` together, so those orphans are never offered, but they still take up space on the asset host and would
    confuse a manual look at the tree. Removing the whole folder is simpler than buffering every write in memory until the variant
    is known to succeed, and costs nothing extra since a failed variant has no files worth keeping anyway.

    Args:
        staging: The staging root.
        folder: The variant's folder, such as `live2d/tdolls/104/base/1202/normal`.
        result: The worker result, whose `files` list is filtered to drop entries under `folder`.
    """
    path = os.path.join(staging, TREE, *folder.split("/"))
    shutil.rmtree(path, ignore_errors=True)
    prefix = f"{folder}/"
    result["files"] = [entry for entry in result["files"] if not entry[0].startswith(prefix)]


def prefab_physics_rig(objs, prefab):
    """Find a prefab's `CubismPhysicsController` rig, if it has one.

    Args:
        objs: Path id to UnityPy object reader, for the whole bundle.
        prefab: The prefab root's GameObject typetree dict.

    Returns:
        The controller's `_rig` dict, or None when the prefab has no physics controller.
    """
    for entry in prefab["m_Component"]:
        obj = objs[entry["component"]["m_PathID"]]
        if obj.type.name != "MonoBehaviour":
            continue
        if obj.read().m_Script.read().m_ClassName == "CubismPhysicsController":
            return obj.read_typetree().get("_rig")
    return None


def drawable_texture_paths(objs, container, prefab):
    """Resolve every Drawable's `CubismRenderer._mainTexture` reference to its container path.

    This is the ground truth for which texture folder a model actually renders with. A model folder can ship more than one
    resolution as siblings (a lower one kept alongside the final one, or the other way round), and only each drawable's own PPtr
    reference, not a folder name or a file-order guess, says which one the model was actually built against.

    Args:
        objs: Path id to UnityPy object reader, for the whole bundle.
        container: The bundle's container, lowercased path to UnityPy object reader, from `load_container`.
        prefab: The prefab root's GameObject typetree dict.

    Returns:
        Lowercased container paths, one per Drawable whose `CubismRenderer` carries a local `_mainTexture` reference, in Drawables
        order. Empty when the prefab has no Drawables group, or none of its renderers resolve to a container entry.
    """
    reverse = {obj.path_id: path for path, obj in container.items()}
    _components, root_transform = comp_classes(objs, prefab)
    if root_transform is None:
        return []
    paths = []
    for group in prefab_children(objs, root_transform):
        if group["m_Name"] != "Drawables":
            continue
        _group_components, group_transform = comp_classes(objs, group)
        if group_transform is None:
            continue
        for child in prefab_children(objs, group_transform):
            child_components, _child_transform = comp_classes(objs, child)
            renderers = child_components.get("CubismRenderer")
            if not renderers:
                continue
            reference = renderers[0].get("_mainTexture", {})
            if reference.get("m_FileID", 0) != 0:
                continue
            path = reverse.get(reference.get("m_PathID"))
            if path is not None:
                paths.append(path)
    return paths


def prefab_texture_dir(objs, container, prefab, candidates, fallback):
    """Pick a skin Live2D variant's texture folder from what its prefab's Drawables actually render with.

    `game_bundles.py` records every candidate folder but has no bundle loaded, so it cannot read `CubismRenderer._mainTexture`
    references and only offers a resolution-based guess as `fallback`. That guess is wrong when a model folder ships more than one
    resolution and the higher one is not the one the model was built against - `live2d:skin:115:base:1103` (KP31_1103's normal
    model) ships both `model.1024/` and `model.2048/`, and every drawable's texture reference names `model.1024/`. Reading the real
    references here, where the bundle is loaded, gives the actual answer instead of a guess.

    Args:
        objs: Path id to UnityPy object reader, for the whole bundle.
        container: The bundle's container, lowercased path to UnityPy object reader, from `load_container`.
        prefab: The prefab root's GameObject typetree dict.
        candidates: Every candidate texture folder's absolute lowercased path prefix. When there are fewer than two, `fallback` is
            returned unconditionally, since the ambiguity this function exists for cannot arise.
        fallback: The folder to use when the prefab's references do not name exactly one of `candidates` - none resolved, or they
            disagree, which should not happen for a model built from one folder but is not a case worth trusting a guess over.

    Returns:
        A `(folder, resolved)` pair: `folder` is the winning folder, and `resolved` is True when the prefab's own references decided
        it (or there was nothing to decide), False when `fallback` was used because the references did not name exactly one
        candidate - the caller's cue to record that the pick is a guess, not a confirmed answer.
    """
    if len(candidates) < 2:
        return fallback, True
    texture_paths = drawable_texture_paths(objs, container, prefab)
    matches = {candidate for candidate in candidates for path in texture_paths if path.startswith(candidate)}
    if len(matches) == 1:
        return matches.pop(), True
    return fallback, False


def texture_dir_siblings(container, texture_prefix):
    """Find every `model.<res>/` folder next to one texture folder, by the same naming `game_bundles.variant_assets` matches.

    Used to detect a stale inventory item with no `candidates` recorded (resolved before `game_bundles.py` started recording them)
    whose bundle genuinely ships more than one resolution regardless - scanning the loaded container directly is the only way to
    tell, since the inventory itself is the thing that might be wrong.

    Args:
        container: The bundle's container, lowercased path to UnityPy object reader, from `load_container`.
        texture_prefix: One texture folder's absolute lowercased path prefix, trailing slash included.

    Returns:
        Every sibling `model.<res>/` folder's absolute path prefix found directly under the same parent folder, including
        `texture_prefix` itself when it matches that naming. A single-element result means there is nothing to disambiguate.
    """
    trimmed = texture_prefix.rstrip("/")
    parent = trimmed[: trimmed.rfind("/") + 1] if "/" in trimmed else ""
    siblings = set()
    for path in container:
        if not path.startswith(parent):
            continue
        rest = path[len(parent) :]
        if "/" not in rest:
            continue
        leaf = rest.split("/", 1)[0]
        if leaf.startswith("model.") and leaf[len("model.") :].isdigit():
            siblings.add(f"{parent}{leaf}/")
    return siblings


def build_skin_variant(item, container, objs, variant, folder, staging, result):
    """Extract one variant of a skin's model: textures, moc3, physics, motions and model3.

    A texture, moc3 or model3 failure removes whatever this variant already wrote via `cleanup_variant_folder`, rather than leaving a
    folder with some files but no `model.model3.json` to make them playable. Physics and motions failures do not, since both are
    optional or partial by nature - see their own comments below.

    Args:
        item: A resolved `live2d` skin item.
        container: The bundle's container, from `load_container`.
        objs: Path id to UnityPy object reader, from `load_container`.
        variant: `normal` or `damaged`, naming the item's asset roles.
        folder: Output folder for this variant, such as `live2d/tdolls/104/base/1202/normal`.
        staging: The staging root.
        result: The worker result to append missing, non-standard and written rows to. A texture folder pick that is not confirmed
            by the prefab - an unreadable prefab, no matching candidate, or a stale inventory item with no `candidates` recorded at
            all - lands in `nonstandard`, not `missing`, since extraction still succeeds with the fallback folder.
    """
    key = item["key"]
    moc_role, prefab_role = f"{variant}_moc", f"{variant}_prefab"
    if moc_role not in item["assets"] or prefab_role not in item["assets"]:
        result["missing"].append({"key": key, "role": moc_role, "reason": "not resolved"})
        return

    texture_names = []
    if f"{variant}_textures" in item["assets"]:
        textures_asset = item["assets"][f"{variant}_textures"]
        prefix = textures_asset["path"].lower()
        candidates = [candidate.lower() for candidate in textures_asset.get("candidates", [])]
        if len(candidates) > 1:
            # More than one resolution was found for this model - game_bundles.py's `prefix` above is only its resolution-based
            # guess, since it has no bundle loaded to read the prefab's own texture references. The prefab is read again here,
            # ahead of the read below that also needs it, since this whole block runs before that one and must not depend on it.
            resolved, reason = False, None
            try:
                prefab_for_textures = container[item["assets"][prefab_role]["path"].lower()].read_typetree()
                prefix, resolved = prefab_texture_dir(objs, container, prefab_for_textures, candidates, prefix)
            except Exception as exc:
                reason = f"prefab unreadable: {exc!r}"
            if not resolved:
                result["nonstandard"].append(
                    {
                        "key": key,
                        "role": f"{variant}_textures",
                        "size": reason or f"prefab did not confirm one of the candidates: {candidates}",
                        "expected": prefix,
                    }
                )
        elif len(candidates) <= 1:
            # No ambiguity was recorded at all - confirm that against the loaded bundle itself, since the inventory that recorded
            # `candidates` (or did not) can be stale relative to it.
            siblings = texture_dir_siblings(container, prefix)
            if len(siblings) > 1:
                result["nonstandard"].append(
                    {
                        "key": key,
                        "role": f"{variant}_textures",
                        "size": f"stale inventory - no candidates recorded, found siblings {sorted(siblings)}",
                        "expected": prefix,
                    }
                )
        paths = sorted(path for path, _obj in container.items() if path.startswith(prefix) and path.endswith(".png"))
        for path, name in zip(paths, texture_output_names(paths)):
            try:
                image = container[path].read().image.convert("RGBA")
                write_file(staging, f"{folder}/{name}", encode_webp(image, CARD_QUALITY), REPORT_TIER_SKIN, result)
                texture_names.append(name)
            except Exception as exc:
                # The moc3's texture units are index-based, so silently dropping one slot would shift every later drawable onto the
                # wrong image - the model would still load, just render wrong. Failing the whole variant beats that.
                result["missing"].append({"key": key, "role": f"{variant}_texture:{name}", "reason": f"failed: {exc!r}"})
                cleanup_variant_folder(staging, folder, result)
                return

    try:
        moc_bytes = read_moc(container, item["assets"][moc_role])
        write_file(staging, f"{folder}/model.moc3", moc_bytes, REPORT_TIER_SKIN, result)
        prefab = container[item["assets"][prefab_role]["path"].lower()].read_typetree()
        info = walk_prefab(objs, prefab)
    except Exception as exc:
        result["missing"].append({"key": key, "role": moc_role, "reason": f"failed: {exc!r}"})
        cleanup_variant_folder(staging, folder, result)
        return

    physics_name = None
    try:
        document = physics3(prefab_physics_rig(objs, prefab))
        if document is not None:
            write_file(staging, f"{folder}/model.physics3.json", json.dumps(document, indent=1).encode("utf-8"), REPORT_TIER_SKIN, result)
            physics_name = "model.physics3.json"
    except Exception as exc:
        # Physics is secondary motion only, so a bad rig costs sway rather than the whole model.
        result["missing"].append({"key": key, "role": f"{variant}_physics", "reason": f"failed: {exc!r}"})

    motion_groups = {}
    if f"{variant}_motions" not in item["assets"]:
        result["missing"].append({"key": key, "role": f"{variant}_motions", "reason": "not resolved"})
    else:
        motion_groups = build_motions(container, item["assets"][f"{variant}_motions"], info.params, info.parts, folder, REPORT_TIER_SKIN, staging, result, key)

    try:
        built = model3("model.moc3", texture_names, motion_groups, (info.eyeblink, info.lipsync), info.hit_areas)
        if physics_name:
            built["FileReferences"]["Physics"] = physics_name
        write_file(staging, f"{folder}/model.model3.json", json.dumps(built, indent=1).encode("utf-8"), REPORT_TIER_SKIN, result)
    except Exception as exc:
        result["missing"].append({"key": key, "role": prefab_role, "reason": f"model3 write failed: {exc!r}"})
        cleanup_variant_folder(staging, folder, result)


def build_skin_live2d(item, cache_dir, staging, loader):
    """Extract one T-Doll skin's Live2D model, both its normal and damaged variants.

    Args:
        item: A resolved `live2d` skin item.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        loader: Callable opening one `.ab` file.

    Returns:
        A worker result.
    """
    result = new_result()
    root = f"live2d/tdolls/{item['id']}/{item['form']}/{item['skin']}"
    try:
        container, objs = load_container(item["bundles"][0], cache_dir, loader)
    except Exception as exc:
        result["missing"].append({"key": item["key"], "role": "*", "reason": f"bundle load failed: {exc!r}"})
        return result
    for variant, _folder in SKIN_LIVE2D_VARIANTS:
        build_skin_variant(item, container, objs, variant, f"{root}/{variant}", staging, result)
    return result


def extract_live2d_items(items, cache_dir, staging, loader=unity_load):
    """Extract every fairy's, HOC's and skin's Live2D model into Cubism web files.

    Unlike the art tiers, a Live2D item's bundle is small and belongs to that one item alone, so items are not grouped by shared
    bundle - each is loaded and converted independently, and one item's bundle failure or crash only adds missing rows for that item.

    Args:
        items: Resolved `live2d` inventory items, fairy, HOC and skin kinds mixed.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        loader: Callable opening one `.ab` file, replaceable in tests.

    Returns:
        A worker result merged over every item.
    """
    result = new_result()
    builders = {"fairy": build_fairy_live2d, "hoc": build_hoc_live2d, "skin": build_skin_live2d}
    for item in items:
        try:
            build = builders[item["kind"]]
            item_result = build(item, cache_dir, staging, loader)
        except Exception as exc:
            item_result = new_result()
            item_result["missing"].append({"key": item["key"], "role": "*", "reason": f"worker crashed: {exc!r}"})
        for field in result:
            result[field].extend(item_result[field])
    return result
