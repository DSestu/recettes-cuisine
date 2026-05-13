# PLAN — Variations of `implement-recipe-from-image`

References: `SPEC.md` (root), existing skill at `.claude/skills/implement-recipe-from-image/`.

## Dependency graph

```
T1 refactor run.py + config.json to per-mode workflows (preserve `full` behavior)
 └─► T2 add `ocr` mode + sibling SKILL.md   (uses its own workflow)
 └─► T3 inspect `image` + `prompt` workflows: confirm node IDs   ← CHECKPOINT 1
       └─► T4 add `image` mode + sibling SKILL.md   (recipe body → its workflow)
       └─► T5 add `prompt` mode + sibling SKILL.md  (prompts/_recipes/<slug>.md → its workflow)
                ← CHECKPOINT 2 (manual smoke of all four modes)
                 └─► T6 update existing SKILL.md + cross-links
```

**Key design choice (confirmed with user):** each mode calls a *different* workflow on the ComfyUI server (one workflow per mode). `config.json` is restructured to hold per-mode workflow path + node IDs. The user is responsible for placing the three new workflow files on `/userdata/workflows/`; the skill never modifies or creates them server-side.

T1 is the foundation. T2 is independent of T3–T5 (OCR-only workflow has the same shape as a stripped-down full workflow). T3 inspects the two image-generation workflows (one for `image`, one for `prompt`) to pin down which node accepts the recipe text vs. the prompt-gallery text. T4 and T5 each implement one mode.

## Vertical slices

Each slice delivers one user-visible behavior end-to-end (CLI invocation → expected files on disk or stdout JSON), not a horizontal layer.

---

### T1 — `--mode` dispatch + per-mode config in `run.py`, `full` mode regression-clean

**Goal:** Restructure `config.json` to hold per-mode workflow+node-IDs. Refactor `run.py` so existing behavior becomes `--mode full` (default), and the script is structured to host three more modes. No new modes yet.

**Changes:**
- Migrate `config.json` to the nested `modes.{full,ocr,image,prompt}` shape from SPEC.md. `full` is populated with current values; the others use placeholders (`"<tbd>"`) that will be filled by T3.
- Refactor `load_config` + `fetch_workflow` to take a mode and look up `cfg["modes"][mode]`.
- Extract `run_full()` from the current `run_pipeline()` body.
- Add `--mode {full,ocr,image,prompt}` (default `full`).
- Add `--slug` arg (unused by `full`/`ocr`, required by `image`/`prompt`; validate per handler).
- Keep `--ping`, `--upload`, `--print-workflow`, `--dry-run` working unchanged. `--print-workflow` now takes (or implicitly uses) `--mode`.

**Acceptance criteria:**
- `run.py --image <photo>` produces the same stdout JSON shape as before.
- `--mode full --image <photo>` is equivalent.
- `--mode {ocr,image,prompt}` return a clear "not yet implemented" error.

**Verify:**
- `run.py --ping` → JSON dump of system stats.
- `run.py --image <known-good>.jpg` → image in `.tmp/comfyui/`, JSON on stdout.
- Reading `git diff`, existing pipeline helpers are relocated but unchanged in behavior.

---

### T2 — `--mode ocr` + sibling skill `implement-recipe-from-image-ocr-only`

**Goal:** Run an OCR-only workflow; do not write any image file. Recipe md is still created by the agent step (no `image:` line in frontmatter).

**Pre-req:** User has placed the OCR-only workflow file on the server (path declared in `config.json` `modes.ocr.workflow`). If missing, T2 stops and asks.

**Changes:**
- `run_ocr()`: upload OCR image + fetch ocr workflow + patch loader node + queue + wait + read text node. No preview-image fetch. Stdout JSON `{ocr_text, prompt_id}`.
- New `.claude/skills/implement-recipe-from-image-ocr-only/SKILL.md` — wraps `run.py --mode ocr`. References the full-mode SKILL.md for the format/tag/category steps that still apply; explicitly skips image move + thumbnail steps.

**Acceptance criteria:**
- `run.py --mode ocr --image <photo>` exits 0 with `{"ocr_text": "...", "prompt_id": "..."}` (no `image_temp_path`).
- No file written under `.tmp/comfyui/`.
- New SKILL.md is unambiguous about the agent contract differences.

**Verify:**
- Run against a known photo; OCR text quality matches `--mode full`.
- `.tmp/comfyui/` has no new entry from this run.

---

### T3 — Inspect `image` and `prompt` workflows (read-only) ← **CHECKPOINT 1**

