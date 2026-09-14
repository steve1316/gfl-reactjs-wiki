"""Unit tests for `game_bundles`, run with `python3 -m unittest discover tools/assets/tests`.

Everything runs against the small fixture tree next to this file. No test touches the network.
"""

import hashlib
import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import game_bundles  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Fixtures

FIXTURES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures")
GF_DATA = os.path.join(FIXTURES, "gf-data")
SITE_DATA = os.path.join(FIXTURES, "site")


def build_fixture_inventory():
    """Build the inventory for the fixture tree.

    Returns:
        The inventory dict produced by `game_bundles.inventory_from_paths`.
    """
    return game_bundles.inventory_from_paths(os.path.join(FIXTURES, "resdata_no_hash.json"), GF_DATA, SITE_DATA)


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Resolution


class ResolutionTests(unittest.TestCase):
    """Bundle naming, the `_nom` fallback and per-asset confirmation."""

    @classmethod
    def setUpClass(cls):
        """Build the fixture inventory once for every test in the class."""
        cls.inventory = build_fixture_inventory()
        cls.items = {item["key"]: item for item in cls.inventory["items"]}

    def test_base_art_uses_plain_bundle(self):
        """A doll with a plain `character_<code>` bundle resolves all three art files from it."""
        item = self.items["art:1"]
        self.assertEqual(item["status"], "resolved")
        self.assertEqual(item["bundles"], ["character_m1873"])
        self.assertEqual(item["assets"]["full"]["path"], "Assets/Characters/M1873/Pic/pic_M1873.png")
        self.assertEqual(item["assets"]["card"]["path"], "Assets/Characters/M1873/Pic/pic_M1873_N.jpg")
        self.assertEqual(item["sizeOriginal"], 1000)

    def test_nom_fallback_when_plain_bundle_lacks_the_art(self):
        """A plain bundle that exists but lacks the art falls back to `_nom`, never `_he`."""
        item = self.items["art:233"]
        self.assertEqual(item["status"], "resolved")
        self.assertEqual(item["bundles"], ["character_px4storm_nom"])
        skin = self.items["skin_art:233:2801"]
        self.assertEqual(skin["bundles"], ["character_px4storm_2801_nom"])
        self.assertNotIn("character_px4storm_he", self.inventory["bundles"])
        self.assertNotIn("character_px4storm", self.inventory["bundles"])

    def test_mod_naming(self):
        """Mod art and rigs come from `character_<code>mod` and its `_spine` bundle."""
        self.assertEqual(self.items["mod_art:1"]["bundles"], ["character_m1873mod"])
        self.assertEqual(self.items["mod_spine:1"]["bundles"], ["character_m1873mod_spine"])
        self.assertNotIn("mod_art:163", self.items)

    def test_skin_naming_and_mod_card(self):
        """Skins resolve `character_<code>_<skinId>` and pick up the Mod card when the doll has a Mod."""
        item = self.items["skin_art:1:301"]
        self.assertEqual(item["status"], "resolved")
        self.assertEqual(item["assets"]["mod_card"]["path"], "Assets/Characters/M1873_301/Pic/pic_M1873_301_N_mod.jpg")
        self.assertNotIn("mod_card", self.items["skin_art:233:2801"]["assets"])

    def test_spine_stem_fallback_for_renamed_rig_files(self):
        """A `_spine` bundle whose files use another stem, like `Gsh-18_523`, resolves to that stem."""
        item = self.items["skin_spine:1:302"]
        self.assertEqual(item["status"], "resolved")
        self.assertEqual(item["code"], "M-1873_302")
        self.assertEqual(item["assets"]["skel"]["path"], "Assets/Characters/M1873_302/Spine/M-1873_302.skel.bytes")
        self.assertEqual(item["assets"]["dorm_skel"]["path"], "Assets/Characters/M1873_302/Spine/RM-1873_302.skel.bytes")

    def test_null_skin_ids_are_skipped(self):
        """Skins without an id produce no item."""
        self.assertEqual(sorted(k for k in self.items if k.startswith("skin_art:163:")), ["skin_art:163:902"])

    def test_legacy_skin_keys_are_skipped(self):
        """`legacy-<slug>` keys have no game bundle, so they produce neither an art nor a Spine item."""
        self.assertFalse([key for key in self.items if "legacy-" in key])

    def test_spine_naming_and_art_bundle_fallback(self):
        """Rigs come from `_spine`, or from the art bundle when that holds the skeleton."""
        self.assertEqual(self.items["spine:1"]["bundles"], ["character_m1873_spine"])
        self.assertEqual(self.items["spine:1"]["assets"]["dorm_skel"]["path"], "Assets/Characters/M1873/Spine/RM1873.skel.bytes")
        self.assertEqual(self.items["spine:163"]["bundles"], ["character_aa12"])
        self.assertEqual(self.items["spine:163"]["status"], "resolved")
        skin_rig = self.items["skin_spine:1:301"]
        self.assertEqual(skin_rig["status"], "resolved")
        self.assertNotIn("dorm_skel", skin_rig["assets"])

    def test_code_overrides_resolve_collab_dolls(self):
        """Collaboration dolls with no `gun` row use the codename overrides from `download_spine`."""
        self.assertEqual(self.items["art:1003"]["bundles"], ["character_kiana"])
        self.assertEqual(self.items["spine:1003"]["bundles"], ["character_kiana_spine"])

    def test_shared_icons(self):
        """Skill icons come from the SkillIcon folder of `sprites_ui` and equipment icons carry their alpha."""
        skill = self.items["skill_icon:powBuff"]
        self.assertEqual(skill["assets"]["icon"]["path"], "Assets/Sprites/UI/Icon/SkillIcon/powBuff.png")
        self.assertEqual(skill["users"], [[1, "skill1"], [163, "skill1"]])
        equip = self.items["equip_icon:1"]
        self.assertEqual(equip["bundles"], ["resource_icon_equip"])
        self.assertEqual(equip["assets"]["alpha"]["path"], "Assets/Resources/DaBao/Pics/Icons/Equip/scope_N_Alpha.png")
        self.assertNotIn("alpha", self.items["equip_icon:2"]["assets"])

    def test_skill_icon_alias(self):
        """A skill code whose icon file carries another name resolves through the alias table."""
        item = self.items["skill_icon:c93"]
        self.assertEqual(item["status"], "resolved")
        self.assertEqual(item["assets"]["icon"]["path"], "Assets/Sprites/UI/Icon/SkillIcon/c93G.png")

    def test_partial_items(self):
        """A bundle missing some required files is reported as partial with the missing roles."""
        item = self.items["skin_art:163:902"]
        self.assertEqual(item["status"], "partial")
        self.assertEqual(item["missing"], ["full_d", "card"])
        self.assertEqual(self.inventory["summary"]["partial"], [{"key": "skin_art:163:902", "missing": ["full_d", "card"]}])

    def test_unresolved_reporting(self):
        """Known gaps are split from unexpected ones."""
        summary = self.inventory["summary"]
        expected = {entry["key"] for entry in summary["unresolved_expected"]}
        unexpected = {entry["key"] for entry in summary["unresolved_unexpected"]}
        self.assertEqual(expected, {"skill_icon:ma"})
        self.assertEqual(
            unexpected,
            {"art:999", "spine:999", "skill_icon:ghostSkill", "skin_art:1:302", "skin_spine:163:902", "skin_spine:233:2801", "equip_icon:3"},
        )

    def test_collab_skill_slots_are_legacy_sourced(self):
        """A collaboration doll's skill slot has no codename, so it is carried from the old repo rather than counted as a gap."""
        item = self.items["skill_icon:doll:1003:skill1"]
        self.assertEqual((item["status"], item["source"], item["users"], item["bundles"]), ("legacy", "legacy", [[1003, "skill1"]], []))
        self.assertEqual([entry["key"] for entry in self.inventory["summary"]["legacy"]], ["skill_icon:doll:1003:skill1"])
        self.assertEqual(self.inventory["summary"]["tiers"]["skill_icon"]["legacy"], 1)

    def test_file_hash_is_normalised(self):
        """ResData's dashed upper-case `fileHash` becomes a plain SHA-1 digest, and anything else is dropped."""
        self.assertEqual(game_bundles.normalise_file_hash("DA-D3-32-A0-79-8A-F6-10-B9-64-A8-ED-C0-B5-8F-30-17-05-B1-D2"), "dad332a0798af610b964a8edc0b58f301705b1d2")
        self.assertIsNone(game_bundles.normalise_file_hash(None))
        self.assertIsNone(game_bundles.normalise_file_hash("12-34"))

    def test_summary_counts_and_bundle_totals(self):
        """Tier counts and the deduplicated download total match the fixture."""
        summary = self.inventory["summary"]
        self.assertEqual(summary["tiers"]["art"], {"items": 5, "resolved": 4, "partial": 0, "unresolved": 1, "legacy": 0})
        self.assertEqual(summary["tiers"]["skin_art"], {"items": 4, "resolved": 2, "partial": 1, "unresolved": 1, "legacy": 0})
        self.assertEqual(summary["tiers"]["equip_icon"], {"items": 3, "resolved": 2, "partial": 0, "unresolved": 1, "legacy": 0})
        self.assertEqual(summary["bundle_count"], 16)
        self.assertEqual(summary["download_bytes"], 18250)
        self.assertEqual(self.inventory["bundles"]["sprites_ui"], {"resname": "hashspritesui", "sizeOriginal": 5000})

    def test_ui_bundles_are_downloaded_when_listed(self):
        """UI bundles the extractor needs join the download list when ResData has them, and are skipped otherwise."""
        index = {"atlasclips_listequipment": {"resname": "hashframe", "sizeOriginal": 7, "files": []}}
        _summary, bundles = game_bundles.summarise([], index)
        self.assertEqual(bundles, {"atlasclips_listequipment": {"resname": "hashframe", "sizeOriginal": 7}})
        self.assertEqual(game_bundles.summarise([], {})[1], {})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Download


