#!/usr/bin/env python3
"""Generate `_data/scaling.json` — quantity tokens for the servings scaler.

Every ingredient line (and every frontmatter `directions:` line) of
`_recipes/` and `_components/` is parsed into *quantity tokens*: the number,
its unit class, and a template that lets the client re-render the same phrase
with a scaled number. Free text between tokens is not emitted — the client
locates each token in the DOM by its literal `m` substring, which survives
kramdown wrapping (`<strong>`, `<em>`, links) and the checkbox script's
re-parenting of `<li>` children.

Output lives in `_data/` rather than `assets/data/` so Liquid can inline only
the current page's slice (see `_includes/recipe-scaler.html`), the same
rationale as `_includes/recipe-seasonality.html`.

Schema:

    {
      "_recipes/foo.md": {
        "servings": 4,
        "servings_unit": "personnes",
        "ing": {"0": [<token>, ...], "3": [...]},   # sparse, by list index
        "dir": {"1": [<token>, ...]}                # frontmatter directions only
      }
    }

A token is:

    {"q": 400, "cls": "mass", "m": "400 g", "tpl": "{q} g"}
    {"q": 2, "q2": 3, "cls": "count", "m": "2 à 3 gousses",
     "tpl": "{q} à {q2} {n}", "sg": "gousse", "pl": "gousses"}

`tpl` placeholders: `{q}` / `{q2}` for the numbers, `{n}` for the noun run
(rendered singular or plural by the client). `m` is the exact substring as it
appears in the source line.

Directions are parsed with `allow_count=False`: a bare number in prose ("en 2
fois", "couper en 4") is not a quantity, so only whitelisted units scale.
Times, temperatures and dimensions are never tokenised, in ingredients or
directions.

Run: `uv run python scripts/generate_recipe_scaling.py [--stats]`
"""
# /// script
# requires-python = ">=3.12"
# dependencies = ["pyyaml"]
# ///
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
RECIPES_DIR = ROOT / "_recipes"
COMPONENTS_DIR = ROOT / "_components"
OUT_PATH = ROOT / "_data" / "scaling.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)

DEFAULT_SERVINGS = 4

# --------------------------------------------------------------------------
# Number grammar
# --------------------------------------------------------------------------

VULGAR = {
    "½": 0.5, "¼": 0.25, "¾": 0.75,
    "⅓": 1 / 3, "⅔": 2 / 3, "⅛": 0.125,
}
VULGAR_CLASS = "".join(VULGAR)

# Order matters: "1 ½" and "1 1/2" must win over a bare "1".
NUM = (
    rf"(?:"
    rf"\d+\s+\d+\s*/\s*\d+"          # 1 1/2
    rf"|\d+\s*[{VULGAR_CLASS}]"      # 1 ½
    rf"|\d+\s*/\s*\d+"               # 1/2
    rf"|\d+(?:[.,]\d+)?"             # 400 · 1,2
    rf"|[{VULGAR_CLASS}]"            # ½
    rf")"
)
RANGE_SEP = r"\s*(?:à|a|-|–|ou)\s*"

# --------------------------------------------------------------------------
# Units. Longest alternatives first so "kg" beats "g" and "cuillère" beats "c".
# --------------------------------------------------------------------------

UNIT_CLASSES: list[tuple[str, str]] = [
    ("mass", r"kilogrammes?|kilos?|kg|grammes?|gr|g"),
    ("volume", r"millilitres?|centilitres?|décilitres?|decilitres?|litres?|ml|cl|dl|l"),
    (
        "spoon",
        r"cuilleres?\s+a\s+(?:soupe|cafe|the)"
        r"|cuillères?\s+à\s+(?:soupe|café|thé)"
        r"|c\.?\s*à\s*(?:soupe|café|cafe|thé|the)"
        r"|c\.?\s*à\s*[sc]\.?"
        r"|càs|càc|cas|cac|tbsp|tsp",
    ),
    ("pinch", r"pincées?|pincees?"),
]
UNIT_ALT = "|".join(f"(?P<u_{cls}>{pat})" for cls, pat in UNIT_CLASSES)

