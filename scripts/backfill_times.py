#!/usr/bin/env python3
"""Backfill `prep_time` / `cook_time` / `rest_time` frontmatter and strip the
free-text time sentences that used to carry them.

Times have always been prose in the description paragraph (« Pour 4 personnes.
Temps de préparation : 20 min. Temps de cuisson : 40 min. »). The recipe header
now renders them as an icon row and the advanced search filters on the total, so
they need to be data.

All values are integer minutes. Passive waits — repos, marinade, dessalage,
trempage, réfrigération, macération, levée — collapse into a single `rest_time`
bucket; several of them in one recipe are summed, as are several cooking steps.
The total is never stored: it is prep + cook + rest, computed at render time.

Ranges take their *upper* bound (« 25 à 30 minutes » -> 30), the opposite of
`backfill_servings.py`. The search filter is a maximum ("prêt en moins d'une
heure"), so overestimating keeps a recipe out of a bucket it might overflow.

Stripping is deliberately timid: a sentence is removed only when it is *purely*
a time statement. « Temps de cuisson : 1 h 30 à 200 °C. » keeps information the
frontmatter cannot hold, so it stays in the body and is reported for a human
pass. « Pour N personnes » is never touched.

Keys are inserted after `servings:` (else `date:`, `image:`, `title:`) to keep
the canonical frontmatter order. Editing is textual so diffs stay minimal.

Idempotent: files that already declare `prep_time:` are skipped unless --force.

Usage (from repo root):
  uv run python scripts/backfill_times.py [--dry-run] [--force]
  uv run python scripts/backfill_times.py --check
"""
# /// script
# requires-python = ">=3.12"
# ///

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TARGET_DIRS = ("_recipes", "_components")

# Passive waits all land in one bucket: the distinction lived only in the prose
# being removed, and the icon row shows a single « Repos » figure.
CATEGORIES = {
    "préparation": "prep",
    "preparation": "prep",
    "cuisson": "cook",
    "repos": "rest",
    "marinade": "rest",
    "dessalage": "rest",
    "trempage": "rest",
    "réfrigération": "rest",
    "refrigeration": "rest",
    "macération": "rest",
    "maceration": "rest",
    "levée": "rest",
    "levee": "rest",
    "pousse": "rest",
}
# « Temps total : 1 h 25 (préparation 25 min, cuisson 1 h) » — the total is
# recomputed from its parts, so the label is consumed but its value ignored.
# It parses through the normal machinery, hence a category that is dropped.
CATEGORIES["total"] = "_total"

_LABEL_ALT = "|".join(sorted(CATEGORIES, key=len, reverse=True))

# « Temps de cuisson : », « Cuisson au four : », « Repos 1 h au frais »,
# « préparation 25 min ». A bare label needs a colon or a digit right after it,
# otherwise prose like « Marinade froide à base de vinaigre » would match.
LABEL_RE = re.compile(
    rf"\b(?:temps\s+(?:de\s+|du\s+)?)?(?P<label>{_LABEL_ALT})"
    rf"(?:\s+au\s+four|\s+à\s+la\s+casserole)?"
    rf"\s*(?::|(?=\s*\d)|(?=\s*(?:une|toute)\b))",
    re.IGNORECASE,
)
# « Difficulté : ⚠️⚠️⚠️ » — the only such marker in the corpus; consumed so the
# sentence still counts as pure time text, stopping before any parenthetical.
DIFFICULTY_RE = re.compile(r"\bdifficult[ée]\s*:\s*[^.(]*", re.IGNORECASE)

# A trailing \b would fail on « 1h20 », where h and 2 are both word characters,
# so units end on "not a letter" instead.
_END = r"(?![a-zà-ÿ])"
_HOURS = rf"(?:h|heures?){_END}"
_MINUTES = rf"(?:min|minutes?|m){_END}"
# « 1 h 30 », « 1h20 », « 1 heure 05 minutes », « 12 h », « 2 heures ».
DUR_HOUR_RE = (
    rf"(?P<h>\d{{1,3}})\s*{_HOURS}(?:\s*(?P<hm>\d{{1,2}})\s*(?:{_MINUTES})?)?"
)
# « 20 min », « 45 minutes », « 30m ».
DUR_MIN_RE = rf"(?P<m>\d{{1,3}})\s*{_MINUTES}"
# « 2 jours », « 1 nuit », « une nuit », « 1 mois ».
DUR_LONG_RE = (
    r"(?P<n>\d{1,3}|une|toute une)\s*(?P<unit>jours?|nuits?|semaines?|mois)(?![a-zà-ÿ])"
)

