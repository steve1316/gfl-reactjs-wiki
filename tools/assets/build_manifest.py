#!/usr/bin/env python3
"""Build `assets-manifest.json` by scanning the skin-id staging tree.

Cards, skill icons, equipment icons and full art all live in the one asset tree, and the version 3 manifest records which of them
exist. Every path the app builds is derived from the doll id, form and kind, so only presence is stored. The manifest is written to
the repo root by default, the copy the site bundles.
"""

import argparse
import json
import os
import sys


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Naming conventions

# Skill icons hang off the doll rather than a form. `skill1` is the base skill, `skill2` the mod skill.
SKILL_KINDS = ("skill1", "skill2")

# v3 image kinds, in manifest order, with the filename each is read from.
V3_IMAGE_FILES = (("card", "card.webp"), ("card_damaged", "card_d.webp"), ("full", "full.webp"), ("full_damaged", "full_d.webp"))
V3_IMAGE_KINDS = [kind for kind, _name in V3_IMAGE_FILES]

# Folder prefix of skins whose art only the old asset repos hosted, keyed `legacy-<slug>` instead of a skin id.
LEGACY_SKIN_PREFIX = "legacy-"

# Mod-coloured cards of a skin, stored next to the skin's own cards.
V3_MOD_CARD_FILES = (("card", "mod_card.webp"), ("card_damaged", "mod_card_d.webp"))

# HOC image kinds, in manifest order, with the filename each is read from. A HOC has no forms or skins, just a card and full art.
V3_HOC_IMAGE_FILES = (("card", "card.webp"), ("full", "full.webp"))

# Fairy image kinds, in manifest order, with the filename each is read from. A fairy has three forms and no card or full art.
V3_FAIRY_IMAGE_FILES = (("form1", "form1.webp"), ("form2", "form2.webp"), ("form3", "form3.webp"))

# An enemy has the same two portrait kinds a HOC does. Every enemy has a card; only about two in three have the large art.
# `hero` is the full art trimmed down to the drawing by `trim_enemy_hero.py`, which is what lets an enemy's portrait card take the
# art's own shape instead of the square canvas the game draws it on.
V3_ENEMY_IMAGE_FILES = (("card", "card.webp"), ("full", "full.webp"), ("hero", "hero.webp"))

# The skill slots a captured Protocol Assimilation unit can have an icon for, in the order its page lists them. A unit whose `skill2`
# is a strategic skill has no icon for that slot, so the slot simply does not appear in its list.
V3_ASSIMILATION_SKILLS = ("skill1", "skill2", "skill3", "skill_advance")

# Live2D fairy form kinds, in manifest order, with the two files that must both exist for the form to count as present.
V3_LIVE2D_FAIRY_FILES = (
    ("form1", ("form1.moc3", "form1.model3.json")),
    ("form2", ("form2.moc3", "form2.model3.json")),
    ("form3", ("form3.moc3", "form3.model3.json")),
)

# Live2D HOC kind, with the two files that must both exist for it to count as present. A HOC has one model, no forms.
V3_LIVE2D_HOC_FILES = (("model", ("model.moc3", "model.model3.json")),)


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Skin-id layout (v3)


def faction_slugs(factions_root):
    """Every faction with published art, by the slug the site builds its URLs from.

    Each faction ships two files, `<slug>.webp` for the full emblem and `<slug>-mark.webp` for the bare mark a filter chip draws.
    Only the full emblem is listed, since the two are always published together and the site derives the mark's URL from the slug.

    Args:
        factions_root: The staging tree's `factions` directory, which need not exist.

    Returns:
        The slugs, in no particular order.
    """
    if not os.path.isdir(factions_root):
        return []
    return [name[: -len(".webp")] for name in os.listdir(factions_root) if name.endswith(".webp") and not name.endswith("-mark.webp")]


def numeric_dirs(folder):
    """List the numerically named subfolders of a folder in numeric order.

    Args:
        folder: The folder, which may not exist.

    Returns:
        The subfolder names.
    """
    if not os.path.isdir(folder):
        return []
    return sorted((name for name in os.listdir(folder) if name.isdigit() and os.path.isdir(os.path.join(folder, name))), key=int)