# Canonical scale hint for mass/volume, so the client can pick a rounding
# precision: halving "1,2 kg" must give "0,6 kg", not "0,5 kg". Spoons, counts
# and pinches have their own fixed rules and need no hint.
CANONICAL_UNIT = [
    (re.compile(r"^(kg|kilo)", re.I), "kg"),
    (re.compile(r"^(g|gr)", re.I), "g"),
    (re.compile(r"^(ml|milli)", re.I), "ml"),
    (re.compile(r"^(cl|centi)", re.I), "cl"),
    (re.compile(r"^(dl|déci|deci)", re.I), "dl"),
    (re.compile(r"^(l|litre)", re.I), "l"),
]


def canonical_unit(literal: str) -> str | None:
    for pat, name in CANONICAL_UNIT:
        if pat.match(literal.strip()):
            return name
    return None

# A number followed by one of these is a duration, a temperature, a dimension
# or a plain count of repetitions — never a scalable quantity.
NEVER_SCALE = {
    "min", "mn", "minute", "minutes", "h", "heure", "heures",
    "s", "sec", "seconde", "secondes", "jour", "jours",
    "semaine", "semaines", "mois", "an", "ans", "année", "années",
    "°", "°c", "c", "degre", "degré", "degres", "degrés",
    "th", "thermostat",
    "cm", "mm", "m", "pouce", "pouces",
    "fois", "personne", "personnes", "part", "parts", "portion", "portions",
    "%", "€", "$", "n°",
}

# Words that end a noun run: the number does not count them.
RUN_STOP = {
    "de", "d", "du", "des", "à", "a", "au", "aux", "en", "pour", "par",
    "avec", "sans", "et", "ou", "le", "la", "les", "un", "une", "dans",
    "sur", "environ", "bien", "type", "sorte", "soit",
}

# Indivisible packaging: rounds to a whole unit, never below 1.
DISCRETE_NOUNS = {
    "sachet", "cube", "pot", "boîte", "boite", "brique", "bocal",
    "paquet", "rouleau", "conserve", "bouteille", "canette", "berlingot",
}

# Words that already end in -s/-x in the singular: nouns, plus the adjectives
# that qualify them inside a noun run ("2 gros oignons" -> "1 gros oignon").
INVARIANT = {
    "ananas", "anis", "riz", "jus", "pois", "cassis", "radis", "os",
    "maïs", "mais", "couscous", "houmous", "dos", "bras", "poids",
    "noix", "prix", "choix", "croix", "épices", "epices",
    "gros", "frais", "épais", "epais", "gras", "bas", "vieux", "doux",
    "roux", "creux", "précis", "precis",
}
# -ou nouns whose plural is -oux.
OU_TO_OUX = {"chou", "genou", "bijou", "caillou", "hibou", "joujou", "pou"}

WORD_RE = re.compile(r"[^\W\d_]+(?:'|’)?", re.UNICODE)

SCAN_RE = re.compile(
    rf"(?P<n1>{NUM})(?:(?P<sep>{RANGE_SEP})(?P<n2>{NUM}))?"
    # "de" is optional between number and unit: « ¼ de c. à c. de curry ».
    rf"(?:(?:\s+de)?\s*(?:{UNIT_ALT})(?![^\W\d_]))?",
    re.IGNORECASE,
)

SCAN_NO_RANGE = re.compile(
    rf"(?P<n1>{NUM})(?P<sep>)(?P<n2>)"
    rf"(?:(?:\s+de)?\s*(?:{UNIT_ALT})(?![^\W\d_]))?",
    re.IGNORECASE,
)

FOLLOW_RE = re.compile(r"\s*(°C|°c|°|%|€|\$|[^\W\d_]+)", re.UNICODE)

# Units written out in full agree with the number; abbreviations do not.
PLURALISABLE_UNITS = {
    "gramme", "kilogramme", "kilo", "litre", "millilitre", "centilitre",
    "décilitre", "decilitre", "pincée", "pincee", "cuillère", "cuillere",
}


