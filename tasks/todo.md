# Todo — `implement-recipe-from-image` skill

Plan: `tasks/plan.md`. SPEC: `.claude/skills/implement-recipe-from-image/SPEC.md`.

## Phase A — ComfyUI client foundation
- [x] **A1** Added `requests`, `websocket-client` to `pyproject.toml`; `uv sync` ok; import-check passes.
- [x] **A2** Scaffolded `.claude/skills/implement-recipe-from-image/{config.json, run.py}`; `--ping` returns server stats from `desktop-tvtdome:8188` ✅ live.
- [x] **A3** `upload_image()` + `--upload` verified live — file echoes back as `linguines_ricotta_pecorino_et_guanciale.png`.
- [x] 🛑 **Checkpoint A** — live verified.

## Phase B — Workflow round-trip
- [x] **B1** `fetch_workflow()` works after URL-encoding the path; rejects UI-format JSON with a clear actionable error; asserts node IDs `1933 / 2001 / 2003 / 465` present ✅ live.
- [x] **B2** `patch_workflow()` + `--dry-run` implemented; structural smoke-test ok.
- [x] **B3** WS wait + `/history` fallback ✅ live (prompt completed in real time).
- [x] **B4** OCR text + preview image (1536×1648 PNG) extracted and written to `.tmp/comfyui/<prompt_id>.png` ✅ live.
- [x] 🛑 **Checkpoint B** — live verified.

## Phase C — Skill orchestration
- [x] **C1** `SKILL.md` written: triggers, run command, stdout contract, post-processing steps via autoloaded rules, overwrite-protection, no-commit clause.
- [x] **C2** All progress logs on stderr; final JSON on stdout — verified by piping through `python -c`.
- [ ] **C3** End-to-end trigger test on a real recipe photo (not a dish photo) — **pending a recipe-text photo from the user**.
- [ ] 🛑 **Checkpoint C** — pending recipe-text photo.

## Phase D — Hardening & docs
- [x] **D1** Friendly errors implemented: unreachable host (with VPN hint), missing node IDs (with API-format hint), unknown text shape (prints raw output), empty OCR (with re-shoot hint), upload failure, prompt rejection.
- [x] **D2** `--dry-run` short-circuits before `/prompt`; verified via `--help` smoke-test (live verification pending).
- [x] **D3** Added `/.tmp/` to `.gitignore`; added `.tmp/` to `_config.yml` exclude; Jekyll build passes (0.421 s).

## Open questions to resolve mid-flight
- [ ] Inspect raw `outputs["2003"]` shape after first B3 run, before finalising B4 parser.
- [ ] Confirm `workflows/SDXL_recettes_cuisine.json` is saved in API format.
