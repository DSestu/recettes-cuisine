# Todo — `implement-recipe-from-image` skill

Plan: `tasks/plan.md`. SPEC: `.claude/skills/implement-recipe-from-image/SPEC.md`.

## Phase A — ComfyUI client foundation
- [x] **A1** Added `requests`, `websocket-client` to `pyproject.toml`; `uv sync` ok; import-check passes.
- [x] **A2** Scaffolded `.claude/skills/implement-recipe-from-image/{config.json, run.py}`; `--ping` mode implemented (live verification pending — host unreachable from sandbox).
- [x] **A3** `upload_image()` + `--upload` mode implemented (live verification pending).
- [ ] 🛑 **Checkpoint A** — code complete; **live test deferred to user**.

## Phase B — Workflow round-trip
- [x] **B1** `fetch_workflow()` asserts required node IDs present (live verification pending).
- [x] **B2** `patch_workflow()` + `--dry-run` implemented; structural smoke-test ok.
- [x] **B3** `queue_prompt()` + `wait_for_completion()` via WS with `/history` poll fallback.
- [x] **B4** `fetch_outputs()` extracts text (node 2003) tolerant to multiple shapes, fetches image (node 465, `type=temp`), writes to `.tmp/comfyui/<prompt_id>.png`, emits final JSON on stdout.
- [ ] 🛑 **Checkpoint B** — code complete; **live test deferred to user**.

## Phase C — Skill orchestration
- [x] **C1** `SKILL.md` written: triggers, run command, stdout contract, post-processing steps via autoloaded rules, overwrite-protection, no-commit clause.
- [x] **C2** All progress logs on stderr; stdout = final JSON only (single-line on full run, indented for `--ping`/`--upload`/`--print-workflow` since those are interactive).
- [ ] **C3** End-to-end trigger test — **deferred to user**.
- [ ] 🛑 **Checkpoint C** — pending live test.

## Phase D — Hardening & docs
- [x] **D1** Friendly errors implemented: unreachable host (with VPN hint), missing node IDs (with API-format hint), unknown text shape (prints raw output), empty OCR (with re-shoot hint), upload failure, prompt rejection.
- [x] **D2** `--dry-run` short-circuits before `/prompt`; verified via `--help` smoke-test (live verification pending).
- [x] **D3** Added `/.tmp/` to `.gitignore`; added `.tmp/` to `_config.yml` exclude; Jekyll build passes (0.421 s).

## Open questions to resolve mid-flight
- [ ] Inspect raw `outputs["2003"]` shape after first B3 run, before finalising B4 parser.
- [ ] Confirm `workflows/SDXL_recettes_cuisine.json` is saved in API format.