def skin_dirs(folder):
    """List the skin folders of a `skins/` folder: numeric skin ids in numeric order, then `legacy-<slug>` keys by name.

    Args:
        folder: The `skins/` folder, which may not exist.

    Returns:
        The skin folder names.
    """
    if not os.path.isdir(folder):
        return []
    names = [name for name in os.listdir(folder) if os.path.isdir(os.path.join(folder, name))]
    numeric = sorted((name for name in names if name.isdigit()), key=int)
    return numeric + sorted(name for name in names if name.startswith(LEGACY_SKIN_PREFIX))


def form_images(root, rel):
    """List the image kinds present for one form folder.

    Args:
        root: The asset tree root.
        rel: The form folder inside the tree, e.g. `tdolls/65/skins/805`.

    Returns:
        Image kinds in `V3_IMAGE_KINDS` order.
    """
    return [kind for kind, name in V3_IMAGE_FILES if os.path.isfile(os.path.join(root, rel, name))]


def scan_live2d_kind(kind_root, kind_files):
    """Scan one `live2d/fairies` or `live2d/hocs` folder for the ids that have any of a kind table's files.

    An id counts as having a kind only when all of that kind's files exist, mirroring `build_v3`'s image-kind scan.

    Args:
        kind_root: The `live2d/fairies` or `live2d/hocs` folder.
        kind_files: `V3_LIVE2D_FAIRY_FILES` or `V3_LIVE2D_HOC_FILES`.

    Returns:
        A dict of id to the kinds present for it, in `numeric_dirs` order.
    """
    ids = numeric_dirs(kind_root)
    return {entry_id: [kind for kind, files in kind_files if all(os.path.isfile(os.path.join(kind_root, entry_id, name)) for name in files)] for entry_id in ids}


def tdoll_skin_sort_key(key):
    """Sort key for a T-Doll skin Live2D key: `base` first, then numeric skin ids by number.

    Args:
        key: A skin key, `base` or a numeric skin id string.

    Returns:
        A tuple to sort by.
    """
    return (0, 0) if key == "base" else (1, int(key))


def iter_live2d_tdoll_variants(tdolls_root):
    """Walk `live2d/tdolls` and yield each skin model variant that exists, in the canonical order.

    A variant counts only when it holds both a `model.moc3` and a `model.model3.json`, so a half-written folder is not recorded as present.
    A stray file sitting where a form or skin folder is expected is skipped rather than crashing the walk. Dolls come in numeric id order,
    forms and variants by name, and skins by `tdoll_skin_sort_key`.

    Args:
        tdolls_root: The `live2d/tdolls` folder, which may not exist.

    Yields:
        A `(doll_id, form, skin, variant, variant_root)` tuple per present variant, with `variant_root` the variant's folder path.
    """
    if not os.path.isdir(tdolls_root):
        return
    for doll_id in numeric_dirs(tdolls_root):
        for form in sorted(os.listdir(os.path.join(tdolls_root, doll_id))):
            form_root = os.path.join(tdolls_root, doll_id, form)
            if not os.path.isdir(form_root):
                continue
            skin_names = sorted((name for name in os.listdir(form_root) if os.path.isdir(os.path.join(form_root, name))), key=tdoll_skin_sort_key)
            for skin in skin_names:
                skin_root = os.path.join(form_root, skin)
                for variant in sorted(os.listdir(skin_root)):
                    variant_root = os.path.join(skin_root, variant)
                    if os.path.isfile(os.path.join(variant_root, "model.moc3")) and os.path.isfile(os.path.join(variant_root, "model.model3.json")):
                        yield doll_id, form, skin, variant, variant_root


def scan_live2d_tdolls(tdolls_root):
    """Scan `live2d/tdolls` for the skin models that exist, by doll, form and skin.

    Args:
        tdolls_root: The `live2d/tdolls` folder, which may not exist.

    Returns:
        A dict of doll id to form to skin key to its sorted variant names, `base` before numeric skin ids, in numeric doll id order, with
        only the variants `iter_live2d_tdoll_variants` finds present. Empty when nothing is published.
    """
    entries = {}
    for doll_id, form, skin, variant, _variant_root in iter_live2d_tdoll_variants(tdolls_root):
        entries.setdefault(doll_id, {}).setdefault(form, {}).setdefault(skin, []).append(variant)
    return entries


