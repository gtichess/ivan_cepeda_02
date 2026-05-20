## Plan: FAQ Topics and Game Flow Rename

Refactor the FAQ into a two-step topic-driven flow that composes the shared base prompt with one of five topic files, removes all `sheetsService` usage, and after each answer shows a navigation menu where `0` returns to the initial menu, `1` returns to the FAQ topic selector, and `juego` jumps to the renamed `gameFlow`. In parallel, rename `serviceFlow.ts` and its dependent imports/usages to `gameFlow.ts`, and rename the exported flow symbol from `mainFlow` to `gameFlow` for consistency.

**Steps**
1. Phase 1: Topic configuration and prompt assets
   1. Create `d:\temporada06\ivan_cepeda_02\src\consts\faqTopics.ts` to store the five editable topic definitions. Each entry should include the selection key (`A` through `E`), the display label, and the prompt/document filename under `public/assets/prompts`.
   2. Add five topic document files under `d:\temporada06\ivan_cepeda_02\public\assets\prompts` beside `prompt_OpenAi.txt`. These files become the knowledge base appended to the shared base prompt.
   3. Keep `d:\temporada06\ivan_cepeda_02\public\assets\prompts\prompt_OpenAi.txt` as the common opening instruction, with only a minimal wording adjustment if needed so it clearly refers to the appended topic document.
2. Phase 2: FAQ flow redesign
   1. Update `d:\temporada06\ivan_cepeda_02\src\flows\faqFlow.ts` so the first step presents the five A-E topic options instead of immediately accepting a freeform question.
   2. Add a capture step that validates the topic selection, stores the selected topic in state, and prompts the user to send the actual question for that topic. Invalid topic input should retry within the selector step rather than escaping the FAQ flow.
   3. Replace the current answer-generation logic so it no longer reads or writes with `sheetsService`. The runtime prompt should be built from the contents of `prompt_OpenAi.txt` plus the selected topic file, and `AI.chat` should receive only the current user question as the message history.
   4. After sending the answer, show a navigation menu before the final capture step with these options: `0` to go to `initialButtonFlow`, `1` to return to the A-E topic selector in `faqFlow`, and `juego` to enter the renamed `gameFlow`.
   5. Expand the existing final navigation `.addAction` in `faqFlow.ts` so it handles `0`, `1`, `juego`, and the current `_event_order`, `_event_media`, `_event_document`, and `_event_voice_note` values. Preserve its role as a navigation gate for low-quality or follow-up input.
   6. Add safe error handling for unreadable or missing topic files so the user receives a controlled error message instead of a silent failure.
3. Phase 3: Game flow rename
   1. Rename `d:\temporada06\ivan_cepeda_02\src\flows\serviceFlow.ts` to `d:\temporada06\ivan_cepeda_02\src\flows\gameFlow.ts`.
   2. Rename the exported symbol from `mainFlow` to `gameFlow` in that file.
   3. Preserve the renamed game flow navigation gate so answer `1` continues to route to `faqFlow.ts` after the quiz/game finishes.
   4. Update all dependent imports and usages to the new file path and symbol name, including at least `d:\temporada06\ivan_cepeda_02\src\flows\initialButtonFlow.ts`, `d:\temporada06\ivan_cepeda_02\src\templates\index.ts`, `d:\temporada06\ivan_cepeda_02\src\flows\voice_note_flow.ts`, and the new FAQ navigation path in `d:\temporada06\ivan_cepeda_02\src\flows\faqFlow.ts`.
   5. Decide whether to keep the internal trigger keyword `addKeyword("service")` unchanged for compatibility or rename it if there is a functional reason. Since current user-facing navigation already uses `juego`, this keyword can remain unchanged unless execution testing shows a need to align it.