DURATION_RE = re.compile(
    rf"(?:{DUR_LONG_RE}|{DUR_HOUR_RE}|{DUR_MIN_RE})", re.IGNORECASE
)
# A range only counts when its upper operand is itself a duration — « 20 min à
# 150 °C » is an oven temperature, not « 20 to 150 minutes ».
RANGE_RE = re.compile(
    rf"(?P<lo>\d{{1,3}})\s*(?:{_HOURS}|{_MINUTES})?\s*(?:à|-|ou)\s*"
    rf"(?P<upper>\d{{1,3}}\s*(?:{_HOURS}(?:\s*\d{{1,2}}\s*(?:{_MINUTES})?)?|{_MINUTES})"
    rf"\s*(?!°))",
    re.IGNORECASE,
)

LONG_UNIT_MINUTES = {
    "jour": 1440,
    "jours": 1440,
    "nuit": 720,  # « une nuit » of resting is conventionally ~12 h
    "nuits": 720,
    "semaine": 10080,
    "semaines": 10080,
    "mois": 43200,
}

# Qualifiers that may trail a duration. They carry nothing the frontmatter
# cannot hold — every oven temperature in the corpus is restated in the steps —
# so consuming them lets the sentence be recognised as pure time text.
QUALIFIER_RE = re.compile(
    r"(?:\s*(?:au\s+four|à\s+la\s+casserole|à\s+la\s+poêle|au\s+réfrigérateur"
    r"|au\s+frais|au\s+congélateur|minimum|maximum|environ|après\s+cuisson"
    r"|à\s*\d{1,3}\s*°\s*C|,))+",
    re.IGNORECASE,
)
# « 1 h au four à 180 °C, puis 15 min » — a second leg of the same cooking, so
# it is summed rather than discarded.
CONTINUATION_RE = re.compile(r"\s*(?:puis|et)\s+", re.IGNORECASE)

# Lookahead window after a label, capped before the next label starts so that
# « Temps de préparation : ... Temps de cuisson : 20 min » does not credit the
# cooking time to the preparation.
VALUE_WINDOW = 60


def parse_duration(text: str) -> tuple[int, int] | None:
    """Return (minutes, end_offset) for the first duration in `text`."""
    m = DURATION_RE.search(text)
    if m is None:
        return None
    rng = RANGE_RE.search(text)
    if rng is not None and rng.start() <= m.start():
        upper = DURATION_RE.search(rng.group("upper"))
        if upper is not None:
            return _minutes(upper), rng.end()
    return _minutes(m), m.end()


def _minutes(m: re.Match[str]) -> int:
    if m.group("n"):
        count = 1 if m.group("n").lower() in ("une", "toute une") else int(m.group("n"))
        return count * LONG_UNIT_MINUTES[m.group("unit").lower()]
    if m.group("h"):
        return int(m.group("h")) * 60 + int(m.group("hm") or 0)
    return int(m.group("m"))


def parse_sentence(sentence: str) -> tuple[dict[str, int], list[tuple[int, int]]]:
    """Extract times from one sentence.

    Returns the per-category minutes found and the character spans consumed, so
    the caller can tell a pure time statement from one carrying extra prose.
    """
    found: dict[str, int] = {}
    spans: list[tuple[int, int]] = []

    for m in DIFFICULTY_RE.finditer(sentence):
        spans.append((m.start(), m.end()))

    for m in LABEL_RE.finditer(sentence):
        if any(s <= m.start() < e for s, e in spans):
            continue
        window = sentence[m.end() : m.end() + VALUE_WINDOW]
        next_label = LABEL_RE.search(window)
        if next_label is not None:
            window = window[: next_label.start()]
        parsed = parse_duration(window)
        if parsed is None:
            continue
        minutes, offset = parsed
        cat = CATEGORIES[m.group("label").lower()]

        # Absorb trailing qualifiers and « puis N min » continuations, so the
        # whole time statement — not just its first number — is accounted for.
        while True:
            qualifier = QUALIFIER_RE.match(window, offset)
            if qualifier is not None and qualifier.end() > offset:
                offset = qualifier.end()
                continue
            cont = CONTINUATION_RE.match(window, offset)
            if cont is None:
                break
            more = parse_duration(window[cont.end():])
            if more is None:
                break
            minutes += more[0]
            offset = cont.end() + more[1]

        if cat != "_total":
            found[cat] = found.get(cat, 0) + minutes
        spans.append((m.start(), m.end() + offset))

    return found, spans


