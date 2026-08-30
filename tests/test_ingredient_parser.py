"""Coverage for the ingredient/direction quantity parser.

Cases mirror the format taxonomy actually present in `_recipes/` and
`_components/`: vulgar fractions, ASCII fractions, decimal commas, ranges,
glued units, every spoon notation, parentheticals, mid-string and trailing
quantities — plus the never-scale set (durations, temperatures, dimensions),
which is the one class where a false positive corrupts a recipe.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

from generate_recipe_scaling import parse_line, parse_number, pluralize, singularize


def qs(line, **kw):
    return [t["q"] for t in parse_line(line, **kw)]


def one(line, **kw):
    toks = parse_line(line, **kw)
    assert len(toks) == 1, f"expected 1 token, got {toks}"
    return toks[0]


# --- numbers --------------------------------------------------------------

@pytest.mark.parametrize("raw,expected", [
    ("400", 400), ("1,2", 1.2), ("1.5", 1.5),
    ("½", 0.5), ("¼", 0.25), ("¾", 0.75),
    ("1/2", 0.5), ("1 1/2", 1.5), ("1 ½", 1.5), ("1½", 1.5),
])
def test_parse_number(raw, expected):
    assert parse_number(raw) == pytest.approx(expected)


# --- units ----------------------------------------------------------------

def test_mass():
    t = one("400 g de morue séchée")
    assert (t["q"], t["cls"], t["m"], t["tpl"]) == (400, "mass", "400 g", "{q} g")


def test_glued_unit_keeps_spacing():
    t = one("80g de cuisse de poulet")
    assert t["m"] == "80g" and t["tpl"] == "{q}g"


def test_decimal_comma():
    t = one("1,2 kg d'épaule d'agneau")
    assert t["q"] == pytest.approx(1.2) and t["cls"] == "mass"


def test_volume():
    assert one("20 cl de fond de veau")["cls"] == "volume"
    assert one("300 ml de crème liquide")["cls"] == "volume"
    assert one("1 l d'eau")["cls"] == "volume"
    assert one("1 litre de bouillon")["cls"] == "volume"


@pytest.mark.parametrize("line", [
    "2 c. à s. d'estragon",
    "2 c. à c. de sel",
    "2 c à s d'huile",
    "1 cuillère à soupe de paprika",
    "3 cuillères à café de sucre",
])
def test_spoon_variants(line):
    assert one(line)["cls"] == "spoon"


def test_vulgar_fraction_spoon():
    t = one("½ c. à c. de poivre noir")
    assert t["q"] == 0.5 and t["cls"] == "spoon" and t["m"] == "½ c. à c."


def test_ascii_fraction():
    t = one("1 1/2 c. à s. de sauce soja")
    assert t["q"] == pytest.approx(1.5) and t["tpl"] == "{q} c. à s."


def test_pinch():
    assert one("1 pincée de noix de muscade")["cls"] == "pinch"


# --- counted nouns --------------------------------------------------------

def test_count_singular_gets_both_forms():
    t = one("1 oignon moyen")
    assert t["cls"] == "count"
    assert (t["sg"], t["pl"]) == ("oignon moyen", "oignons moyens")
    assert t["tpl"] == "{q} {n}"


def test_count_plural_normalises_through_singular():
    t = one("2 gousses d'ail")
    assert (t["m"], t["sg"], t["pl"]) == ("2 gousses", "gousse", "gousses")


def test_count_run_stops_at_preposition():
    assert one("6 tranches de pancetta")["sg"] == "tranche"


def test_count_x_plural():
    assert one("2 poireaux")["sg"] == "poireau"
    assert pluralize("morceau") == "morceaux"
    assert singularize("choux") == "chou"


def test_adjectives_agree_but_adverbs_do_not():
    t = one("2 gros oignons")
    assert (t["sg"], t["pl"]) == ("gros oignon", "gros oignons")
    t = one("3 œufs légèrement battus")
    assert (t["sg"], t["pl"]) == ("œuf légèrement battu", "œufs légèrement battus")


def test_piment_is_a_noun_not_an_adverb():
    t = one("2 longs piments rouges")
    assert (t["sg"], t["pl"]) == ("long piment rouge", "longs piments rouges")


def test_de_between_number_and_unit():
    t = one("¼ de c. à c. de curry en poudre")
    assert t["q"] == 0.25 and t["cls"] == "spoon" and t["m"] == "¼ de c. à c."


# --- agreement beyond the noun run ---------------------------------------

def test_trailing_participle_agrees_with_the_counted_noun():
    t = one("2 gousses d'ail pilées")
    assert t["m"] == "2 gousses d'ail pilées"
    assert (t["sg"], t["pl"]) == ("gousse d'ail pilée", "gousses d'ail pilées")


def test_several_trailing_participles():
    t = one("2 branches de céleri nettoyées et émincées")
    assert t["sg"] == "branche de céleri nettoyée et émincée"


def test_participle_agreeing_with_an_inner_plural_is_left_alone():
    """In "boîtes de tomates pelées", "pelées" belongs to "tomates"."""
    t = one("2 boîtes de tomates pelées")
    assert t["m"] == "2 boîtes" and t["sg"] == "boîte"


def test_trailing_noun_phrase_is_not_a_participle():
    assert one("40 carrés de pâte à raviolis")["m"] == "40 carrés"
    assert one("24 carrés de pâte pour pâtés impériaux")["m"] == "24 carrés"


def test_preparation_phrase_is_not_agreement():
    """"en dés" describes the cut, and must not be singularised to "en dé"."""
    t = one("1 oignon coupé en dés")
    assert t["m"] == "1 oignon coupé" and t["sg"] == "oignon coupé"


def test_ais_adjective_keeps_its_s():
    t = one("2 piments antillais rouges")
    assert (t["sg"], t["pl"]) == ("piment antillais rouge", "piments antillais rouges")


# --- quantity spelled out around the number -------------------------------

def test_et_demi_folds_into_the_quantity():
    t = one("1 gros oignon et demi")
    assert t["q"] == 1.5
    assert t["m"] == "1 gros oignon et demi"
    assert (t["tpl"], t["sg"]) == ("{q} {n}", "gros oignon")


def test_spelled_out_units_agree():
    t = one("2 pincées de piment de Cayenne")
    assert (t["cls"], t["tpl"], t["sg"], t["pl"]) == ("pinch", "{q} {n}", "pincée", "pincées")
    t = one("3 cuillères à soupe de ciboulette")
    assert (t["sg"], t["pl"]) == ("cuillère à soupe", "cuillères à soupe")
    t = one("2 litres d'eau")
    assert (t["sg"], t["pl"], t["u"]) == ("litre", "litres", "l")


def test_abbreviated_units_do_not_agree():
    t = one("2 c. à s. d'huile")
    assert "sg" not in t and t["tpl"] == "{q} c. à s."
    t = one("400 g de farine")
    assert "sg" not in t


def test_descending_pair_is_an_alternative_not_a_range():
    """"1 ou ½ piment" offers a choice; scaling both bounds is nonsense."""
    assert parse_line("1 ou ½ petit piment antillais rouge épépiné") == []


def test_ascending_range_is_still_a_range():
    t = one("5 ou 6 branches de persil plat ciselées")
    assert (t["q"], t["q2"]) == (5, 6)


def test_invariant_noun():
    t = one("3 noix de saint-jacques")
    assert (t["sg"], t["pl"]) == ("noix", "noix")


def test_discrete_packaging():
    assert one("1 sachet de levure chimique")["cls"] == "discrete"
    assert one("1 cube de bouillon")["cls"] == "discrete"


def test_range():
    t = one("3-4 gousses d'ail")
    assert (t["q"], t["q2"]) == (3, 4)
    assert t["tpl"] == "{q}-{q2} {n}"


def test_range_with_a():
    t = one("25 à 30 biscuits à la cuillère")
    assert (t["q"], t["q2"], t["sg"]) == (25, 30, "biscuit")


# --- position -------------------------------------------------------------

def test_mid_string_quantity():
    t = one("le jus de 1 citron vert")
    assert t["m"] == "1 citron vert"


def test_trailing_quantity():
    assert one("sel 1 g")["cls"] == "mass"


def test_parenthetical_weight_is_a_second_token():
    toks = parse_line("1 oignon jaune (150 g) grossièrement haché")
    assert [t["m"] for t in toks] == ["1 oignon jaune", "150 g"]


def test_two_quantities_on_one_line():
    toks = parse_line("Pour le beurre parfumé : 30 g de ghee, 1 c. à soupe de paprika fumé")
    assert [t["cls"] for t in toks] == ["mass", "spoon"]


def test_no_quantity():
    assert parse_line("Sel et poivre") == []
    assert parse_line("Huile d'olive") == []
    assert parse_line("Quelques brins de ciboulette") == []


# --- never scale ----------------------------------------------------------

@pytest.mark.parametrize("line", [
    "Cuire 20 min à feu doux",
    "Enfourner à 180 °C",
    "Préchauffer à 180 degrés",
    "Couper en morceaux de 2 cm",
    "Incorporer en 2 fois",
    "Laisser reposer 2 h",
    "Pour 4 personnes",
    "Réduire de 30 %",
])
def test_never_scaled(line):
    assert parse_line(line, allow_count=False) == []
    assert [t for t in parse_line(line, allow_count=True)] == []


def test_directions_ignore_bare_counts_but_keep_units():
    line = "Mélangez 70 g de beurre et la farine, puis laissez cuire 15 minutes"
    toks = parse_line(line, allow_count=False)
    assert [t["m"] for t in toks] == ["70 g"]


def test_directions_scale_volumes():
    toks = parse_line("Verser 15 cl d'eau puis 100 ml de crème", allow_count=False)
    assert [t["m"] for t in toks] == ["15 cl", "100 ml"]


# --- invariants -----------------------------------------------------------

@pytest.mark.parametrize("line", [
    "400 g de morue séchée et salée",
    "1 oignon jaune (150 g) grossièrement haché",
    "2 c. à s. d'estragon",
    "3-4 gousses d'ail",
])
def test_m_is_a_verbatim_substring(line):
    for t in parse_line(line):
        assert t["m"] in line


@pytest.mark.parametrize("line", [
    "400 g de morue",
    "1 oignon moyen",
    "2 gousses d'ail",
    "½ c. à c. de poivre",
    "3-4 gousses d'ail",
])
def test_template_reconstructs_the_original(line):
    """Substituting the parsed values back into `tpl` must yield `m` exactly."""
    for t in parse_line(line):
        def fmt(v):
            return str(int(v)) if float(v).is_integer() else str(v)
        out = t["tpl"]
        raw_nums = [n for n in (t.get("q"), t.get("q2")) if n is not None]
        out = out.replace("{q}", fmt(raw_nums[0]))
        if "q2" in t:
            out = out.replace("{q2}", fmt(t["q2"]))
        if "{n}" in out:
            noun = t["pl"] if (t["q"] > 1 or "q2" in t) else t["sg"]
            out = out.replace("{n}", noun)
        # Vulgar fractions and plural/singular normalisation are lossy by
        # design; compare only when the source used a plain integer.
        if raw_nums[0] == int(raw_nums[0]) and t["m"][0].isdigit():
            assert out == t["m"]