4. Phase 4: Verification
   1. Run the repo lint and build scripts from `d:\temporada06\ivan_cepeda_02`.
   2. Manually test the renamed game flow entry points from `initialButtonFlow`, `faqFlow`, and the root flow template to confirm the rename did not break flow registration.
   3. Manually test the renamed game flow completion gate and confirm answer `1` routes into `faqFlow`.
   4. Manually test FAQ end-to-end: enter FAQ, confirm the A-E list appears, select a valid topic, ask a question, receive an answer, then exercise `0`, `1`, and `juego` from the post-answer navigation prompt.
   5. Manually test invalid topic input and invalid post-answer navigation input to confirm the FAQ still behaves predictably.
   6. Confirm no lingering imports, file references, or symbol references to `serviceFlow` or `mainFlow` remain unless intentionally preserved.

**Relevant files**
- `d:\temporada06\ivan_cepeda_02\src\flows\faqFlow.ts` — replace the history-based FAQ with topic selection, prompt composition, and the new post-answer navigation menu.
- `d:\temporada06\ivan_cepeda_02\src\consts\faqTopics.ts` — new editable topic catalog with labels and prompt-file mappings.
- `d:\temporada06\ivan_cepeda_02\public\assets\prompts\prompt_OpenAi.txt` — shared opening prompt for all FAQ topics.
- `d:\temporada06\ivan_cepeda_02\public\assets\prompts\<five topic files>` — topic-specific factual source documents.
- `d:\temporada06\ivan_cepeda_02\src\flows\serviceFlow.ts` — current file to rename to `gameFlow.ts`.
- `d:\temporada06\ivan_cepeda_02\src\flows\gameFlow.ts` — renamed quiz/game flow file exporting `gameFlow`.
- `d:\temporada06\ivan_cepeda_02\src\flows\initialButtonFlow.ts` — update the import and `gotoFlow` target from `mainFlow`/`serviceFlow` to `gameFlow`/`gameFlow.ts`.
- `d:\temporada06\ivan_cepeda_02\src\templates\index.ts` — update the registered flow import and array entry to the renamed game flow.
- `d:\temporada06\ivan_cepeda_02\src\flows\voice_note_flow.ts` — update the import path and symbol if the flow is still intended to reference the renamed game flow.

**Verification**
1. Run `pnpm lint` in `d:\temporada06\ivan_cepeda_02`.
2. Run `pnpm build` in `d:\temporada06\ivan_cepeda_02`.
3. Search the repo for `serviceFlow` and `mainFlow` and confirm remaining matches are either removed or intentionally preserved.
4. In chat, enter the FAQ flow, select `A`, `B`, `C`, `D`, and `E` in separate runs, and confirm each selection reaches the question step.
5. After receiving an FAQ answer, test `0`, `1`, and `juego` to confirm navigation goes to `initialButtonFlow`, back to the FAQ selector, and into `gameFlow` respectively.
6. Trigger `_event_order`, `_event_media`, `_event_document`, and `_event_voice_note` after an FAQ answer to confirm the existing event-based navigation still works.

**Decisions**
- FAQ becomes a two-step flow: topic selection first, then a freeform question.
- Topic labels and topic-file mappings live in a new constants file under `src\consts`, not in `faqFlow.ts`.
- FAQ no longer uses `sheetsService` for reading or writing.
- The post-answer FAQ navigation menu must explicitly include `0`, `1`, and `juego` before the final navigation action.
- `serviceFlow.ts` is renamed to `gameFlow.ts`, the exported flow symbol is renamed from `mainFlow` to `gameFlow`, and the renamed flow keeps answer `1` mapped to `faqFlow.ts` at its navigation gate.
- Unless testing shows otherwise, the internal keyword `addKeyword("service")` can stay as-is because the user-facing entry path already uses `juego`.

**Further Considerations**
1. If you want the internal keyword to match the new name, that can be included as a small follow-up change, but it is not required to satisfy the current navigation behavior.
2. If you later want topic labels or filenames to come from a CMS or sheet, `faqTopics.ts` provides a clean pivot point without touching `faqFlow.ts`.