def is_pure_time_sentence(sentence: str, spans: list[tuple[int, int]]) -> bool:
    """True when nothing but punctuation survives removing the time statements."""
    if not spans:
        return False
    chars = list(sentence)
    for start, end in spans:
        for i in range(start, min(end, len(chars))):
            chars[i] = " "
    leftover = "".join(chars).strip(" \t.,;:()·—-")
    return leftover == ""


def split_sentences(line: str) -> list[str]:
    """Split on sentence boundaries, keeping the separators attached."""
    parts = re.split(r"(?<=[.])(\s+)", line)
    out: list[str] = []
    for i in range(0, len(parts), 2):
        sep = parts[i + 1] if i + 1 < len(parts) else ""
        out.append(parts[i] + sep)
    return [p for p in out if p]


def description_end(body: list[str]) -> int:
    """Index of the first line that ends the description block."""
    for i, line in enumerate(body):
        stripped = line.lstrip()
        if stripped.startswith(("#", "-", "*", "|", "<", "!")):
            return i
    return len(body)


def split_frontmatter(lines: list[str]) -> tuple[int, int] | None:
    if not lines or lines[0].strip() != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return 0, i
    return None


def has_key(lines: list[str], end: int, key: str) -> bool:
    return any(lines[i].startswith(key) for i in range(1, end))


def get_key(lines: list[str], end: int, key: str) -> str | None:
    for i in range(1, end):
        if lines[i].startswith(key):
            return lines[i][len(key) :].strip()
    return None


def strip_key(lines: list[str], end: int, keys: tuple[str, ...]) -> list[str]:
    return [
        line
        for i, line in enumerate(lines)
        if not (1 <= i < end and line.startswith(keys))
    ]


def find_insertion_index(lines: list[str], end: int) -> int:
    """After `servings:`, else `date:`, else `image:`, else `title:`."""
    for key in ("servings_unit:", "servings:", "date:", "image:", "title:"):
        for i in range(1, end):
            if lines[i].lstrip().startswith(key):
                return i + 1
    return 1


def process_body(
    body: list[str],
) -> tuple[dict[str, int], list[str], list[str]]:
    """Parse times from the description block and strip pure time sentences.

    Returns (times, new_body_lines, residual_sentences).
    """
    times: dict[str, int] = {}
    residual: list[str] = []
    limit = description_end(body)
    out: list[str] = []

    for idx, line in enumerate(body):
        if idx >= limit:
            out.append(line)
            continue

        eol = ""
        content = line
        for candidate in ("\r\n", "\n"):
            if content.endswith(candidate):
                eol, content = candidate, content[: -len(candidate)]
                break

        kept: list[str] = []
        touched = False
        for sentence in split_sentences(content):
            found, spans = parse_sentence(sentence)
            for cat, minutes in found.items():
                times[cat] = times.get(cat, 0) + minutes
            if found and is_pure_time_sentence(sentence, spans):
                touched = True
                continue
            if found:
                residual.append(sentence.strip())
            kept.append(sentence)

        if not touched:
            out.append(line)
            continue
        rebuilt = "".join(kept).rstrip()
        if rebuilt:
            out.append(rebuilt + eol)
        # A line emptied of its only sentence disappears; the blank-line pass
        # below collapses the hole it leaves behind.

    return times, collapse_blanks(out), residual


def collapse_blanks(lines: list[str]) -> list[str]:
    """Squeeze runs of blank lines down to one.

    The single blank line separating the frontmatter fence from the body is
    kept — removing it would add an unrelated line to every diff.
    """
    out: list[str] = []
    for line in lines:
        if line.strip() == "" and out and out[-1].strip() == "":
            continue
        out.append(line)
    return out