def story_stems(folder, skip_damaged=False):
    """List the published filename stems in one story folder.

    Args:
        folder: The folder to read.
        skip_damaged: Whether to leave out the `_d` damaged poses, which are variants of a sprite rather than sprites of their own.

    Returns:
        The stems, sorted.
    """
    if not os.path.isdir(folder):
        return []
    stems = [name[: -len(".webp")] for name in os.listdir(folder) if name.endswith(".webp")]
    if skip_damaged:
        stems = [stem for stem in stems if not stem.endswith("_d")]
    return sorted(stems)


def build_story(assets_root):
    """List the story art the tree holds: which sprites and backgrounds are published, and whether the dialogue chrome is.

    Args:
        assets_root: The `assets` tree root.

    Returns:
        The `story` manifest block.
    """
    root = os.path.join(assets_root, "story")
    return {
        "sprites": story_stems(os.path.join(root, "sprites"), skip_damaged=True),
        "backgrounds": story_stems(os.path.join(root, "backgrounds")),
        "ui": len(story_stems(os.path.join(root, "ui"))) > 0,
        "audio": sorted(name[: -len(".opus")] for name in os.listdir(os.path.join(root, "audio"))) if os.path.isdir(os.path.join(root, "audio")) else [],
    }


def build_live2d(assets_root):
    """Scan the `live2d/` folder for fairy, HOC and T-Doll skin Live2D models.

    A fairy form or HOC model counts as present only when both of its files exist, mirroring `build_v3`'s image-kind scan. A skin
    variant counts the same way, via `scan_live2d_tdolls`. The shared texture and the `motions/` folder are not recorded here, only
    checked by `audit_assets.mjs`.

    Args:
        assets_root: The asset tree, holding `live2d/fairies/<id>/`, `live2d/hocs/<id>/` and `live2d/tdolls/<id>/<form>/<skin>/<variant>/`.

    Returns:
        The `live2d` manifest block: `fairies` and `hocs`, each keyed by id in numeric order with the kinds present for it, and `tdolls`,
        keyed by doll id, form and skin key with the variant names present for it.
    """
    live2d_root = os.path.join(assets_root, "live2d")
    fairies = scan_live2d_kind(os.path.join(live2d_root, "fairies"), V3_LIVE2D_FAIRY_FILES)
    hocs = scan_live2d_kind(os.path.join(live2d_root, "hocs"), V3_LIVE2D_HOC_FILES)
    tdolls = scan_live2d_tdolls(os.path.join(live2d_root, "tdolls"))
    return {"fairies": fairies, "hocs": hocs, "tdolls": tdolls}