def parse_number(raw: str) -> float:
    """Parse any of the accepted numeric notations into a float."""
    s = raw.strip()
    # "1 ½" / "1½"
    m = re.fullmatch(rf"(\d+)\s*([{VULGAR_CLASS}])", s)
    if m:
        return int(m.group(1)) + VULGAR[m.group(2)]
    # "1 1/2"
    m = re.fullmatch(r"(\d+)\s+(\d+)\s*/\s*(\d+)", s)
    if m:
        return int(m.group(1)) + int(m.group(2)) / int(m.group(3))
    # "1/2"
    m = re.fullmatch(r"(\d+)\s*/\s*(\d+)", s)
    if m:
        return int(m.group(1)) / int(m.group(2))
    if s in VULGAR:
        return VULGAR[s]
    return float(s.replace(",", "."))


def num(value: float) -> float | int:
    """Emit whole numbers as ints so the JSON stays small and readable."""
    return int(value) if float(value).is_integer() else round(value, 4)


def is_adverb(low: str) -> bool:
    return low.endswith(("ement", "amment", "emment"))


def is_invariant(low: str) -> bool:
    """True for words spelled the same in both numbers.

    Beyond the explicit list, the -ais/-ois/-ous adjective endings matter:
    "antillais" and "chinois" are singular despite the trailing -s, and naive
    de-pluralisation turns them into "antillai" and "chinoi".
    """
    return low in INVARIANT or low.endswith(("ais", "ois", "ous"))


def singularize(word: str) -> str:
    low = word.lower()
    # Adverbs are invariant ("œufs légèrement battus" -> "œuf légèrement
    # battu"). Match the adverbial endings only, so "piment" stays a noun.
    if is_invariant(low) or len(word) <= 2 or is_adverb(low):
        return word
    if low.endswith("eaux"):
        return word[:-1]
    if low.endswith("oux") and low[:-1] in OU_TO_OUX:
        return word[:-1]
    if low.endswith("aux"):
        return word[:-3] + "al"
    if low.endswith("eux"):
        return word[:-1]
    if low.endswith("x"):
        return word
    if low.endswith("s"):
        return word[:-1]
    return word


def pluralize(word: str) -> str:
    low = word.lower()
    if is_invariant(low) or len(word) <= 2 or is_adverb(low):
        return word
    if low.endswith(("s", "x", "z")):
        return word
    if low.endswith("eau") or low.endswith("eu"):
        return word + "x"
    if low in OU_TO_OUX:
        return word + "x"
    if low.endswith("al"):
        return word[:-2] + "aux"
    return word + "s"


def noun_run(text: str, start: int, max_words: int = 3) -> tuple[str, int] | None:
    """Read the noun phrase a bare number counts, e.g. "oignons rouges".

    Returns (run, end_offset) or None when the number is not counting anything
    (next token is a preposition, punctuation, another number, or nothing).
    """
    pos = start
    words: list[str] = []
    end = start
    while len(words) < max_words:
        m = re.compile(r"\s+").match(text, pos)
        if pos > start and not m:
            break  # words must be whitespace-separated
        wpos = m.end() if m else pos
        wm = WORD_RE.match(text, wpos)
        if not wm:
            break
        word = wm.group(0)
        low = word.lower().rstrip("'’")
        if low in RUN_STOP or word.endswith(("'", "’")):
            break
        if low in NEVER_SCALE:
            return None
        words.append(word)
        end = wm.end()
        pos = end
    if not words:
        return None
    return text[start:end].strip(), end


PARTICIPLE_RE = re.compile(r"[^\W\d_]{3,}(?:és|ées)$", re.UNICODE)
# A participle right after these is describing the preparation, not the noun
# the number counts: "1 oignon coupé en dés" must not become "en dé".
TAIL_BLOCK = {"en", "à", "au", "aux", "pour", "avec", "sur", "dans"}
HALF_RE = re.compile(r"\s+et\s+demie?\b", re.IGNORECASE)


