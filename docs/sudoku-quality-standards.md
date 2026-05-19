# Sudoku Quality Standards

This document describes the quality bar for the Sudoku experience and the hint overlay system. Treat it as the reference template for every future game in this arcade: each game should have a clear end-to-end contract, playful visual behavior, understandable teaching moments, and automated checks that protect the parts users actually notice.

## Product Promise

Sudoku is not just a playable board. It is a teaching tool that helps a player see why a move is available.

The experience should feel:

- Immediate: the home card opens the game with no setup friction.
- Trustworthy: givens match the solution, candidates follow Sudoku rules, and mistakes are clearly identified.
- Learnable: hint overlays explain patterns in plain language for novice and intermediate players.
- Visual first: the board shows the idea before the panel explains it.
- Stable: theme changes, screen size changes, notes, and level changes must not break the overlays.

## End-to-End App Contract

The app opens on the arcade home screen. Sudoku is one of eight game launchers. Clicking the Sudoku card hides the home screen and shows the Sudoku app. The in-game Home button returns to the arcade.

The Sudoku game must always render:

- A 9 by 9 board with exactly 81 cells.
- Seven playable levels.
- A default level of Level 7: Expert.
- A progress label that reflects the number of filled cells.
- A difficulty pill that reflects the selected level.
- A number pad, erase control, reset control, check control, pencil controls, theme toggle, and hint overlay buttons.
- Auto notes enabled by default on a fresh puzzle.

The app must work on desktop and mobile widths without horizontal scrolling or overlapping controls. Board cells in the same region should keep consistent geometry; no row or column should visibly drift because of notes, highlights, or dynamic labels.

## Board Interaction Standards

Given cells are locked. A player cannot overwrite or erase them.

Open cells support:

- Normal entry from number buttons or keyboard digits.
- Erase from the erase control, Delete, or Backspace.
- Sticky pencil mode for adding or removing notes.
- One-shot pencil mode for adding exactly one note.
- Temporary note entry while Shift is held.
- Automatic notes while the player has not switched into manual note-taking.

Selecting a cell must make the board easier to read. The selected cell, related row, column, box, matching values, conflicts, and mistakes should be visually distinct without fighting the hint overlays.

Manual notes disable auto notes because the player has taken control. Resetting or changing levels should restore a clean, predictable state.

## Puzzle Data Standards

Every puzzle must include givens and a full solution. Tests must verify that every given agrees with the solution.

The current ladder has seven levels and must not describe any level as "master". The copy should stay encouraging and skill-oriented.

The default Level 7 puzzle is also a technique lab. It must contain live examples for all supported overlays:

- Hidden single.
- Naked pair.
- Naked trio.
- Pointing pair or pointing triple.
- X-Wing.

If the default puzzle changes, the tests and documentation should be updated together so future work knows which live patterns are intentionally present.

## Hint Overlay Principles

Each overlay must teach one real solving pattern found from the current board state. It should never be a decorative highlight or a hard-coded picture.

The core solver should return structured pattern data. The UI renderer should only translate that data into classes, candidate badges, labels, and explanation text.

Good pattern data includes:

- `type`: the technique identifier used by the UI.
- `title`: the user-facing technique name.
- `digit` or `digits`: the relevant digit or digit set.
- `unit`: the row, column, or box that contains the pattern when applicable.
- `cells`: the pattern cells that make the logic work.
- `eliminations`: cells and digits that can be removed.
- `blockedCells`: cells where a hidden-single digit is visually ruled out, when applicable.
- `corners`: X-Wing corner cells, when applicable.
- `explanation`: plain-language panel copy with a fallback.

Overlay rendering should follow these meanings:

- `hint-unit`: the row, column, or box being discussed.
- `hint-anchor`: the pattern cells that prove the rule.
- `hint-corner`: X-Wing corner cells.
- `hint-removal`: cells where candidate digits can be removed.
- `hint-blocked`: hidden-single support cells showing where the target digit cannot go.
- `candidate-hit`: the exact candidate digits being taught or removed.

Candidate highlights must only appear on digits that are actually visible in that cell. For example, in a naked trio with digits 2, 5, and 8, one pattern cell may visibly contain only 2 and 5. That is valid, but the UI must not draw a fake 8 in that cell.

Dark mode must preserve contrast. Yellow highlighted candidates must use dark text on yellow, not white text on yellow.

Do not add a status label like "Naked trio overlay on." The active button, board colors, and panel title are enough.

## Hint Explanation Standards

Explanations are for novice and intermediate players. They should sound like a helpful coach, not a solver log.

Use plain references:

- "the highlighted cells"
- "this row"
- "this column"
- "this box"
- "the pink cells"
- "outside that box"

Avoid compact coordinates such as `R1C6` in user-facing hint panels. Those are fine in tests and debugging output, but they are not friendly teaching language.

Every hint panel should answer three questions:

- What pattern am I seeing?
- Why does the highlighted group force something?
- What can I place or erase now?

If a technique has an easy misconception, address it directly. Naked trios must say that each trio cell may show only two of the three digits; the three cells together are limited to exactly three digits.

## Technique Contracts

### Hidden Single

A hidden single exists when a digit has only one possible open cell inside a row, column, or box.

The overlay must show:

- One anchor cell where the digit belongs.
- The target candidate highlighted in that cell.
- No removal cells, because this is a placement hint.
- Pink blocked cells in related areas where that digit is ruled out.
- Panel copy that says the digit has "only one possible cell" and explains the pink cells.

The UI label should help the player understand absence, such as showing that the digit is ruled out elsewhere, not merely that the target cell is special.

### Naked Pair

