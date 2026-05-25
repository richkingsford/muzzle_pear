# Grid Logic Hint Rules

This is the canonical reference for Grid Logic hints. Keep this file updated whenever the logic puzzle data, hint overlays, Auto Mark behavior, or clue labels change.

## Player-Facing Terms

- Use `Plain` for clues that can be marked directly from the clue text.
- Use `Thinking` for clues that require a deduction from other marks.
- Avoid `direct` and `indirect` in player-facing copy except when referring to code identifiers.
- `Auto Mark` only marks `Plain` clues. It must skip `Thinking` clues.

## General Hint Rules

- Every logic puzzle must have at least one relevant hint overlay.
- Hint buttons must appear in solve order from left to right, with lower-hanging fruit first.
- If a puzzle has multiple hints of the same type, number them: `Exclusion 1`, `Exclusion 2`, `Chain clue 1`, `Chain clue 2`, etc.
- A hint must teach one small deduction. Do not combine multiple techniques in one hint.
- A hint must be logically valid from the shown support cells and clue text.
- A hint must not spoil the board by revealing unknown support cells.
- It is okay to highlight a target cell to infer, but the hint must not auto-mark it.
- Inference text should stay masked as `___` until the player clicks to reveal it.
- Revealing inference text must not place a check or x on the board.
- Highlight only cells relevant to that hint. Do not highlight decorative or loosely related cells.
- Locked hints should show the rule and explain which easier support cells must be defined first.

## Auto Mark Rules

- `Auto Mark` labels clues as `Plain` or `Thinking`.
- `Auto Mark` marks only `Plain` clue cells.
- A plain yes/check can auto-fill peer x marks to save mechanical work.
- Auto-filled peer x marks may only fill blank cells or cells already marked x.
- Auto-filled peer x marks must never overwrite a check.
- Some plain yes/check clues may opt out of peer auto-fill with `autoPeers: false` when auto-filling would over-define a later thinking hint.
- Auto Mark should make the puzzle easier without completing the reasoning that a later hint is meant to teach.

## Check Button Rules

- Pressing `Check` must always produce visible feedback.
- Feedback must use exactly one of these outcomes:
  - `Correct`: the puzzle is solved cleanly.
  - `Incomplete`: all current marks are accurate, but the puzzle is not finished.
  - `Inaccurate`: at least one current mark disagrees with the solution.
- The message panel should visually distinguish correct, incomplete, and inaccurate states.

## Overlay Visual Rules

- Green/check support cells mean the marked check is known.
- Red/x support cells mean the marked exclusion is known.
- Yellow inference cells are used for Exclusion hints.
- Blue inference cells are used for Chain clue and Pair lock hints.
- A target/inference cell means "reason about this cell," not "this is automatically placed."
- Exclusion targets should be yellow, with dark text where text appears on yellow.
- Unknown support cells must not be highlighted as if they are known.

## Proof Text Rules

- Prefer the simplest truthful explanation that gets the player to the next move.
- Use custom proof text when the generic fact/clue sentence is too busy.
- Good simple proof examples:
  - `3 of the 4 cells in this Camera column are x's, so we can deduce that ___.`
  - `Lunar and Comet are already taken, and Wren is not Solar, so we can deduce that ___.`
- If a clue is part of the proof, quote it plainly:
  - `We know the clue says "The comet scope tracked the meteor.", and Zed's scope is Comet, so we can deduce that ___.`
- Do not include helper copy such as "Click the blank..." or "The board will stay unmarked." That behavior is implied.

## Hint Types

### Plain Clue

A Plain clue states a mark directly.

Examples:

- `Ben has the dog.`
- `Rae used clay.`
- `Milo was not in the middle.`

Rules:

- Plain clues can be Auto Marked.
- Plain yes/check marks may auto-fill peers unless the clue opts out with `autoPeers: false`.
- Plain not-clues place x marks only on the named cells.

### Exclusion

Exclusion uses known x marks or unavailable options to find a remaining cell.

Use Exclusion when:

- A row or column has all but one option eliminated.
- A person cannot use several options, leaving one option.
- An option cannot belong to several people, leaving one person.

Rules:

- Use yellow for the target cell to infer.
- Support cells should be only the relevant x/check marks.
- If required supports are not marked yet, the hint is locked.
- Do not call this a Chain clue, even if a previous Chain clue created one of the x marks.

### Chain Clue

A Chain clue carries a known fact through a clue that links categories.

Examples:

- `The comet scope tracked the meteor.` If Zed used Comet, infer Zed/Meteor.
- `The marine lab handled coral.` If Aria worked in Marine, infer Aria/Coral.
- `The nebula scope did not track the crater.` If Yara observed Crater, infer Yara is not Nebula.

Rules:

- Use blue for the target cell to infer.
- Keep each chain to one transfer.
- If a chain produces an x, the answer text should say the target "cannot be" that option.
- Number multiple chain hints in one puzzle.

### Pair Lock

Pair Lock is for a linked pair that travels together once one side is established.

Use it sparingly. If the deduction is simply one clue carrying one known fact into another category, prefer `Chain clue`.

Rules:

- Use blue for the target cell to infer.
- The support should be the established side of the pair.
- The target should be the other side of the same linked pair.
- Do not use Pair Lock as a catch-all for multi-step reasoning.

## Puzzle Data Rules

- Each puzzle's `hintOrder` must match the intended solve path.
- `hintOrder` should include every visible non-plain hint key in left-to-right order.
- Use `kind` when a hint key is a numbered variant of a base type, such as `exclude2` with `kind: "exclude"`.
- Use `supports` for exact cells required before the hint unlocks.
- Use `inferred` for the target cell the player should reason about.
- Use `proof` for concise custom proof text.
- Use `autoPeers: false` on direct mark entries when peer auto-fill would erase the need for a later hint.

## Current Level Notes

- Level 4 uses `Chain clue`, `Exclusion`, then `Pair lock`.
- Level 5 uses `Chain clue 1`, `Exclusion 1`, `Chain clue 2`, `Exclusion 2`, then `Exclusion 3`.
- Level 6 uses `Chain clue 1`, `Chain clue 2`, then `Exclusion 1` through `Exclusion 4`.
- Level 7 uses exactly three chain clue hints, followed by numbered Exclusion hints that finish the labs, samples, and times.

When adding or changing a level, run:

```bash
npm.cmd test
npm.cmd run test:browser
```