def trailing_agreement(text: str, run_end: int) -> tuple[str, int] | None:
    """Extend a counted noun's agreement over a trailing participle.

    « 2 gousses d'ail pilées » -> the participle agrees with "gousses", so
    halving must give « 1 gousse d'ail pilée ». It only agrees with the head
    noun when the noun in between is singular: in « 2 boîtes de tomates
    pelées » it is "tomates" that "pelées" follows, so the tail is left alone.

    Returns (tail_text, end_offset) covering everything from `run_end` through
    the last participle, or None when there is nothing safe to inflect.
    """
    tail = text[run_end:].rstrip()
    if not tail:
        return None
    words = list(WORD_RE.finditer(tail))
    if not words:
        return None
    # The tail must END on a participle, else we are looking at a noun phrase
    # ("de pâte à raviolis", "pour pâtés impériaux") rather than agreement.
    if words[-1].end() != len(tail) or not PARTICIPLE_RE.match(words[-1].group(0)):
        return None

    first = len(words) - 1
    while first > 0:
        prev = words[first - 1].group(0).lower()
        if prev == "et" or PARTICIPLE_RE.match(prev):
            first -= 1
            continue
        break
    if first == 0:
        return None
    anchor = words[first - 1].group(0).lower().rstrip("'’")
    if anchor in TAIL_BLOCK or anchor.endswith(("s", "x")):
        return None
    return tail, run_end + len(tail)


def inflect_tail(tail: str, plural: bool) -> str:
    def swap(m):
        w = m.group(0)
        if not PARTICIPLE_RE.match(w):
            return w
        return w if plural else w[:-1]

    return WORD_RE.sub(swap, tail)


def parse_line(text: str, allow_count: bool = True) -> list[dict]:
    """Tokenise one ingredient or direction line.

    `allow_count=False` restricts tokens to whitelisted units, which is what
    prose directions need: "en 2 fois" or "couper en 4" must not scale.
    """
    tokens: list[dict] = []
    pos = 0
    while True:
        m = SCAN_RE.search(text, pos)
        if not m:
            break
        pos = m.end() if m.end() > m.start() else m.start() + 1

        unit_cls = next(
            (c for c, _ in UNIT_CLASSES if m.group(f"u_{c}")), None
        )
        q = parse_number(m.group("n1"))
        q2 = parse_number(m.group("n2")) if m.group("n2") else None
        # "1 ou ½" is an alternative, not a range; a real range ascends.
        if q2 is not None and q2 <= q:
            m = SCAN_NO_RANGE.match(text, m.start()) or m
            pos = max(pos, m.end())
            unit_cls = next((c for c, _ in UNIT_CLASSES if m.group(f"u_{c}")), None)
            q2 = None

        if unit_cls:
            lit = m.group(f"u_{unit_cls}")
            span = text[m.start(): m.end()]
            tpl = span.replace(m.group("n1"), "{q}", 1)
            if m.group("n2"):
                tpl = tpl.replace(m.group("n2"), "{q2}", 1)
            tok = {"q": num(q), "cls": unit_cls, "m": span, "tpl": tpl}
            canon = canonical_unit(lit)
            if canon:
                tok["u"] = canon
            # Spelled-out units agree with the number: halving "2 pincées" must
            # give "1 pincée", not "1 pincées". Abbreviations never inflect.
            head, _, rest = lit.partition(" ")
            if singularize(head).lower() in PLURALISABLE_UNITS:
                sg_head = singularize(head)
                suffix = (" " + rest) if rest else ""
                tok["sg"] = sg_head + suffix
                tok["pl"] = pluralize(sg_head) + suffix
                tpl_head = tpl.rindex(lit)
                tok["tpl"] = tpl[:tpl_head] + "{n}"
            if q2 is not None:
                tok["q2"] = num(q2)
            tokens.append(tok)
            continue

        # No unit: either a counted noun, or something we must leave alone.
        follow = FOLLOW_RE.match(text, m.end())
        if follow and follow.group(1).lower() in NEVER_SCALE:
            continue
        if not allow_count:
            continue

        run = noun_run(text, m.end())
        if not run:
            continue
        run_text, run_end = run
        run_start = text.index(run_text, m.end())
        words = run_text.split()
        sg_words = [singularize(w) for w in words]
        sg = " ".join(sg_words)
        pl = " ".join(pluralize(w) for w in sg_words)

        tail = trailing_agreement(text, run_end)
        if tail:
            tail_text, run_end = tail
            sg += inflect_tail(tail_text, plural=False)
            pl += inflect_tail(tail_text, plural=True)

        # « 1 gros oignon et demi » is 1,5 — fold the words into the number so
        # scaling does not leave a stray "et demi" beside a scaled count.
        half = HALF_RE.match(text, run_end)
        if half:
            q += 0.5
            run_end = half.end()

        span = text[m.start():run_end]
        tpl = span.replace(m.group("n1"), "{q}", 1)
        if m.group("n2"):
            tpl = tpl.replace(m.group("n2"), "{q2}", 1)
        # Everything from the noun onwards — run, agreement tail, "et demi" —
        # is rendered from `sg`/`pl`, so the template keeps only what precedes.
        tpl = tpl[: run_start - m.start() - (len(span) - len(tpl))] + "{n}"

        cls = "discrete" if sg_words[0].lower() in DISCRETE_NOUNS else "count"
        tok = {"q": num(q), "cls": cls, "m": span, "tpl": tpl, "sg": sg, "pl": pl}
        if q2 is not None:
            tok["q2"] = num(q2)
        tokens.append(tok)
        pos = run_end

    return tokens