class FakeFetcher:
    """Record fetches and write bytes, optionally failing or writing the wrong size first."""

    def __init__(self, sizes, failures=None, short_writes=None):
        """Set up the fake.

        Args:
            sizes: Map of URL to the number of bytes to write.
            failures: Map of URL to how many leading calls raise before a success.
            short_writes: Map of URL to how many leading calls write one byte too few.
        """
        self.sizes = sizes
        self.failures = dict(failures or {})
        self.short_writes = dict(short_writes or {})
        self.calls = []

    def __call__(self, url, dest):
        """Pretend to download `url` into `dest`.

        Args:
            url: The requested URL.
            dest: The file path to write.

        Raises:
            OSError: While the URL still has failures queued.
        """
        self.calls.append(url)
        if self.failures.get(url, 0) > 0:
            self.failures[url] -= 1
            raise OSError("simulated network error")
        size = self.sizes[url]
        if self.short_writes.get(url, 0) > 0:
            self.short_writes[url] -= 1
            size -= 1
        with open(dest, "wb") as handle:
            handle.write(b"x" * size)


def bundle_names(cache):
    """List the cached bundle files, leaving out the cache index sidecar.

    Args:
        cache: The bundle cache directory.

    Returns:
        Sorted `.ab` file names.
    """
    return sorted(name for name in os.listdir(cache) if name.endswith(".ab"))


