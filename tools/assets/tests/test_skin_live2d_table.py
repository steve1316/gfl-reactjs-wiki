"""Tests for the stc/live2d.json join that picks which skin Live2D models to build."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from skin_live2d_table import parse_motion_ids, skin_live2d_models  # noqa: E402


def row(code, fit_gun, skin, motions="1,2"):
    """Build one stc/live2d.json row.

    Args:
        code: The row's `code`, which names its bundle.
        fit_gun: The doll id, offset by 20000 for a Mod.
        skin: The skin id, or 0 for base art.
        motions: The row's comma separated motion id list.

    Returns:
        The row dict.
    """
    return {"code": code, "fit_gun": fit_gun, "skin": skin, "motions": motions}


def test_base_and_mod_in_one_skin_stay_separate():
    rows = [row("AR15_4508", 57, 4508), row("AR15Mod", 20057, 4508)]
    names = {"live2dnew_gun_ar15_4508", "live2dnew_gun_ar15mod"}
    models = skin_live2d_models(rows, names, {57})
    keys = {(m["doll_id"], m["form"], m["skin_key"]): m["bundle"] for m in models}
    assert keys == {
        (57, "base", "4508"): "live2dnew_gun_ar15_4508",
        (57, "mod", "4508"): "live2dnew_gun_ar15mod",
    }


def test_mod_row_without_its_own_bundle_falls_back_to_the_base_skin_bundle():
    rows = [row("UMP45Mod_3403", 20103, 3403)]
    models = skin_live2d_models(rows, {"live2dnew_gun_ump45_3403"}, {103})
    assert len(models) == 1
    assert models[0]["doll_id"] == 103
    assert models[0]["form"] == "mod"
    assert models[0]["skin_key"] == "3403"
    assert models[0]["bundle"] == "live2dnew_gun_ump45_3403"


def test_base_art_rows_use_the_base_skin_key():
    models = skin_live2d_models([row("M4A1Mod", 20055, 0)], {"live2dnew_gun_m4a1mod"}, {55})
    assert models[0]["skin_key"] == "base"
    assert models[0]["form"] == "mod"


def test_non_doll_rows_are_dropped():
    # The cg scenes and NPCs carry fit_gun 0 or -1, so a `!= -1` test would wrongly keep the cg rows.
    rows = [row("cg6", 0, 0), row("NPC_Kalina", -1, 0), row("NPC_William_live2d", 0, 0)]
    assert skin_live2d_models(rows, {"live2dnew_gun_cg6"}, {1}) == []


def test_rows_for_dolls_we_do_not_host_are_dropped():
    assert skin_live2d_models([row("G36C_1202", 104, 1202)], {"live2dnew_gun_g36c_1202"}, set()) == []


def test_rows_with_no_bundle_are_dropped():
    assert skin_live2d_models([row("G36C_1202", 104, 1202)], set(), {104}) == []


def test_motion_ids_are_parsed_from_the_newline_littered_column():
    assert parse_motion_ids("1000,1001\n,1002\n,1003") == [1000, 1001, 1002, 1003]


def test_models_are_sorted_and_deduplicated():
    rows = [row("G36C_1202", 104, 1202), row("G36C_1202", 104, 1202)]
    models = skin_live2d_models(rows, {"live2dnew_gun_g36c_1202"}, {104})
    assert len(models) == 1