# --------------------------------------------------------------------------
# Corpus walk
# --------------------------------------------------------------------------


def parse_frontmatter(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        print(f"WARN: bad frontmatter in {path.name}: {e}", file=sys.stderr)
        return None


def collect(dir_path: Path, stats: dict) -> dict[str, dict]:
    out: dict[str, dict] = {}
    if not dir_path.is_dir():
        return out
    for path in sorted(dir_path.glob("*.md")):
        fm = parse_frontmatter(path)
        if fm is None:
            continue
        rel = str(path.relative_to(ROOT))

        servings = fm.get("servings")
        if not isinstance(servings, int) or servings < 1:
            if servings is not None:
                print(f"WARN: bad servings in {rel}: {servings!r}", file=sys.stderr)
            else:
                stats["missing_servings"].append(rel)
            servings = DEFAULT_SERVINGS

        entry: dict = {"servings": servings}
        unit = fm.get("servings_unit")
        if isinstance(unit, str) and unit:
            entry["servings_unit"] = unit

        ing: dict[str, list] = {}
        for i, line in enumerate(fm.get("ingredients") or []):
            if not isinstance(line, str):
                continue
            stats["ing_lines"] += 1
            toks = parse_line(line, allow_count=True)
            if toks:
                ing[str(i)] = toks
                stats["ing_scaled"] += 1
            else:
                stats["unscaled_samples"].append(line)
        if ing:
            entry["ing"] = ing

        dirs: dict[str, list] = {}
        for i, line in enumerate(fm.get("directions") or []):
            if not isinstance(line, str):
                continue
            toks = parse_line(line, allow_count=False)
            if toks:
                dirs[str(i)] = toks
        if dirs:
            entry["dir"] = dirs

        out[rel] = entry
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--stats", action="store_true",
                    help="print coverage details and a sample of unscaled lines")
    args = ap.parse_args()

    stats = {
        "ing_lines": 0,
        "ing_scaled": 0,
        "unscaled_samples": [],
        "missing_servings": [],
    }

    payload: dict[str, dict] = {}
    payload.update(collect(RECIPES_DIR, stats))
    payload.update(collect(COMPONENTS_DIR, stats))
    payload = dict(sorted(payload.items()))

    # One line per file: compact enough to stay small, still a readable diff
    # when a single recipe's quantities change.
    body = ",\n".join(
        json.dumps(k, ensure_ascii=False)
        + ": "
        + json.dumps(v, ensure_ascii=False, separators=(",", ":"))
        for k, v in payload.items()
    )
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("{\n" + body + "\n}\n", encoding="utf-8")

    total, scaled = stats["ing_lines"], stats["ing_scaled"]
    pct = (100 * scaled / total) if total else 0
    print(f"Wrote {OUT_PATH.relative_to(ROOT)}")
    print(f"  files: {len(payload)} · ingredient lines: {total}")
    print(f"  lines with >=1 quantity: {scaled} ({pct:.1f}%)")
    if stats["missing_servings"]:
        print(f"  WARN: {len(stats['missing_servings'])} files without `servings:` "
              f"(defaulted to {DEFAULT_SERVINGS})")
    if args.stats:
        if stats["missing_servings"]:
            print("\n  files missing servings:")
            for rel in stats["missing_servings"][:20]:
                print(f"    {rel}")
        print("\n  sample of lines with no quantity token:")
        for line in stats["unscaled_samples"][:60]:
            print(f"    {line}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