def check(files: list[Path], repo_root: Path) -> int:
    problems: list[str] = []
    for path in files:
        rel = path.relative_to(repo_root).as_posix()
        with path.open("r", encoding="utf-8", newline="") as fh:
            lines = fh.read().splitlines(keepends=True)
        bounds = split_frontmatter(lines)
        if bounds is None:
            problems.append(f"{rel}: no frontmatter")
            continue
        _, end = bounds
        for key in ("prep_time:", "difficulty:"):
            if not has_key(lines, end, key):
                problems.append(f"{rel}: missing {key}")
        for key in ("prep_time:", "cook_time:", "rest_time:"):
            raw = get_key(lines, end, key)
            if raw is not None and (not raw.isdigit() or int(raw) < 1):
                problems.append(f"{rel}: {key} not a positive integer ({raw!r})")
        raw = get_key(lines, end, "difficulty:")
        if raw is not None and raw not in ("1", "2", "3"):
            problems.append(f"{rel}: difficulty must be 1|2|3 (got {raw!r})")
        body = lines[end + 1 :]
        for line in body[: description_end(body)]:
            for sentence in split_sentences(line):
                found, spans = parse_sentence(sentence)
                if found and is_pure_time_sentence(sentence, spans):
                    problems.append(f"{rel}: leftover time text: {sentence.strip()!r}")

    if problems:
        print(f"FAILED: {len(problems)} problem(s)", file=sys.stderr)
        for p in problems:
            print(f"  {p}", file=sys.stderr)
        return 1
    print(f"OK: {len(files)} file(s) have valid times and difficulty")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Backfill time frontmatter from body prose."
    )
    ap.add_argument("--dry-run", action="store_true",
                    help="report planned changes without writing any file")
    ap.add_argument("--force", action="store_true",
                    help="overwrite existing time values")
    ap.add_argument("--check", action="store_true",
                    help="validate frontmatter instead of writing")
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    files: list[Path] = []
    for d in TARGET_DIRS:
        files.extend(sorted((repo_root / d).glob("*.md")))

    if args.check:
        return check(files, repo_root)

    written = skipped = 0
    no_time: list[str] = []
    residuals: list[str] = []
    broken: list[str] = []

    for path in files:
        rel = path.relative_to(repo_root).as_posix()
        # newline="" keeps CRLF intact — translating it to LF would turn a
        # small insertion into a whole-file diff.
        with path.open("r", encoding="utf-8", newline="") as fh:
            lines = fh.read().splitlines(keepends=True)

        bounds = split_frontmatter(lines)
        if bounds is None:
            broken.append(rel)
            continue
        _, end = bounds
        eol = "\r\n" if lines[0].endswith("\r\n") else "\n"

        if has_key(lines, end, "prep_time:"):
            if not args.force:
                skipped += 1
                continue
            lines = strip_key(lines, end, ("prep_time:", "cook_time:", "rest_time:"))
            end = split_frontmatter(lines)[1]

        head, body = lines[: end + 1], lines[end + 1 :]
        times, new_body, residual = process_body(body)
        residuals.extend(f"{rel}: {s}" for s in residual)

        if not times.get("prep") and not times.get("cook"):
            no_time.append(rel)
            continue

        idx = find_insertion_index(head, end)
        new_keys = []
        for cat, key in (("prep", "prep_time"), ("cook", "cook_time"), ("rest", "rest_time")):
            if times.get(cat):
                new_keys.append(f"{key}: {times[cat]}{eol}")
        head[idx:idx] = new_keys
        lines = head + new_body

        if args.dry_run:
            summary = " ".join(k.strip() for k in new_keys)
            print(f"  {rel}: {summary}")
        else:
            with path.open("w", encoding="utf-8", newline="") as fh:
                fh.write("".join(lines))
        written += 1

    verb = "would write" if args.dry_run else "wrote"
    print(f"{verb} {written} file(s) · skipped {skipped} (already had times)")
    if residuals:
        print(f"\n  KEPT (time sentence carries extra info): {len(residuals)}",
              file=sys.stderr)
        for line in residuals:
            print(f"    {line}", file=sys.stderr)
    if no_time:
        print(f"\n  NO TIME FOUND (needs a hand-written estimate): {len(no_time)}",
              file=sys.stderr)
        for rel in no_time:
            print(f"    {rel}", file=sys.stderr)
    if broken:
        print(f"\n  UNPARSEABLE frontmatter: {len(broken)}", file=sys.stderr)
        for rel in broken:
            print(f"    {rel}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