class DownloadTests(unittest.TestCase):
    """Cache skipping, retries and verification with an injected fetcher."""

    def setUp(self):
        """Create a scratch cache directory and a two-bundle plan."""
        self.tmp = tempfile.TemporaryDirectory()
        self.cache = self.tmp.name
        self.bundles = {"character_a": {"resname": "resA", "sizeOriginal": 10}, "character_b": {"resname": "resB", "sizeOriginal": 20}}
        self.urls = {"http://cdn/resA.ab": 10, "http://cdn/resB.ab": 20}
        self.sleeps = []

    def tearDown(self):
        """Remove the scratch cache."""
        self.tmp.cleanup()

    def run_download(self, fetcher):
        """Run the downloader against the scratch cache.

        Args:
            fetcher: The injected fetch callable.

        Returns:
            The result dict from `game_bundles.download_bundles`.
        """
        return game_bundles.download_bundles(self.bundles, "http://cdn/", self.cache, fetch=fetcher, sleep=self.sleeps.append, log=lambda _msg: None)

    def write_cached(self, name, size):
        """Put a fake cached bundle in place.

        Args:
            name: Bundle name.
            size: Byte count to write.
        """
        with open(os.path.join(self.cache, f"{name}.ab"), "wb") as handle:
            handle.write(b"y" * size)

    def test_downloads_missing_bundles_to_named_files(self):
        """Missing bundles are fetched from `resUrl + resname + .ab` into `<name>.ab`."""
        fetcher = FakeFetcher(self.urls)
        result = self.run_download(fetcher)
        self.assertEqual(sorted(fetcher.calls), ["http://cdn/resA.ab", "http://cdn/resB.ab"])
        self.assertEqual(sorted(result["downloaded"]), ["character_a", "character_b"])
        self.assertEqual(result["bytes"], 30)
        self.assertEqual(os.path.getsize(os.path.join(self.cache, "character_b.ab")), 20)
        self.assertFalse([f for f in os.listdir(self.cache) if f.endswith(".part")])

    def test_skips_bundle_cached_under_the_same_resname(self):
        """A bundle recorded under its current resname at the right size is not fetched again, a wrong-sized one is."""
        self.run_download(FakeFetcher(self.urls))
        self.write_cached("character_b", 5)
        fetcher = FakeFetcher(self.urls)
        result = self.run_download(fetcher)
        self.assertEqual(fetcher.calls, ["http://cdn/resB.ab"])
        self.assertEqual(result["skipped"], ["character_a"])
        self.assertEqual(result["downloaded"], ["character_b"])
        self.assertEqual(os.path.getsize(os.path.join(self.cache, "character_b.ab")), 20)

    def test_a_new_resname_of_the_same_size_is_downloaded_again(self):
        """An updated bundle keeps its name and can keep its size, so a changed resname alone forces a fresh download."""
        self.run_download(FakeFetcher(self.urls))
        self.bundles["character_a"] = {"resname": "resA2", "sizeOriginal": 10}
        fetcher = FakeFetcher({"http://cdn/resA2.ab": 10})
        result = self.run_download(fetcher)
        self.assertEqual(fetcher.calls, ["http://cdn/resA2.ab"])
        self.assertEqual(game_bundles.read_cache_index(self.cache)["character_a"], {"resname": "resA2", "size": 10})

    def test_unrecorded_bundle_is_adopted_only_when_its_sha1_matches(self):
        """A bundle cached before the index existed is adopted without a download when its hash matches ResData, and fetched otherwise."""
        self.write_cached("character_a", 10)
        self.write_cached("character_b", 20)
        self.bundles["character_a"]["sha1"] = hashlib.sha1(b"y" * 10).hexdigest()
        self.bundles["character_b"]["sha1"] = hashlib.sha1(b"x" * 20).hexdigest()
        fetcher = FakeFetcher(self.urls)
        result = self.run_download(fetcher)
        self.assertEqual(fetcher.calls, ["http://cdn/resB.ab"])
        self.assertEqual((result["skipped"], result["migrated"], result["downloaded"]), (["character_a"], ["character_a"], ["character_b"]))
        index = game_bundles.read_cache_index(self.cache)
        self.assertEqual(index["character_a"], {"resname": "resA", "size": 10, "sha1": self.bundles["character_a"]["sha1"]})
        fetcher = FakeFetcher(self.urls)
        self.assertEqual((self.run_download(fetcher)["downloaded"], fetcher.calls), ([], []))

    def test_unrecorded_bundle_without_a_hash_is_downloaded(self):
        """With no `fileHash` to prove an unrecorded file, size alone is not trusted."""
        self.write_cached("character_a", 10)
        fetcher = FakeFetcher(self.urls)
        self.run_download(fetcher)
        self.assertIn("http://cdn/resA.ab", fetcher.calls)

    def test_download_with_the_wrong_sha1_counts_as_a_failed_attempt(self):
        """A download whose bytes do not hash to ResData's `fileHash` is never cached."""
        self.bundles["character_a"]["sha1"] = "0" * 40
        result = self.run_download(FakeFetcher(self.urls))
        self.assertEqual([entry["name"] for entry in result["failed"]], ["character_a"])
        self.assertNotIn("character_a", game_bundles.read_cache_index(self.cache))

    def test_retries_with_exponential_backoff(self):
        """Transient failures are retried with doubling sleeps."""
        fetcher = FakeFetcher(self.urls, failures={"http://cdn/resA.ab": 2})
        result = self.run_download(fetcher)
        self.assertEqual(fetcher.calls.count("http://cdn/resA.ab"), 3)
        self.assertEqual(result["failed"], [])
        self.assertEqual(self.sleeps, [game_bundles.BACKOFF_SECONDS, game_bundles.BACKOFF_SECONDS * 2])

    def test_gives_up_after_three_attempts(self):
        """A bundle failing every attempt is reported and leaves no file behind."""
        fetcher = FakeFetcher(self.urls, failures={"http://cdn/resA.ab": 5})
        result = self.run_download(fetcher)
        self.assertEqual(fetcher.calls.count("http://cdn/resA.ab"), game_bundles.ATTEMPTS)
        self.assertEqual([entry["name"] for entry in result["failed"]], ["character_a"])
        self.assertEqual(bundle_names(self.cache), ["character_b.ab"])

    def test_size_mismatch_counts_as_a_failed_attempt(self):
        """A short download is retried rather than cached."""
        fetcher = FakeFetcher(self.urls, short_writes={"http://cdn/resB.ab": 1})
        result = self.run_download(fetcher)
        self.assertEqual(fetcher.calls.count("http://cdn/resB.ab"), 2)
        self.assertEqual(result["failed"], [])
        self.assertEqual(os.path.getsize(os.path.join(self.cache, "character_b.ab")), 20)

    def test_verify_cache(self):
        """Verification lists bundles that are missing, the wrong size, or recorded under another resname."""
        self.run_download(FakeFetcher({"http://cdn/resA.ab": 10}, failures={"http://cdn/resB.ab": 5}))
        self.assertEqual(game_bundles.verify_cache(self.bundles, self.cache), [{"name": "character_b", "check": "size", "expected": 20, "actual": None}])
        self.write_cached("character_b", 19)
        self.assertEqual(game_bundles.verify_cache(self.bundles, self.cache), [{"name": "character_b", "check": "size", "expected": 20, "actual": 19}])
        self.write_cached("character_b", 20)
        self.assertEqual(game_bundles.verify_cache(self.bundles, self.cache), [{"name": "character_b", "check": "resname", "expected": "resB", "actual": None}])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# New targets


