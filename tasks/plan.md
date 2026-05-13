# Plan — `implement-recipe-from-image` skill

Spec: `.claude/skills/implement-recipe-from-image/SPEC.md`.

## Architecture summary

Two cooperating layers:

1. **`run.py` (Python).** Talks to ComfyUI on `desktop-tvtdome:8188`. Uploads an image, fetches and patches `workflows/SDXL_recettes_cuisine.json` from `/userdata`, queues the prompt, waits for completion, extracts the OCR text (node `2003`) and the final preview image (node `465`, `type=temp`). Emits a small JSON contract on stdout: `{ ocr_text, image_temp_path }`.
2. **`SKILL.md` (agent contract).** Tells Claude: on trigger phrase + path, run `run.py`, then apply the existing autoloaded `format-pasted-recipe.md` + `home-categories.md` + `update-recipe-prompt-gallery.md` rules to:
   - decide the canonical slug from the OCR'd title,
   - write `_recipes/<slug>.md`,
   - move the temp image to `images/<slug>.png` (with overwrite confirmation),
   - update tag registry / homepage categories / prompt gallery as those rules require,
   - **never commit**.

The agent is part of the runtime, not just the developer. Overwrite-protection lives at the agent step because the slug isn't knowable until the OCR text is in hand.

## Dependency graph

```
A1 deps → A2 scaffold → A3 upload
                            ↓
                          B1 fetch workflow → B2 patch → B3 queue+wait → B4 extract outputs
                                                                              ↓
                                                                            C1 SKILL.md → C2 stdout contract → C3 e2e trigger
                                                                                                                   ↓
                                                                                                                 D1 hardening → D2 dry-run → D3 docs
```

## Phase A — ComfyUI client foundation

**Goal:** can reach ComfyUI and upload a file. Smallest viable slice.

### A1. Add HTTP/WS deps
- Edit `pyproject.toml`: add `requests>=2.31` and `websocket-client>=1.7` to `[project].dependencies`.
- Run `uv sync` (or `uv lock && uv sync`).
- **Accept:** `uv run python -c "import requests, websocket"` exits 0.

### A2. Scaffold skill directory
- Create `.claude/skills/implement-recipe-from-image/{config.json, run.py}`.
- `config.json` with the seven keys from SPEC §3.
- `run.py` minimal: parse `--config` and `--dry-run`, load config, `GET http://<host>/system_stats`, print server stats.
- **Accept:** `uv run .claude/skills/implement-recipe-from-image/run.py --ping` prints non-empty system stats from `desktop-tvtdome:8188`.

### A3. `upload_image()`
- Function takes a local path; `POST /upload/image` (multipart `image=`); returns `{name, subfolder, type}`.
- Validate the path exists and has an image suffix (`.jpg|.jpeg|.png|.webp`).
- Add `--upload <path>` mode to `run.py` that prints the upload response.
- **Accept:** uploading a known local jpg returns a JSON with `name` populated; file appears in ComfyUI's input folder (visible via UI).

**🛑 Checkpoint A:** Can ping ComfyUI and upload a file. Verify before moving on.

## Phase B — Workflow round-trip

**Goal:** end-to-end Python pipeline producing OCR text + a temp image on disk.

### B1. `fetch_workflow()`
- `GET http://<host>/userdata/<workflow_userdata_path>` → dict.
- Assert the dict contains the four configured node IDs; fail loudly with a clear message if any is missing (suggests wrong workflow saved, or saved in UI-format instead of API-format).
- **Accept:** running `run.py --print-workflow` dumps a JSON dict with keys including `"1933"`, `"2001"`, `"2003"`, `"465"`.

### B2. `patch_workflow()` + `--dry-run`
- Patch `workflow["1933"]["inputs"]["image"]` and `workflow["2001"]["inputs"]["image"]` to the uploaded `name`.
- `--dry-run` mode: do A3 + B1 + B2, then pretty-print the patched JSON; **do not** call `/prompt`.
- **Accept:** `run.py --dry-run --image foo.jpg` prints a workflow where both loader nodes' `inputs.image` equal the uploaded name; no prompt is queued (verify via ComfyUI queue UI).

### B3. `queue_prompt()` + `wait_for_completion()`
- `POST /prompt` with `{prompt: workflow, client_id: <uuid4>}` → capture `prompt_id`.
- Open `ws://<host>/ws?clientId=<uuid>`; consume messages until `{"type":"executing","data":{"node": null, "prompt_id": <our id>}}` (= done). Timeout after e.g. 10 min, configurable.
- Fallback: if WS disconnects once, retry; if it disconnects twice, poll `GET /history/{prompt_id}` every 2 s.
- **Accept:** for a real input, the script blocks until the workflow finishes on the server (visible in the ComfyUI UI queue), then returns control with the `prompt_id`.

