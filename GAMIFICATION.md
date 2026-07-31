# Mini Apps Gamification

Version: 2026-08-01

Games and learning apps may use a light progression layer: XP, levels, and medals. It must reward practice, never speed or perfection, and it must stay quiet. If a mechanic would feel at home in a casino or a social app, leave it out.

## XP

- XP is a single cumulative number that only ever grows. Mistakes never subtract XP and retries cost nothing.
- Award XP for completed exercises, scaled by effort or difficulty (longer, harder content earns more). Never award XP for speed.
- Corrected mistakes still earn a small amount. Effort counts.
- Spendable currencies (coins for hints) are separate from XP. Add one only when the app has something meaningful to spend it on.

## Levels

- Levels are cumulative XP thresholds with child-friendly names, themed per app. Five to seven levels is enough.
- Tune the curve so the second level arrives within the first session (an early win) and the last level takes sustained practice.
- Past the top level, XP keeps counting. Never reset progress.
- Show the current level with a progress bar to the next one, using the progress tokens from DESIGN.md.

## Medals

- Medals are thresholds on cumulative counters. Growing step series work well (1, 3, 8, 21, ...).
- Mix three kinds: completion medals (exercises finished), effort medals (attempts or inputs made, so practice pays even when answers were wrong), and app-specific medals for real milestones.
- Every medal check must be a pure function of the stored data, never a fired-and-forgotten event flag, so state and medals cannot drift.
- Locked medals stay visible with name and description. Seeing the goal is part of the motivation.
- Use Lucide icons for medals, not emoji.

## Reward moments

- Rewards appear only on completion screens, as a small persistent block: XP gained, level reached, medals unlocked. Never during the task itself. Content stays first.
- No modals, no confetti, no celebratory animation, no sound. The calm motion rules apply to rewards too.
- A compact stats strip on the start screen (level, progress, medal count) links to a medal gallery view.

## Adaptive difficulty

When an exercise has a difficulty dial (length, range, level), the app may suggest the next step up. It never forces it.

- Trigger on mastery, not on time: a fixed number of consecutive clean runs (completed without a wrong answer) at the current difficulty. Five is a good default; long exercises that take several minutes each may use fewer.
- The suggestion appears on the completion screen as a short, warm line plus a one-tap action ("Probier es mit 6 Ziffern!"). Accepting it updates the saved setting and starts immediately; the manual control stays available and follows the change.
- A run with mistakes resets the mastery streak silently. No message, no lost progress, and full XP: struggling at a level is practicing, not failing.
- Never lower the difficulty automatically. Stepping down is always the learner's own choice.
- Never lock difficulty behind progression. The learner can always choose any level in the settings.

## What to avoid

- Streaks that shame: if an app shows a streak, a broken one restarts silently. No loss messages.
- Daily pressure: no login streaks, no expiring rewards, no countdown timers. The apps have no notifications and must never need them.
- Leaderboards and comparison between children.
- XP for repetition without learning value (farming the same trivial exercise). Scale rewards with content, not with clicks.

## Storage

- All progression lives in the app's localStorage state and is removed by the app's reset. It never leaves the device.
