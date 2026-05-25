# Codex Cloud Game Tasks

Use this file as a copy-paste launchpad for Codex Cloud tasks. Start each task from the Codex Cloud UI against the GitHub repository, preferably in Code mode so it can make changes, run tests, and open a pull request.

For best results, run one task per game. That lets each task use its time budget deeply without tangling multiple games into one huge branch.

Each task should stay locked on its single assigned game for the full available cloud task window, up to the platform cap. Keep polishing, testing, fixing, and rerunning QA until the game is complete or time expires. Do not switch to other games except to preserve shared navigation and avoid regressions.

## How To Launch

1. Make sure the latest local work is committed and pushed.
2. Open Codex Cloud in ChatGPT/Codex.
3. Choose this repository: `richkingsford/muzzle_pear`.
4. Start a new Code task.
5. Paste one prompt below.
6. Ask it to run tests and open a PR.
7. Review and merge one game at a time.

## Shared Instructions For Every Task

Include this block at the top of each game prompt if you want a stricter run:

```text
Use docs/sudoku-quality-standards.md as the quality template.

Work in this repo only. Preserve the existing Sudoku game and homepage unless your task explicitly requires a shared navigation change. Match the dark arcade visual style already in the project.

Do not stop at a mockup. Build the playable game, add focused tests, run the tests, and open a pull request.

Quality bar:
- Real gameplay, not a decorative shell.
- Clear win/loss/reset states.
- Keyboard and pointer support where natural.
- Mobile layout that does not overlap or overflow.
- Accessible controls and readable dark-mode contrast.
- Browser tests for the main user journey.
- A docs/<game>-quality-standards.md file modeled after docs/sudoku-quality-standards.md.

Human-style e2e QA:
- Run the app locally in the cloud container and exercise it like a real player.
- Use browser automation for the happy path, wrong clicks/invalid moves, reset/new-game behavior, keyboard input, theme changes, and mobile viewport.
- Watch for visual bugs: overlapping text, unreadable contrast, broken hover states, clipped boards, offscreen controls, stale labels, and confusing feedback.
- When a bug appears, fix it in the same task, then rerun the relevant unit and browser checks.
- Do not stop after the first passing implementation. Do at least one deliberate exploratory QA pass after tests are green.
- Record the tested user flows in the PR description.
```

## Task 1: Grid Logic Game

Hint rules for this game live in `docs/grid-logic-hint-rules.md`. Treat that file as the source of truth for Grid Logic clue labels, Auto Mark behavior, hint ordering, hint types, and overlay copy.

```text
Use docs/sudoku-quality-standards.md as the quality template.
Use docs/grid-logic-hint-rules.md as the Grid Logic hint contract.

Build and polish the Grid Logic game.

Scope:
- Create a playable classic grid logic puzzle experience.
- Include category icons across the top and left, clue text, mark states, contradiction prevention or warnings, reset, and puzzle completion feedback.
- The interaction should feel like solving a real logic grid, not just clicking random X and O marks.
- Keep visual styling aligned with the current dark arcade style.
- Add docs/grid-logic-quality-standards.md using the Sudoku standards doc as the template.
- Add unit tests for puzzle state, marks, clue validation, and completion.
- Add browser tests for marking cells, toggling states, solving, resetting, and mobile layout.
- Run human-style e2e QA: solve at least part of a puzzle as a player, intentionally make a conflicting mark, reset, complete or force-complete the puzzle, return home, and test mobile layout.
- Run the tests and open a PR.

Do not break the existing Sudoku tests or hint overlays.
```

## Task 2: Spider Solitaire

```text
Use docs/sudoku-quality-standards.md as the quality template.

Build and polish Spider Solitaire.

Scope:
- Create a playable Spider Solitaire game.
- Support tableau columns, dealing, moving valid stacks, completed runs, reset/new game, and win state.
- Start with one-suit mode unless implementing more suits is straightforward and well-tested.
- Make the card art readable and attractive in the dark arcade style.
- Preserve or improve the dangling spider personality from the homepage card.
- Add docs/spider-solitaire-quality-standards.md using the Sudoku standards doc as the template.
- Add unit tests for deck/tableau/move/run rules.
- Add browser tests for dealing, moving cards, invalid moves, completed run behavior, reset, and mobile layout.
- Run human-style e2e QA: drag or click-move cards, try invalid stack moves, deal, complete or force-complete a run, reset, return home, and test mobile layout.
- Run the tests and open a PR.

Do not break the existing Sudoku tests or hint overlays.
```