def site_doll(doll_id, mod=False, skin_ids=None):
    """Build a minimal site doll record.

    Args:
        doll_id: The doll id.
        mod: Whether the doll has a Mod.
        skin_ids: Skin ids, or None for no skins.

    Returns:
        A doll dict shaped like the site shards.
    """
    return {"normal": {"id": doll_id}, "mod": {"id": doll_id} if mod else None, "skins": {"skin_ids": skin_ids} if skin_ids else None}


class NewTargetTests(unittest.TestCase):
    """Selecting only the dolls, Mods, skins and equipment the committed manifest does not list."""

    def setUp(self):
        self.manifest = {
            "equipment": [1, 2],
            "dolls": {
                "65": {"normal": {"images": ["card"]}, "mod": {"images": ["card"]}, "skins": {"805": {"images": ["card"]}}, "skills": ["skill1", "skill2"]},
                "95": {"normal": {"images": ["card"]}, "skins": {"1809": {"images": ["card"]}}, "skills": ["skill1"]},
                "100": {"normal": {"images": ["card"]}, "skills": ["skill1"]},
            },
        }
        dolls = [site_doll(65, mod=True, skin_ids=[805, 9001]), site_doll(95, skin_ids=[1809, "legacy-x", None]), site_doll(100, mod=True), site_doll(424)]
        self.targets = game_bundles.new_targets(dolls, [1, 2, 3], self.manifest)

    def test_targets(self):
        """A missing doll, a missing Mod, a missing numeric skin and a missing equipment id are the targets."""
        self.assertEqual(self.targets, {"dolls": {424}, "mods": {100}, "skins": {(65, 9001)}, "equipment": {3}})

    def test_selects_forms_of_new_targets(self):
        """Art and rigs follow their form, and hosted forms, known gaps and legacy items are never selected."""
        items = [
            {"key": "art:424", "tier": "art", "doll_id": 424},
            {"key": "spine:424", "tier": "spine", "doll_id": 424},
            {"key": "art:65", "tier": "art", "doll_id": 65},
            {"key": "mod_art:100", "tier": "mod_art", "doll_id": 100},
            {"key": "mod_spine:100", "tier": "mod_spine", "doll_id": 100},
            {"key": "skin_art:65:9001", "tier": "skin_art", "doll_id": 65, "skin_id": 9001},
            {"key": "skin_spine:95:1809", "tier": "skin_spine", "doll_id": 95, "skin_id": 1809},
            {"key": "equip_icon:3", "tier": "equip_icon", "equip_id": 3},
            {"key": "equip_icon:1", "tier": "equip_icon", "equip_id": 1},
            {"key": "skill_icon:doll:1005:skill1", "tier": "skill_icon", "source": "legacy", "users": [[424, "skill1"]]},
        ]
        keys = [item["key"] for item in game_bundles.select_new_items(items, self.targets)]
        self.assertEqual(keys, ["art:424", "spine:424", "mod_art:100", "mod_spine:100", "skin_art:65:9001", "equip_icon:3"])

    def test_skill_icons_keep_only_new_slots(self):
        """A shared skill icon keeps only the slots of new dolls and new Mods, so hosted icons are never rewritten."""
        items = [
            {"key": "skill_icon:ar", "tier": "skill_icon", "users": [[65, "skill1"], [424, "skill1"], [100, "skill2"], [100, "skill1"]]},
            {"key": "skill_icon:mg4", "tier": "skill_icon", "users": [[95, "skill1"]]},
        ]
        selected = game_bundles.select_new_items(items, self.targets)
        self.assertEqual(selected, [{"key": "skill_icon:ar", "tier": "skill_icon", "users": [[424, "skill1"], [100, "skill2"]]}])
        self.assertEqual(items[0]["users"], [[65, "skill1"], [424, "skill1"], [100, "skill2"], [100, "skill1"]])

    def test_only_missing_problems(self):
        """Unexpected unresolved items and partial items stop an only-missing run, expected gaps do not."""
        summary = {
            "unresolved_expected": [{"key": "skill_icon:mg4"}],
            "unresolved_unexpected": [{"key": "art:424", "reason": "no bundle holds the files"}],
            "partial": [{"key": "skin_art:65:9001", "missing": ["card"]}],
        }
        problems = game_bundles.only_missing_problems({"summary": summary})
        self.assertEqual(problems, ["art:424 is unresolved: no bundle holds the files", "skin_art:65:9001 is missing card"])

    def test_expected_missing_rig_is_not_a_problem(self):
        """A skin rig the game does not ship is an expected gap, so it never stops an only-missing run."""
        item = {"key": "skin_spine:95:1809", "tier": "skin_spine", "doll_id": 95, "skin_id": 1809, "status": "unresolved", "bundles": []}
        summary, _bundles = game_bundles.summarise([item], {}, include_ui=False)
        self.assertEqual([entry["key"] for entry in summary["unresolved_expected"]], ["skin_spine:95:1809"])
        self.assertEqual(summary["unresolved_unexpected"], [])
        self.assertEqual(game_bundles.only_missing_problems({"summary": summary}), [])

    def test_ui_bundle_only_with_equipment(self):
        """The equipment UI bundle is left out when asked, and kept by default."""
        index = {"atlasclips_listequipment": {"resname": "x", "sizeOriginal": 5}}
        _summary, bundles = game_bundles.summarise([], index, include_ui=False)
        self.assertEqual(bundles, {})
        _summary, bundles = game_bundles.summarise([], index)
        self.assertEqual(list(bundles), ["atlasclips_listequipment"])

    def test_fixture_inventory_with_manifest(self):
        """With a manifest listing nothing, the fixture inventory is flagged and keeps its items, and a manifest listing everything empties it."""
        with tempfile.TemporaryDirectory() as scratch:
            empty = os.path.join(scratch, "empty.json")
            with open(empty, "w", encoding="utf-8") as handle:
                json.dump({"equipment": [], "dolls": {}}, handle)
            inventory = game_bundles.inventory_from_paths(os.path.join(FIXTURES, "resdata_no_hash.json"), GF_DATA, SITE_DATA, empty)
            self.assertTrue(inventory["onlyMissing"])
            self.assertTrue(any(item["tier"] == "art" for item in inventory["items"]))

            dolls, equipment_ids = game_bundles.load_site(SITE_DATA)
            full = {"equipment": equipment_ids, "dolls": {}}
            for doll in dolls:
                skins = {str(skin_id): {"images": ["card"]} for skin_id in ((doll.get("skins") or {}).get("skin_ids") or []) if isinstance(skin_id, int)}
                full["dolls"][str(doll["normal"]["id"])] = {"normal": {"images": ["card"]}, "mod": {"images": ["card"]}, "skins": skins, "skills": []}
            listed = os.path.join(scratch, "full.json")
            with open(listed, "w", encoding="utf-8") as handle:
                json.dump(full, handle)
            inventory = game_bundles.inventory_from_paths(os.path.join(FIXTURES, "resdata_no_hash.json"), GF_DATA, SITE_DATA, listed)
            self.assertEqual(inventory["items"], [])
            self.assertEqual(inventory["bundles"], {})


if __name__ == "__main__":
    unittest.main()