def build_v3(assets_root):
    """Scan the staging tree and assemble the version 3 manifest.

    Args:
        assets_root: The asset tree, holding `tdolls/` cards, skill icons and full art, `equipment/<id>.png`, `hocs/<id>/` and
            `enemies/<id>/`, and `live2d/<fairies|hocs>/<id>/`.

    Returns:
        The manifest dict, dolls in numeric order, skins in `skin_dirs` order, `hocs`, `fairies` and `enemies` (always present, `{}` when none)
        keyed by id in numeric order with each value the image kinds that exist for it, and `live2d` (always present) from
        `build_live2d`.
    """
    doll_ids = numeric_dirs(os.path.join(assets_root, "tdolls"))
    dolls = {}
    for doll_id in doll_ids:
        base = f"tdolls/{doll_id}"
        record = {"normal": {"images": form_images(assets_root, base)}}
        if os.path.isdir(os.path.join(assets_root, base, "mod")):
            record["mod"] = {"images": form_images(assets_root, f"{base}/mod")}
        skin_ids = skin_dirs(os.path.join(assets_root, base, "skins"))
        skins = {}
        for skin_id in skin_ids:
            rel = f"{base}/skins/{skin_id}"
            skin = {"images": form_images(assets_root, rel)}
            mod_images = [kind for kind, name in V3_MOD_CARD_FILES if os.path.isfile(os.path.join(assets_root, rel, name))]
            if mod_images:
                skin["modImages"] = mod_images
            skins[skin_id] = skin
        if skins:
            record["skins"] = skins
        record["skills"] = [skill for skill in SKILL_KINDS if os.path.isfile(os.path.join(assets_root, base, f"{skill}.png"))]
        dolls[doll_id] = record

    equipment_dir = os.path.join(assets_root, "equipment")
    names = os.listdir(equipment_dir) if os.path.isdir(equipment_dir) else []
    equipment = sorted(int(name[:-4]) for name in names if name.endswith(".png") and name[:-4].isdigit())

    hoc_ids = numeric_dirs(os.path.join(assets_root, "hocs"))
    hocs = {hoc_id: [kind for kind, name in V3_HOC_IMAGE_FILES if os.path.isfile(os.path.join(assets_root, "hocs", hoc_id, name))] for hoc_id in hoc_ids}

    enemy_ids = numeric_dirs(os.path.join(assets_root, "enemies"))
    enemies = {
        enemy_id: [kind for kind, name in V3_ENEMY_IMAGE_FILES if os.path.isfile(os.path.join(assets_root, "enemies", enemy_id, name))] for enemy_id in enemy_ids
    }
    factions = sorted(faction_slugs(os.path.join(assets_root, "factions")))
    unit_ids = numeric_dirs(os.path.join(assets_root, "assimilation"))
    assimilation = {
        unit_id: [slot for slot in V3_ASSIMILATION_SKILLS if os.path.isfile(os.path.join(assets_root, "assimilation", unit_id, f"{slot}.png"))] for unit_id in unit_ids
    }
    fairy_ids = numeric_dirs(os.path.join(assets_root, "fairies"))
    fairies = {
        fairy_id: [kind for kind, name in V3_FAIRY_IMAGE_FILES if os.path.isfile(os.path.join(assets_root, "fairies", fairy_id, name))]
        for fairy_id in fairy_ids
    }

    live2d = build_live2d(assets_root)
    story = build_story(assets_root)

    return {
        "version": 3,
        "imageKinds": list(V3_IMAGE_KINDS),
        "equipment": equipment,
        "dolls": dolls,
        "hocs": hocs,
        "fairies": fairies,
        "enemies": enemies,
        "factions": factions,
        "live2d": live2d,
        # Last, so a manifest merged from an incremental staging tree matches this one: the merge appends a key the committed
        # manifest does not have yet, and `publish.py prepare` compares the two byte for byte.
        "assimilation": assimilation,
        "story": story,
    }


def dumps(manifest, indent=None):
    """Serialise a manifest exactly as it is written to disk.

    Args:
        manifest: The manifest dict from `build_v3`.
        indent: JSON indent, or None for the compact production form.

    Returns:
        The file contents, ending in a newline.
    """
    return json.dumps(manifest, indent=indent) + "\n"


def main():
    """Parse arguments, build the version 3 manifest and write it to disk."""
    parser = argparse.ArgumentParser(description="Generate the version 3 assets-manifest.json from the staging tree.")
    parser.add_argument("--assets", default="tools/assets/.staging/assets", help="The asset staging tree.")
    parser.add_argument("--out", default="assets-manifest.json", help="Where to write the manifest. Defaults to the repo root copy the site bundles.")
    parser.add_argument("--indent", type=int, default=None, help="JSON indent. Omit for the compact form used in production.")
    parser.add_argument("--v3", action="store_true", help="Ignored. Version 3 is the only format.")
    args = parser.parse_args()

    if not os.path.isdir(args.assets):
        sys.exit(f"the staging tree {args.assets} must exist. Run tools/assets/extract_game_assets.py first")

    manifest = build_v3(args.assets)
    with open(args.out, "w", encoding="utf-8") as handle:
        handle.write(dumps(manifest, args.indent))
    dolls = manifest["dolls"].values()
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.0f} KB, version 3)")
    print(f"  dolls        {len(manifest['dolls'])}")
    print(f"  mods         {sum(1 for doll in dolls if 'mod' in doll)}")
    print(f"  skins        {sum(len(doll.get('skins', {})) for doll in dolls)}")
    print(f"  equipment    {len(manifest['equipment'])}")
    print(f"  hocs         {len(manifest['hocs'])}")
    print(f"  fairies      {len(manifest['fairies'])}")
    print(f"  enemies      {len(manifest['enemies'])}")
    print(f"  factions     {len(manifest['factions'])}")
    print(f"  assimilation {len(manifest['assimilation'])}")
    print(f"  live2d fairies {len(manifest['live2d']['fairies'])}")
    print(f"  live2d hocs    {len(manifest['live2d']['hocs'])}")
    print(f"  live2d tdolls  {len(manifest['live2d']['tdolls'])}")


if __name__ == "__main__":
    main()