### B4. `fetch_outputs()` + temp image save
- `GET /history/{prompt_id}`.
- Pull OCR text from `outputs["2003"]` — accept the common shapes (`{"text": [str]}`, `{"string": [str]}`, plain str list). Fail loudly if unknown shape.
- Pull image descriptor from `outputs["465"].images[0]`; `GET /view?filename=...&subfolder=...&type=temp` → bytes; write to `<repo>/.tmp/comfyui/<prompt_id>.png` (create dir if absent).
- Emit on stdout: `{"ocr_text": "...", "image_temp_path": "..."}` (single-line JSON, last line of stdout).
- **Accept:** running with a real recipe photo prints the JSON contract; the printed `image_temp_path` is a valid PNG on disk; `ocr_text` is the recipe text.

**🛑 Checkpoint B:** `run.py` is a working pipeline. Stop and inspect outputs for one real input before integrating with the skill layer.

## Phase C — Skill orchestration

**Goal:** typing the trigger phrase produces a draft recipe + image, with overwrite protection, no commit.

### C1. `SKILL.md`
- Trigger phrases from SPEC §2 (4 variants, French + English).
- Usage contract: parse `<path>`, call `uv run .claude/skills/implement-recipe-from-image/run.py --image <path>`, read the last stdout line as JSON, then act per autoloaded rules.
- Explicit do-not-commit clause.
- **Accept:** SKILL.md exists; readable; lists triggers, the run command, the stdout contract, and the post-processing steps.

### C2. Stable stdout contract + non-JSON noise on stderr
- Move all progress/info logs in `run.py` to `stderr`. Only the final result JSON goes to `stdout`.
- **Accept:** piping `run.py --image foo.jpg 2>/dev/null` yields parseable JSON.

### C3. End-to-end trigger
- Test the trigger phrase in a Claude Code session. Expected agent behavior:
  1. Calls `run.py`.
  2. Reads OCR text, derives canonical title and slug (per `format-pasted-recipe`).
  3. Checks `_recipes/<slug>.md` and `images/<slug>.png` — if either exists, asks user.
  4. Writes `_recipes/<slug>.md` applying frontmatter + tag normalisation + category mapping + prompt-gallery file.
  5. Moves temp image to `images/<slug>.png`.
  6. Prints summary; does not commit.
- **Accept:** one full run on a known photo produces a passable `_recipes/<slug>.md`, an `images/<slug>.png`, and corresponding entries in `_data/recipe_tags.yml` / `home_categories.md` / `prompts/_recipes/<slug>.md`. `git status` shows untracked/modified files but no commit.

**🛑 Checkpoint C:** Full happy path works. Decide whether to harden or ship as-is.

## Phase D — Hardening & docs

### D1. Error messaging
- Unreachable host → "ComfyUI unreachable at <host>; check VPN / box on".
- Workflow missing required node IDs → list which IDs are absent.
- Unknown text-output shape → print the raw `outputs["2003"]` for inspection.
- Empty OCR text → exit non-zero, message: "vision LM returned no text; re-shoot or check the workflow".
- **Accept:** each failure mode tested by perturbing config / unplugging the host / etc.

### D2. `--dry-run` regression check
- Confirm B2's `--dry-run` still works after later additions.
- **Accept:** `run.py --dry-run --image foo.jpg` prints patched workflow, no `/prompt` POST (verify via ComfyUI queue).

### D3. Repo plumbing
- Confirm `.claude/` is excluded from Jekyll build (`_config.yml` already excludes it via current rules — verify).
- Add `.tmp/comfyui/` to `.gitignore`.
- **Accept:** `bundle exec jekyll build` (Docker) succeeds; `git status` does not show `.tmp/comfyui/`.

## Out of scope (deliberate)

- Unit tests with mocked HTTP — single-user tool, manual integration is enough.
- Batch mode (multiple images per run).
- Caching the workflow JSON locally.
- Auto-commit / auto-push.
- Cleanup of the ComfyUI `temp/` folder on the remote.
- Retry policy beyond one WS reconnect.

## Risks / open questions

- **Vision-LM output shape:** the actual structure of `outputs["2003"]` depends on the text node used in the workflow. B4 must be robust to common shapes and fail loudly on others. Resolve by running B3+B4 once and inspecting raw `/history` output before finalising the parser.
- **Workflow format:** SPEC assumes the file at `/userdata/workflows/SDXL_recettes_cuisine.json` is **API format**, not UI format. If saved from the UI without "Dev Mode → Export (API)", `/prompt` will reject it. Verify in A2 with a single hand-checked request before B3.
- **PreviewImage persistence:** ComfyUI may clean `temp/` aggressively. B4 must fetch the image immediately after completion, not later.