A naked pair exists when two open cells in one row, column, or box share the exact same two candidates. Those two cells reserve those digits, so the digits can be removed from other open cells in that unit.

The overlay must show:

- Two anchor cells.
- The shared candidates highlighted in the anchor cells.
- Removal cells in the same unit.
- Only the removable digits highlighted inside removal cells.

### Naked Trio

A naked trio exists when three open cells in one row, column, or box are limited to the same three digits between them. The individual cells do not all need to contain all three candidates.

Valid examples include:

- One cell with 2 and 8.
- One cell with 2, 5, and 8.
- One cell with 2 and 5.

Together, those three cells use only 2, 5, and 8, so those digits are reserved by the trio and can be removed from other open cells in the unit.

The overlay must show:

- Three anchor cells.
- The real visible candidates in each anchor cell.
- Removal cells in the same unit.
- Only the removable digits highlighted inside removal cells.
- Explanation copy that explicitly says a trio cell may show only two of the trio digits.

### Pointing Pair Or Triple

A pointing pair or triple exists when all possible cells for one digit inside a box sit on the same row or column. That keeps the digit inside the box along that line, so the digit can be removed from the rest of the row or column outside the box.

The overlay must show:

- The box being discussed.
- Two or three anchor cells inside that box.
- Removal cells along the same row or column outside the box.
- Panel copy that includes both ideas: "same row or column" and "outside that box".

### X-Wing

An X-Wing exists when one digit is locked into the same two rows and two columns, forming four corners. The digit must occupy opposite corners, so it can be removed from other cells along the affected lines.

The overlay must show:

- Four corner cells.
- The X-Wing digit highlighted at the corners.
- Removal cells outside the corners.
- Panel copy that explains the two rows and two columns in normal words.

## Current Regression Anchors

The current browser test uses Level 7 as the live demonstration board. These counts are regression anchors for this specific puzzle, not universal Sudoku laws:

- Naked pair: 2 anchor cells and 1 removal cell.
- Naked trio: 3 anchor cells, 3 removal cells, 8 highlighted anchor candidates, and 4 highlighted removal candidates.
- Hidden single: 1 anchor cell, 0 removal cells, 9 blocked cells, and 1 highlighted anchor candidate.
- Pointing pair: 2 anchor cells and 1 removal cell.
- X-Wing: 4 corner cells and 1 removal cell.

If the puzzle changes, update these anchors only after confirming the new board still teaches every supported technique clearly.

## Accessibility And Copy Standards

Interactive controls should be real buttons, selects, or inputs. Icon-only controls need accessible labels.

State changes that matter to the player should be reflected in visible UI and appropriate ARIA state:

- Active hint button.
- Active pencil mode.
- Expanded chemistry popup.
- Live feedback messages.

Copy should be short, concrete, and encouraging. Avoid jargon unless the panel immediately explains it.

## Visual Standards

The Sudoku board is the primary teaching surface. Hint colors must be distinct from selection, peer, conflict, and mistake states.

The visual hierarchy should be:

1. Selected cell and direct board interaction.
2. Active hint pattern cells.
3. Candidate digits being taught or removed.
4. Supporting unit and blocked cells.
5. Explanatory panel.

Candidate badges must be readable in light and dark themes. Never rely on color alone when a small label, symbol, or panel phrase can clarify the meaning.

## Home Card Standards For Future Games

Sudoku sets the bar for the arcade cards: a card should look like the game, and hover should create a small moment of delight that belongs to that game.

Future game cards should follow these rules:

- Use one polished launcher per game unless variants are explicitly requested.
- Use visual assets or code-native art that clearly represent the game.
- Make hover states meaningful, not just a color or font swap.
- Keep the dark arcade style consistent across cards.
- Avoid explanatory in-app text about how the card works.
- Keep the card readable and touch-friendly on mobile.

Examples from the current home screen:

- Chess pieces move to different squares and never overlap.
- Grid Logic hides some marks until hover and uses people and pet icons.
- Spider Solitaire has recognizable cards and a dangling spider interaction.
- Minesweeper centers the explosion on the bomb.
- Mastermind simulates guesses, feedback pins, and one row that fills on hover.
- Word Vault starts with upside-down letters that flip on hover.
- Arithmettle uses arithmetic rows rather than copying the word game exactly.

## Required Verification

Run the unit tests after changing puzzle logic, candidate rules, puzzle data, or hint detection:

```bash
npm.cmd test
```

Run the browser check after changing UI, layout, homepage cards, themes, notes, controls, or overlays:

```bash
npm.cmd run test:browser
```

The browser check should cover:

- Home screen visibility before entering Sudoku.
- One launcher per game.
- Sudoku card opens the app.
- Board renders 81 stable cells.
- Level selector has seven levels.
- Default Level 7 state is correct.
- Auto notes and manual notes behave correctly.
- Level changes update progress and difficulty.
- Chemistry popup opens and closes.
- Every hint overlay appears on the default board.
- Hint panels avoid compact cell references.
- Dark-mode highlighted candidates have strong contrast.
- Mobile layout fits without broken geometry.
- Browser console errors and failed resource loads are caught.

Future games should receive the same kind of contract: core rules tested in unit tests, user flow tested in the browser, and visual teaching or hover behavior protected with concrete selectors and counts.

## Future Game Documentation Template

When another game reaches Sudoku-level polish, create a similar document with:

- Product promise.
- End-to-end app contract.
- Core interaction rules.
- State and reset rules.
- Teaching or hint overlay rules.
- Visual standards.
- Accessibility standards.
- Current regression anchors.
- Required unit and browser tests.

The goal is not to freeze the design forever. The goal is to make future changes intentional, reviewable, and friendly to players.
