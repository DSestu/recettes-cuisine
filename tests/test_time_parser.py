"""Coverage for the recipe time parser used by `backfill_times.py`.

Cases mirror the notations actually present in the corpus: both label families
(« Temps de cuisson : » and the bare « Cuisson : »), every duration format from
`30m` to `2 jours`, ranges, the passive-wait bucket, and the two traps that make
this parser non-trivial — an oven temperature that looks like a range
(« 20 min à 150 °C ») and the « Pour N personnes » sentence that must survive
stripping.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

from backfill_times import (
    is_pure_time_sentence,
    parse_duration,
    parse_sentence,
    process_body,
    split_sentences,
)


def times(text):
    found, _ = parse_sentence(text)
    return found


def body(*lines):
    found, out, residual = process_body([l + "\n" for l in lines])
    return found, [l.rstrip("\n") for l in out], residual


# --- duration formats -----------------------------------------------------

@pytest.mark.parametrize("text,minutes", [
    ("20 min", 20),
    ("45 minutes", 45),
    ("6 minutes", 6),
    ("30m", 30),
    ("1 h", 60),
    ("12 h", 720),
    ("1 heure", 60),
    ("2 heures", 120),
    ("1 h 30", 90),
    ("1h20", 80),
    ("1h05", 65),
    ("1 h 45", 105),
    ("1 heure 15", 75),
    ("1 heure 05 minutes", 65),
    ("3 h 20", 200),
    ("2 jours", 2880),
    ("1 nuit", 720),
    ("une nuit", 720),
    ("1 mois", 43200),
])
def test_duration_formats(text, minutes):
    assert parse_duration(text)[0] == minutes


def test_ranges_take_the_upper_bound():
    # A max-time filter must not promise a recipe is faster than it can be.
    assert parse_duration("25 à 30 minutes")[0] == 30
    assert parse_duration("15 à 20 min")[0] == 20
    assert parse_duration("1 h à 1 h 30")[0] == 90


def test_temperature_is_not_a_range():
    # « 20 min à 150 °C » is one duration and an oven setting, not 20-to-150.
    assert parse_duration("20 min à 150 °C")[0] == 20
    assert parse_duration("1 h 30 à 200 °C")[0] == 90


def test_approximation_prefix():
    assert parse_duration("environ 20 minutes")[0] == 20


def test_no_duration():
    assert parse_duration("...") is None
    assert parse_duration("à point, sans excès") is None


# --- labels ---------------------------------------------------------------

def test_long_and_short_label_families():
    assert times("Temps de préparation : 20 min.") == {"prep": 20}
    assert times("Préparation : 20 min.") == {"prep": 20}
    assert times("Temps de préparation: 30m") == {"prep": 30}
    assert times("Cuisson : 1h20.") == {"cook": 80}
    assert times("Cuisson au four : 45 min à 180 °C.") == {"cook": 45}


def test_passive_waits_share_one_bucket():
    for label in ("repos", "marinade", "dessalage", "trempage",
                  "réfrigération", "macération"):
        assert times(f"Temps de {label} : 3 h.") == {"rest": 180}


def test_same_category_sums():
    got = times("Temps de trempage : 30 min. Temps de repos : 1 h.")
    assert got == {"rest": 90}


def test_labels_do_not_borrow_the_next_value():
    # The placeholder recipe has no values at all; « préparation » must not be
    # credited with the cooking time that follows it.
    assert times("Temps de préparation : ... Temps de cuisson : ...") == {}


def test_label_without_colon_needs_a_digit():
    assert times("Repos 1 h au frais.") == {"rest": 60}
    assert times("Macération 1 mois.") == {"rest": 43200}
    # Prose that merely opens with the word is not a time statement.
    assert times("Marinade froide à base de vinaigre bouilli, ail et laurier.") == {}
    assert times("Marinade soja-miel réduite, parfaite pour la volaille.") == {}


def test_total_label_is_consumed_but_its_value_ignored():
    sentence = "Temps total : 1 h 25 (préparation 25 min, cuisson 1 h)."
    found, spans = parse_sentence(sentence)
    assert found == {"prep": 25, "cook": 60}
    assert is_pure_time_sentence(sentence, spans)


def test_difficulty_marker_is_consumed():
    sentence = "Cuisson : 1 h 10. Difficulté : ⚠️⚠️⚠️."
    found, spans = parse_sentence(sentence)
    assert found == {"cook": 70}
    assert is_pure_time_sentence(sentence, spans)


# --- sentence classification ----------------------------------------------

def test_pure_time_sentence_detection():
    for text in ("Temps de cuisson : 40 min.",
                 "Préparation : 20 min ; Cuisson : 1 h.",
                 "Temps de préparation : 20 minutes"):
        found, spans = parse_sentence(text)
        assert is_pure_time_sentence(text, spans), text


def test_sentences_carrying_extra_information_are_kept():
    # Prose the frontmatter cannot hold keeps its sentence in the body; the
    # backfill reports it rather than deleting information.
    for text in ("Cuisson : 20 min pour les grosses pièces, moins pour les petites.",
                 "Temps de repos : 3 h, idéalement la veille pour le lendemain."):
        found, spans = parse_sentence(text)
        assert found
        assert not is_pure_time_sentence(text, spans), text


def test_split_sentences_keeps_separators():
    assert split_sentences("A. B.") == ["A. ", "B."]


# --- body rewriting -------------------------------------------------------

def test_inline_paragraph_keeps_the_yield():
    found, out, _ = body(
        "Pour 4 personnes. Temps de préparation : 20 min. Temps de cuisson : 40 min.",
    )
    assert found == {"prep": 20, "cook": 40}
    assert out == ["Pour 4 personnes."]


def test_standalone_time_lines_disappear_with_their_blanks():
    found, out, _ = body(
        "",
        "Pour 4 personnes.",
        "",
        "Temps de préparation : 15 minutes",
        "",
        "Temps de cuisson : 10 minutes",
        "",
        "## Préparation",
    )
    assert found == {"prep": 15, "cook": 10}
    # The blank separating the frontmatter fence from the body is preserved.
    assert out == ["", "Pour 4 personnes.", "", "## Préparation"]


def test_description_prose_survives():
    found, out, _ = body(
        "Gâteau marbré moelleux pour 6 à 8 personnes.",
        "Temps de préparation : 20 minutes  ",
        "Temps de cuisson : 1 heure",
    )
    assert found == {"prep": 20, "cook": 60}
    assert out == ["Gâteau marbré moelleux pour 6 à 8 personnes."]


def test_directions_are_never_scanned():
    # Steps are full of durations (« laisser mijoter 20 minutes ») and of the
    # word « préparation »; only the description block above them is parsed.
    found, out, _ = body(
        "Pour 4 personnes.",
        "",
        "## Préparation",
        "",
        "- Laisser reposer 5 minutes, puis cuire 20 minutes.",
    )
    assert found == {}
    assert out[-1] == "- Laisser reposer 5 minutes, puis cuire 20 minutes."


def test_residual_sentence_is_reported_not_removed():
    line = "Pour 4 personnes. Cuisson : 20 min pour les grosses pièces."
    found, out, residual = body(line)
    assert found == {"cook": 20}
    assert out == [line]
    assert len(residual) == 1


def test_oven_temperature_sentence_is_stripped():
    # Every oven temperature in the corpus is restated in the steps below.
    found, out, residual = body(
        "Pour 4 personnes. Temps de cuisson : 1 h 30 à 200 °C.",
    )
    assert found == {"cook": 90}
    assert out == ["Pour 4 personnes."]
    assert residual == []


# --- trailing qualifiers --------------------------------------------------

@pytest.mark.parametrize("sentence,expected", [
    ("Temps de cuisson : 1 h 30 à 200 °C.", {"cook": 90}),
    ("Cuisson au four : 45 min à 180 °C.", {"cook": 45}),
    ("Temps de repos : 3 h au réfrigérateur.", {"rest": 180}),
    ("Réfrigération : 1 h minimum.", {"rest": 60}),
    ("Repos 1 h au frais.", {"rest": 60}),
    ("Temps de cuisson : environ 20 minutes", {"cook": 20}),
])
def test_qualifiers_are_absorbed(sentence, expected):
    # Oven temperatures and « au réfrigérateur » are always restated in the
    # steps, so consuming them lets the sentence be stripped whole.
    found, spans = parse_sentence(sentence)
    assert found == expected
    assert is_pure_time_sentence(sentence, spans)


def test_continuation_legs_are_summed():
    sentence = "Temps de cuisson : 1 h au four à 180 °C, puis 15 min."
    found, spans = parse_sentence(sentence)
    assert found == {"cook": 75}
    assert is_pure_time_sentence(sentence, spans)

    sentence = "Temps de repos : 30 min au réfrigérateur puis 5 min après cuisson."
    found, spans = parse_sentence(sentence)
    assert found == {"rest": 35}
    assert is_pure_time_sentence(sentence, spans)