**Goal:** For each of the two image-generation workflows the user has placed on the server (one for `image` mode, one for `prompt` mode), identify:
- the text-input node ID (where recipe body / prompt-gallery text gets injected),
- the preview-image output node ID.

**Pre-req:** User has placed both new workflow files on `/userdata/workflows/`. If either is missing, **stop and ask**.

**Changes:** none (read-only investigation).

**Acceptance criteria:**
- `run.py --print-workflow --mode image` and `--mode prompt` return valid API-format JSON.
- Append a "Workflow notes" section to this file documenting both workflows' node IDs.
- Fill in the `<tbd>` placeholders in `config.json` `modes.image` and `modes.prompt`.

**Verify:**
- Each workflow has exactly one obvious text-input node feeding the sampler. If ambiguous, ask the user.
- Present findings to the user; get explicit go-ahead before T4.

---

### T4 — `--mode image` + sibling skill `regenerate-recipe-image`

**Goal:** Given an existing `_recipes/<slug>.md`, regenerate `images/<slug>.png` by feeding the recipe body/ingredients to the image branch. No OCR.

**Changes:**
- `run_image(slug)`: read `_recipes/<slug>.md`, extract title + ingredients + directions, build a compact prompt (or pass body verbatim — decide during build), fetch the `image` workflow, patch its prompt-text node with that text, queue, wait, fetch preview. Stdout JSON `{image_temp_path, prompt_id}`.
- No image upload needed — the `image` workflow is text-to-image only.
- New `.claude/skills/regenerate-recipe-image/SKILL.md` — agent contract: confirm before overwriting `images/<slug>.png`, move temp → final, run thumbnail script. No recipe-md edits.

**Acceptance criteria:**
- `run.py --mode image --slug <existing>` returns `{image_temp_path, prompt_id}`.
- Error if `_recipes/<slug>.md` does not exist.
- Agent overwrite check fires for `images/<slug>.png` and `images/cards/<slug>.png`.

**Verify:**
- Run against an existing slug with a current image; bytes differ before/after.
- `images/cards/<slug>.png` regenerated by the thumbnail script.

---

### T5 — `--mode prompt` + sibling skill `generate-recipe-image-from-prompt`

**Goal:** Same as T4 but the prompt source is `prompts/_recipes/<slug>.md` verbatim (the long descriptive prompt-gallery file).

**Changes:**
- `run_prompt(slug)`: read `prompts/_recipes/<slug>.md`, fetch the `prompt` workflow, inject the file content verbatim into its prompt-text node. Otherwise identical to `run_image`.
- New `.claude/skills/generate-recipe-image-from-prompt/SKILL.md` — same agent contract as T4's skill, only the prompt source differs.

**Acceptance criteria:**
- `run.py --mode prompt --slug <existing>` returns `{image_temp_path, prompt_id}`.
- Clear error if `prompts/_recipes/<slug>.md` is missing.
- Generated image follows the prompt gallery description (visual sanity check vs T4 output).

**Verify:**
- Run against `creme_brulee` (prompt file exists).
- Compare T4 vs T5 outputs — they should differ.
- Missing-prompt slug → clear error.

---

### CHECKPOINT 2 — manual smoke of all four modes

- `--mode full --image <photo>` → recipe + image
- `--mode ocr --image <photo>` → recipe md only (no image)
- `--mode image --slug <existing>` → image only, from recipe body
- `--mode prompt --slug <existing>` → image only, from prompt gallery

Confirm: stdout JSON contract holds (last line = JSON); stderr-only logging; overwrite confirmations fire in the right places.

---

### T6 — cross-links and parent SKILL.md update

**Goal:** Make the four skills discoverable. Update the original SKILL.md to mention sibling skills and the new `--mode` flag.

**Changes:**
- Edit `.claude/skills/implement-recipe-from-image/SKILL.md`: add a "Related modes" section listing the three sibling skills.
- Each sibling SKILL.md cross-references the others.
- Update `config.json` documentation in the SKILL.md "Configuration" section if T3 added a node ID.

**Acceptance criteria:**
- A reader landing on any of the four SKILL.md files can find the other three.
- `--mode` is documented in the canonical SKILL.md.

**Verify:**
- `rg "regenerate-recipe-image" .claude/skills/` returns hits in all four SKILL.md files.

## Out of scope

- Automated tests (no test infra exists for this skill; manual smoke is the bar).
- New ComfyUI workflows on the server side (only the existing one is patched).
- Batch generation (one slug at a time).
- Committing changes (skill contract: never commits).