## Task 3: Chess

```text
Use docs/sudoku-quality-standards.md as the quality template.

Build and polish the Chess game.

Scope:
- Create the actual playable chess experience, not just a homepage card.
- Use a proven chess rules library if appropriate.
- Keep the existing homepage card feeling consistent with the dark arcade style.
- Support legal piece movement, captures, turn state, check/checkmate/stalemate where feasible, reset, and move history.
- Make pieces visually sharp and readable at desktop and mobile sizes.
- Add docs/chess-quality-standards.md using the Sudoku standards doc as the template.
- Add unit tests for rules/state and browser tests for the main user flow.
- Run human-style e2e QA: make legal moves, try illegal moves, capture, check/checkmate or a forced end-state if feasible, reset, return home, and test mobile layout.
- Run the tests and open a PR.

Do not break the existing Sudoku tests or hint overlays.
```

## Task 4: Minesweeper

```text
Use docs/sudoku-quality-standards.md as the quality template.

Build and polish Minesweeper.

Scope:
- Implement a playable Minesweeper game.
- Include first-click safety, reveal flood fill, flags, mine counter, timer, win/loss states, reset, and difficulty options.
- Make the bomb and explosion interaction polished, readable, and centered on the actual bomb.
- Keep dark-mode contrast strong.
- Add docs/minesweeper-quality-standards.md using the Sudoku standards doc as the template.
- Add unit tests for mine placement, first-click safety, reveal expansion, flagging, win/loss detection.
- Add browser tests for first click, flagging, losing, winning or forced-win setup, reset, and mobile layout.
- Run human-style e2e QA: play several turns, flag and unflag cells, trigger a safe reveal cascade, intentionally lose, force or play a win, reset, return home, and test mobile layout.
- Run the tests and open a PR.

Do not break the existing Sudoku tests or hint overlays.
```

## Task 5: Mastermind

```text
Use docs/sudoku-quality-standards.md as the quality template.

Build and polish Mastermind.

Scope:
- Implement playable classic Mastermind.
- Include secret code generation, color selection, guess submission, feedback pins, win/loss states, reset/new game, and accessible controls.
- Make black and white feedback pins highly legible in dark mode.
- Preserve the homepage card behavior where one row fills on hover, unless a better version fits the same style.
- Add docs/mastermind-quality-standards.md using the Sudoku standards doc as the template.
- Add unit tests for feedback scoring, including duplicate colors.
- Add browser tests for a full guess loop, invalid/incomplete guesses, win/loss/reset, and mobile layout.
- Run human-style e2e QA: submit incomplete guesses, submit duplicate-color guesses, verify feedback pins, force a win, force or play a loss, reset, return home, and test mobile layout.
- Run the tests and open a PR.

Do not break the existing Sudoku tests or hint overlays.
```

## Task 6: Word Vault

```text
Use docs/sudoku-quality-standards.md as the quality template.

Build and polish Word Vault.

Scope:
- Implement a playable Wordle-like word game named Word Vault.
- Do not use the Wordle name in the UI.
- Include keyboard input, on-screen keyboard, row submission, repeated-letter scoring, win/loss states, reset/new puzzle, and mobile layout.
- Keep the homepage card behavior where upside-down letters flip on hover, unless a better version fits the same style.
- Add docs/word-vault-quality-standards.md using the Sudoku standards doc as the template.
- Add unit tests for scoring, especially repeated letters.
- Add browser tests for typing, deleting, submitting, invalid words if supported, win/loss/reset, and mobile layout.
- Run human-style e2e QA: type with the physical keyboard and on-screen keyboard, delete, submit invalid and valid guesses, verify repeated-letter feedback, force a win/loss, reset, return home, and test mobile layout.
- Run the tests and open a PR.

Do not break the existing Sudoku tests or hint overlays.
```


## Optional Task: Shared Arcade Shell

Use this only after at least two playable games exist.

```text
Use docs/sudoku-quality-standards.md as the quality template.

Polish the shared arcade shell now that multiple games are playable.

Scope:
- Add clean routing or state management so each game can launch from the homepage and return home.
- Preserve the existing Sudoku behavior and tests.
- Make shared layout, header, theme, and responsive behavior consistent across games.
- Avoid a heavy framework unless there is a clear benefit.
- Add or update browser tests for moving among multiple games.
- Run human-style e2e QA across the arcade: launch each playable game, return home, switch themes if supported, test mobile navigation, and fix any visual or state bugs found.
- Run the tests and open a PR.
```
