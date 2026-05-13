# TODO — Variations of `implement-recipe-from-image`

Plan: `tasks/plan.md`. Spec: `SPEC.md`.

## T1 — `--mode` dispatch + per-mode config
- [ ] Migrate `config.json` to nested `modes.{full,ocr,image,prompt}` shape (placeholders for new modes)
- [ ] Refactor `load_config` / `fetch_workflow` to look up per-mode workflow + node IDs
- [ ] Extract current `run_pipeline()` body into `run_full(cfg, image_path, dry_run)`
- [ ] Add `--mode {full,ocr,image,prompt}` arg (default `full`)
- [ ] Add `--slug` arg (validated per mode)
- [ ] `--mode {ocr,image,prompt}` raise "not yet implemented" cleanly
- [ ] Smoke: `--ping`, `--image <photo>`, `--mode full --image <photo>` all still work

## T2 — `--mode ocr` + sibling skill
- [ ] Confirm OCR-only workflow exists on the server (path in `modes.ocr.workflow`); else ask user
- [ ] Implement `run_ocr()` — upload + load ocr workflow + read text node, no preview-image fetch
- [ ] Stdout JSON: `{ocr_text, prompt_id}` (no `image_temp_path`)
- [ ] Create `.claude/skills/implement-recipe-from-image-ocr-only/SKILL.md`
- [ ] Skill agent contract: skip image move + thumbnail; omit `image:` from frontmatter
- [ ] Smoke: OCR text matches `--mode full` output on the same photo; no temp image file written

## T3 — Inspect `image` + `prompt` workflows (CHECKPOINT 1)
- [ ] Confirm both new workflow files exist on the server; else stop and ask
- [ ] `run.py --print-workflow --mode image` → identify prompt-text node + preview-image node
- [ ] `run.py --print-workflow --mode prompt` → identify prompt-text node + preview-image node
- [ ] Fill `<tbd>` placeholders in `config.json` for `modes.image` and `modes.prompt`
- [ ] Append "Workflow notes" section to `tasks/plan.md`

## T4 — `--mode image` + sibling skill `regenerate-recipe-image`
- [ ] Implement `run_image(slug)` — read `_recipes/<slug>.md`, inject body/summary into `modes.image` workflow's prompt-text node
- [ ] No image upload (text-to-image workflow)
- [ ] Stdout JSON: `{image_temp_path, prompt_id}`
- [ ] Create `.claude/skills/regenerate-recipe-image/SKILL.md`
- [ ] Skill agent contract: overwrite-check `images/<slug>.png`, move temp, regen thumbnail
- [ ] Smoke: bytes differ pre/post; thumbnail regenerated

## T5 — `--mode prompt` + sibling skill `generate-recipe-image-from-prompt`
- [ ] Implement `run_prompt(slug)` — read `prompts/_recipes/<slug>.md`, inject verbatim into `modes.prompt` workflow's prompt-text node
- [ ] Clear error when prompt file missing
- [ ] Create `.claude/skills/generate-recipe-image-from-prompt/SKILL.md`
- [ ] Smoke: T4 vs T5 output differ; missing-prompt slug → clean error

## CHECKPOINT 2 — manual smoke of all four modes
- [ ] `--mode full --image <photo>` → recipe + image
- [ ] `--mode ocr --image <photo>` → recipe md only
- [ ] `--mode image --slug <existing>` → image only, from recipe body
- [ ] `--mode prompt --slug <existing>` → image only, from prompt gallery
- [ ] Stdout JSON contract holds across all modes
- [ ] Overwrite confirmations fire in the right places

## T6 — cross-links + parent SKILL.md update
- [ ] Update `implement-recipe-from-image/SKILL.md` — add "Related modes" section and `--mode` docs
- [ ] Each sibling SKILL.md links to the others
- [ ] Document any new `config.json` key (if T3 added one)
- [ ] Verify: `rg "regenerate-recipe-image" .claude/skills/` hits all four files
