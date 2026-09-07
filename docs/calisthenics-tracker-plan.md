# Calisthenics Tracker — Build Plan

**Owner:** Marcus Meira · **Status:** planning complete — ready to build · **Last updated:** 2026-09-07 (v4)

A personal, offline-first training tracker for calisthenics. Lives on the phone, holds all data
on-device, and is built to be *used mid-set* — not just filled in afterwards.

---

## 1. Context

- 33 y.o., athletic background across many sports, calisthenics since turning 33, progressing consistently.
- Data-oriented (data scientist by trade, graphic design by first training) — visual data is a feature, not decoration.
- **4 sessions per week**, split Back · Push · Core · Legs.
- Every session runs in the same order:
  1. **Warmup** — the same mobility sequence every day
  2. **Skills** — a max hold of **all four skills, every session**
  3. **Strength** — the day's lifts, at their own sets × reps
- **Bodyweight only.** No vest, belt, or bands.
- **Rest between sets: 3–5 minutes.** Long rests, deliberately — this is strength work, not conditioning.
- **Progression rule: feel.** Moving up a variant happens when the current one stops being a challenge —
  it is Marcus's call, never the app's. (See §6, "Progression suggestions".)
- **Fatigue is part of the program**, not an exception: on tired days the reps drop (5×3 → 5×2) rather than
  the session being skipped. The app has to record that without treating it as failure. (See §5, `readiness`.)

---

## 2. The program (as of Sept 2026)

This is the seed data for Phase 1. It is expected to change; the app must make editing it easy.

### Warmup — every session
Same sequence daily, so it's a checklist rather than something to think about.

| Item | Type |
|---|---|
| Wrist stretches | mobility |
| Neck stretches | mobility |
| Legs & hip stretches | mobility |
| Jumping rope | general warmup |

### Skill block — every session
All four skills are practiced every training day, in every routine. Max hold each.

| Skill | Conditions |
|---|---|
| Planche lean | — |
| L-sit | parallettes · floor |
| Crow pose | parallettes · floor |
| Dead hang | gloves · bare |

Because it is identical across all four days, the skill block is defined **once** and referenced by
each routine — editing it in one place updates every day (see §5, `sharedBlocks`).

### Back day — pull-up focus
| Exercise | Prescription | Note |
|---|---|---|
| Inverted row *(Australian pull-up)* | 5×5 | Horizontal pull under a low bar |
| Scapular pull-ups | 5×5 | Scapular strength / hang position |
| Pull-ups | 5×5 | Hard — the whole point of the day |

**North star:** archer pull-ups → typewriter pull-ups. The day is deliberately built as a pull-up
progression ladder because pull-ups are the current weak point.

### Push day — chest / shoulders / triceps
| Exercise | Prescription | Note |
|---|---|---|
| Archer push-ups | 5×5 | Comfortable — already on a harder variation |
| Pike push-ups | 5×5 | Vertical push / shoulder |
| Dips | 5×5 | |

Strongest day. Harder variations across the board.

### Core
| Exercise | Prescription | Note |
|---|---|---|
| Seated leg raises | 5×5 | |
| Hanging leg raises | 5×5 | |
| Dragon flag negatives | **5×3** (5×2 when tired) | Current dragon flag progression; not yet at 5×5 |

### Legs
| Exercise | Prescription | Note |
|---|---|---|
| Cossack squats / archer squats | 5×5 | |
| Assisted pistol squats — bench | 5×5 | |
| Assisted pistol squats — holding support beam | 5×5 | |

### Skills & baselines
Holds, trained at the start of every session. **Equipment changes the number materially**, so each
condition is tracked as its own series — see §4.

| Skill | Condition | Current PR |
|---|---|---|
| L-sit | parallettes | **25 s** |
| L-sit | floor | **6 s** |
| Crow pose | parallettes | **50 s** |
| Crow pose | floor | **25 s** |
| Dead hang | grip gloves | **55 s** |
| Dead hang | bare hands | **40 s** |
| Planche lean | — | **seeded at 0 s** — starts next session, so the first hold registers as a PR |
| Tuck planche | — | *goal rung — not yet trained* |
| V-sit | — | *goal rung — not yet trained* |

> Two consequences the first draft of this plan got wrong: **5×5 is not universal** (dragon flag
> negatives run 5×3, dropping to 5×2 when tired, and more exercises will land here as progressions get
> harder), and **a PR is meaningless without its condition** (a 6 s floor L-sit is a better performance
> than a 25 s parallette L-sit). Both are now first-class in the model.

---

## 3. Goals & non-goals

**Goals**
1. Open it during training and know exactly what is next — exercise, set, target reps.
2. Log a set in one tap, without breaking rest timing.
3. Track progressions, PRs, consistency, and strength gains, shown as graphs and bars.
4. Data is mine: local, exportable as raw JSON, no account, no server, no subscription.
5. Works with no signal, in a basement gym, in airplane mode.

**Non-goals (v1)**
- No social features, sharing, or leaderboards.
- No AI-generated programming — the program is authored by Marcus.
- No nutrition or sleep tracking (bodyweight itself: one optional number per session).
- No multi-user support.
- **No added-load features** (est. 1RM, plate math). Bodyweight only, so they'd be dead code.

---

## 4. Decisions locked

| Decision | Choice | Why |
|---|---|---|
| Platform | **Installable PWA** (Add to Home Screen) | Fullscreen, offline, on-device storage. No app store, no Mac, no build tooling — buildable and shippable entirely from a phone session. |
| Hosting | **GitHub Pages**, new repo `calisthenics-tracker` | Free, HTTPS (required for service workers), deploys on push. |
| Code location | New dedicated repo, not inside `projectportfolio` | Clean history; also stands alone as a portfolio piece. |
| Storage | **IndexedDB** on device | Survives restarts, room beyond localStorage's ~5MB, structured queries. |
| Backup | **One-tap JSON export / import** | The safety net. Raw data is also directly usable in pandas. |
| Build step | **None.** Plain ES modules, no bundler, no npm at runtime | Editable and deployable from a phone. Every dependency vendored. |
| Charts | Hand-rolled SVG chart module | ~4 chart types needed; a vendored library costs more bytes and offline complexity than it saves. |
| Prescriptions | **Per-exercise sets × reps**, not a global 5×5 | Dragon flag negatives already break the pattern; harder progressions will too. |
| Equipment | **`condition` is a dimension, not a separate exercise** | Parallettes vs floor, gloves vs bare hands. Same skill, different difficulty — PRs and chart series split per condition. |
| Level-ups | **Manual, athlete-triggered** | Progression is by feel. The app may *suggest*; it never auto-advances. |
| Warmup & skills | **Shared blocks, defined once** | Identical across all four days. Edit in one place, not four. |
| Rest timer | Default **4:00**, freely adjustable, never a gate | Matches the real 3–5 min range; long rests shouldn't feel policed by an app. |
| Tired days | **Session-level `readiness` flag** | Reduced reps on a tired day is the plan working, not the plan failing — and it explains dips in the charts. |

---

## 5. Data model

Single IndexedDB database `ct`, versioned, with an explicit migration function per version bump.
Every record carries `id` (uuid) and `updatedAt` (epoch ms) so export/import can merge sanely later.

### `exercises` — the library
```
{ id, name, category: 'warmup'|'skill'|'strength',
  family,                  // 'pullup', 'lsit', 'pistol' — groups progression variants
  level,                   // ordinal within family: inverted row=1, scapular=2, pull-up=3, archer=4, typewriter=5
  unit: 'seconds'|'reps',
  conditions: [...],       // ['parallettes','floor'] | ['gloves','bare'] | []
  defaultCondition,
  difficultyWeight,        // 1.0 default, editable — heuristic, used only in the weighted-volume chart
  isGoal,                  // true for archer / typewriter pull-ups: targets, not yet trained
  cues, active, updatedAt }
```

### `sharedBlocks` — the warmup and skill blocks
Identical on all four days, so they live once and every routine points at them.
```
{ id, type: 'warmup'|'skill',
  items: [{ exerciseId, prescription, attempts }], updatedAt }
```

### `routines` — the four day templates
```
{ id, name,                    // 'Back', 'Push', 'Core', 'Legs'
  warmupBlockId, skillBlockId, // → sharedBlocks
  strengthBlock: {
    items: [{ exerciseId, sets, reps, tiredReps }]   // e.g. 5×5, or 5×3 dropping to 5×2
  }, updatedAt }
```

### `sessions` — one training day
```
{ id, date, routineId, startedAt, endedAt, bodyweightKg, notes,
  readiness: 'normal'|'tired',     // set at session start; switches prescriptions to tiredReps
  status: 'in-progress'|'completed'|'abandoned', updatedAt }
```

### `entries` — one set / one hold (the fact table)
```
{ id, sessionId, exerciseId, blockType, order,
  condition,                       // 'floor' | 'gloves' | null
  targetReps, actualReps, holdSeconds, rpe, restSeconds, notes,
  isPR, completedAt, updatedAt }
```

**Why a flat entries table:** one row per set is a tidy dataset. Every metric below is a groupby over
it, and the JSON export drops straight into a DataFrame.

### Derived, never stored as source of truth
PRs, streaks, weekly volume, and progression suggestions are **computed** from `entries` at read time
and memoized. Recomputable means a bad write can't silently corrupt history.

---

## 6. Metrics & visualizations

The part worth getting right. Four chart primitives, reused everywhere.

| # | View | Chart | Reads |
|---|---|---|---|
| 1 | **Skill progression** | Line — **one series per (skill × condition)**, PR points marked | Max hold (s) per session over time |
| 2 | **Consistency** | Calendar heatmap (contribution-graph style) + streaks + sessions/week vs the 4× target | Session count per day, colored by day type |
| 3 | **Strength volume** | Grouped bars per week per exercise; toggle raw reps ↔ weighted | Σ reps (default) or Σ reps × `difficultyWeight` |
| 4 | **Session completion** | Stacked bar: sets completed vs prescribed | `entries` vs the routine's prescription |

Supporting readouts:
- **PR wall** — best per (exercise × condition), date set, days since. Stale after ~8 weeks.
- **Progression ladders** — where you stand in each family, with the goal rungs shown greyed out.
  The back day renders as: inverted row → scapular → pull-up → *archer* → *typewriter*.
- **Progression suggestions** — when the last 3 **normal-readiness** sessions all hit full prescribed reps,
  the app raises a gentle "this looks easy now — ready to level up?" prompt. **A suggestion only.** Level-up
  is a manual action, because the rule is feel. Tired sessions are excluded so a rough week never stalls the
  suggestion, and an easy tired day never triggers one prematurely.
- **Condition gap** — floor vs parallettes, bare vs gloves, as a shrinking gap over time. The floor and
  bare-hand numbers are the honest ones; watching the gap close is its own progress metric.
- **Fatigue overlay** — sessions flagged `tired` are marked on every chart. A dip you can explain isn't a
  plateau, and a PR set on a tired day is worth more than one set fresh. Without this the readiness data
  would just be noise in the series.

Chart rules: dark theme first, high contrast, readable one-handed at arm's length, no chart junk,
tap a point to see the underlying session.

*Dropped from v1:* estimated 1RM. It's a loaded-lifting metric and there is no load here.

---

## 7. Screens

1. **Today** *(landing screen — the one opened mid-training)*
   - Today's routine, block by block; current item highlighted, everything else collapsed.
   - **Session start:** one tap — *normal* or *tired*. Tired swaps in the reduced prescriptions.
   - **Warmup:** fixed checklist (wrists, neck, legs & hips, rope), tap to tick.
   - **Skills:** big hold timer — one tap start, one tap stop. Condition selector right on the timer
     (parallettes/floor, gloves/bare) defaulting to last used. Previous best for *that condition* shown
     inline; beat it → PR flash. Multiple attempts, best counts.
   - **Strength:** sets × reps grid sized from the prescription (5×5, 5×3, whatever it is). Tap a cell
     to log reps, long-press to edit, rest timer auto-starts at 4:00 (adjustable, skippable — it counts,
     it doesn't gate).
   - Screen wake lock while a session is active.
2. **History** — reverse-chronological sessions; tap into detail; edit past entries.
3. **Progress** — the four charts, filterable by family and date range.
4. **Program** — edit the library and the four routines; reorder blocks; set prescriptions; level up a family.
5. **Settings** — bodyweight, rest defaults, **Export backup**, **Import backup**, theme.

Navigation: bottom tab bar, thumb-reachable. Today is the default tab on launch.

---

## 8. Visual design system

**Direction: slick modern, punk sharp edges.** The punk lives in the geometry and the type; the
slickness lives in the spacing and the restraint. Precision, not chaos — a screen-printed gig poster,
not a ransom note.

### Form rules
1. **Zero border radius. Everywhere.** Hard 90° corners on every card, button, input, bar and tooltip.
   This single rule carries most of the punk read — nothing else has to shout.
2. **Hard offset shadows**, never blurs: `3px 3px 0 var(--accent)` on pressed/active elements. Sticker
   and screen-print, not Material elevation.
3. **Thick rules.** 2px borders in ink for containers; 1px hairlines in `--line` for internal structure.
   Rules are structural, not decorative — they divide, they don't frame.
4. **Diagonal 45° hazard hatch** as the one texture, used for exactly two things: the *tired* session
   flag and the running rest timer. Reserved meaning, so it never becomes wallpaper.
5. **One accent, spent sparingly.** Purple marks *the live thing* — current set, running timer, a PR.
   If everything is purple, nothing is. Most of the screen is black and white.
6. **Motion is mechanical.** 120ms, linear or sharp ease-out, no bounce, no crossfade over 150ms.
   Instant response is the slick half of the brief.
7. **Dark only in v1.** A light mode of this design isn't a token flip — punk on white is a different
   poster. Deferred to the backlog rather than half-done.

### Type
- **Display / numbers:** heavy condensed grotesk, uppercase, tight tracking (-0.02em). Timers, reps,
  and PR values are the heroes and get set large.
- **Body / UI:** clean neutral sans, sentence case.
- **Micro-labels:** 11px, uppercase, wide tracking (0.12em), `--ink-dim`. Exercise names, axis labels, meta.
- **`font-variant-numeric: tabular-nums` is mandatory** on every timer and counter. Proportional digits
  make a running clock jitter, which reads as cheap and is exactly the kind of detail that ruins "slick".
- Two woff2 faces vendored into the repo — no Google Fonts request, because the app must work offline.

### Tokens
Measured contrast against `--surface`, not estimated.

| Token | Hex | Contrast | Use |
|---|---|---|---|
| `--surface` | `#0B0B0C` | — | Page. Near-black, not pure — pure black crushes the offset shadows. |
| `--surface-1` | `#151517` | — | Cards, raised rows, empty heatmap cells |
| `--line` | `#2A2A2E` | — | Hairlines, grid, unfilled bar track |
| `--ink` | `#F5F5F7` | **18.07:1** | Primary text, PR markers |
| `--ink-muted` | `#A1A1AA` | **7.68:1** | Secondary text, reference series |
| `--ink-dim` | `#71717A` | **4.07:1** | Micro-labels, axis ticks |
| `--accent` | `#A855F7` | **4.97:1** | The live thing. Black text on it reads at 4.97:1. |
| `--accent-bright` | `#C89BFB` | **8.94:1** | Hover, focus ring, PR flash |
| `--accent-deep` | `#7C3AED` | **3.45:1** | Fills, pressed states, ramp base |
| `--danger` | `#FF3B30` | **5.55:1** | *The one sanctioned exception to the palette.* |

> **On `--danger`:** the only non-purple hue in the app, reserved for destructive actions — wipe data,
> overwrite-on-import. A "delete my entire training history" button rendered in brand purple is a
> flourish that eventually costs real data. Status colors don't get to be part of the aesthetic.

### Accessibility posture — decided, not defaulted
This is a single-user app and the user has no vision impairments. So:

- **Colorblind-safety checks are deliberately dropped.** They cap how many series a palette can carry,
  and that cap buys nothing here. Form wins.
- **Full-color separation is kept** (worst-pair ΔE ≥ 15 in OKLab). This is not a CVD check — it's whether
  *you* can tell two lines apart at arm's length. Two shades of one purple failed this at ΔE 13.4, which
  is why the chart system below looks the way it does.
- **Contrast is kept**, for a reason that isn't accessibility: this app gets read on a phone, at arm's
  length, mid-set, sometimes in sunlight or a badly lit gym.
- Texture and direct labels stay where they aid *speed of reading*, and are dropped where they were only
  ever CVD insurance.

### Chart system
The palette constraint pushed the information design somewhere better than free choice would have.

**Skills are separated by facets, not color.** Four small-multiple charts, one per skill. Not a
palette workaround — dead hang (55s) and floor L-sit (6s) cannot share a y-axis without flattening the
L-sit into a floor-hugging line, and eight lines on a phone is unreadable in any palette. Each facet
gets its own scale, labeled.

**Condition is primary-vs-reference, not two peer series.** The raw number (floor, bare hands) is the
honest one, so it leads:

| Role | Mark | Color |
|---|---|---|
| Raw — floor / bare hands | 2px solid | `--accent` `#A855F7` |
| Assisted — parallettes / gloves | 1px dashed | `--ink-muted` `#A1A1AA` |

Separation ΔE 38.2 — unmistakable. Both direct-labeled at the right edge, so identity never rests on
color alone. And the **gap between the two lines *is* the condition-gap metric from §6** — the thing
you most want to watch shrink is now literally the whitespace between them.

**Everything else:**
- **Weekly volume bars** — nominal categories, so bar length carries the value and every bar takes the
  same `--accent`. Never color-by-value; that spends the identity channel re-encoding the bar length.
- **Multi-exercise volume** (a day has 3 lifts) — validated 3-step purple, all pairs clear the
  full-color floor: `#7C3AED` · `#B478F7` · `#E9D5FF` (worst pair ΔE 16.4, all ≥ 3:1).
- **Consistency heatmap** — validated 5-step sequential ramp, all ordinal checks pass:
  `#5B21B6` → `#8034E8` → `#A855F7` → `#C89BFB` → `#E9D5FF`. Untrained days are `--surface-1`, not a
  pale purple — an empty day should read as absence, not as a low value.
- **Stacked completion bars** — completed in `--accent`, remaining in `--line`, 2px surface gap between
  segments.
- **PR markers** — an 8px **square** (squares, not circles — the whole app has no round corners), in
  `--ink` white. The only white mark in the system, so a PR is unmistakable at a glance.
- **Tired sessions** — 45° hazard hatch on the mark. Fatigue rides the texture channel, keeping the
  color channel free for what it already encodes.
- **Marks & grid** — 2px lines, ≥8px hit targets, horizontal hairline grid only in `--line`, no vertical
  grid, no chart borders. Crosshair + tooltip on lines, per-mark tooltip on bars and cells.
- **Text never wears a series color.** Values and labels stay in ink tokens; the colored mark beside
  them carries the identity.

Palettes were validated by script, not judged by eye — reproducible from the repo:
```
validate_palette.js "#7C3AED,#B478F7,#E9D5FF" --mode dark --surface "#0B0B0C" --pairs all
validate_palette.js "#5B21B6,#8034E8,#A855F7,#C89BFB,#E9D5FF" --ordinal --mode dark --surface "#0B0B0C"
```

---

## 9. Technical architecture

```
calisthenics-tracker/
  index.html            app shell
  manifest.webmanifest  name, icons, display: standalone, theme color
  sw.js                 service worker — cache-first shell, versioned cache
  css/app.css           design tokens (§8) + layout
  fonts/                two vendored woff2 faces — no network request
  js/
    db.js               IndexedDB open/migrate, CRUD
    models.js           schema defaults, validation
    metrics.js          PRs, streaks, volume, suggestions  ← pure functions, unit-tested
    charts.js           SVG line / bar / heatmap / stacked-bar
    timer.js            hold timer, rest timer, wake lock
    router.js           hash-based routing
    views/*.js          one module per screen
    seed.js             the §2 program as starting data
  test/                 node --test over the pure functions in metrics.js
  icons/                PWA icons (192, 512, maskable)
```

- **No framework, no build.** ES modules loaded natively; edit a file, push, reload.
- **State:** a single in-memory store hydrated from IndexedDB on boot; writes go to IDB, then update the store.
- **Service worker:** cache-first for the shell, version constant bumped per release; app data never
  touches the cache (it lives in IndexedDB).
- **Testing:** `metrics.js` covered by `node --test` — PR detection across conditions, streaks, volume
  sums, suggestion thresholds. Everything else by an on-device manual checklist per phase.

---

## 10. Build phases

Each phase ends in something installed and usable on the phone. No phase depends on a later one.

### Phase 0 — Skeleton that installs *(smallest end-to-end slice)*
- Create repo, enable GitHub Pages.
- `index.html` + manifest + icons + service worker; bottom tab bar with 5 empty screens.
- Design tokens from §8 in place, vendored fonts loading, one styled component to prove the look.
- **Done when:** "Add to Home Screen" gives a fullscreen app that opens in airplane mode.

### Phase 1 — Data layer + program
- `db.js`, `models.js`, migrations.
- Seed the entire §2 program: the shared warmup and skill blocks, 12 strength exercises across 4 days,
  4 skills with their conditions, the goal rungs (archer/typewriter pull-up, tuck planche, V-sit), and the
  baseline PRs so the first charts aren't empty. Planche lean seeded at 0 s.
- Program screen: create/edit routines and prescriptions.
- **Done when:** all four days are authored, editable, and survive a force-quit.

### Phase 2 — Session runner *(the core value)*
- Today screen: block sequencing, hold timer with condition selector, sets×reps grid, rest timer, wake lock.
- Session start/complete/abandon; resume an in-progress session after an app kill.
- **Done when:** a real back day is logged start-to-finish without touching anything else.

### Phase 3 — History + export/import *(ships before data accumulates)*
- History list and session detail, editing past entries.
- Export to JSON; import with preview and confirm.
- **Done when:** export → wipe app data → import restores everything byte-for-byte.

> Phase 3 lands before the charts deliberately. Charts are the fun part, but losing three months of
> training history because the backup path wasn't built yet is the one unrecoverable failure here.

### Phase 4 — Progress & charts
- `charts.js` + `metrics.js`; the four views from §6.
- **Done when:** every chart renders correctly at 1 session, 10 sessions, and 200 sessions of data.

### Phase 5 — PRs, ladders, polish
- PR detection per condition, PR flash, PR wall, streaks, progression ladders and suggestions.
- Empty states, error states, haptics, launch-time tuning.
- **Done when:** logging is automatic rather than a chore.

### Phase 6 — Backlog (only after 4+ weeks of real use)
Deload detection · per-exercise notes and form-video links · session RPE and fatigue trend · CSV export
alongside JSON · PT-BR translation · planche progression ladder once it's actually started.

---

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **iOS evicts storage for unused web apps** (~7 days idle in Safari) | Home Screen install makes eviction much less likely; the real answer is habitual export. Phase 5 nags if the last export is >14 days old. |
| Timers pause when the screen locks mid-hold | Timers derive from wall-clock timestamps, not `setInterval` ticks; wake lock requested while a session is active. |
| Losing the phone loses everything | Weekly JSON export to iCloud/Drive. Revisit cloud sync only if that proves annoying in practice. |
| Service worker serves stale code after a deploy | Cache version bumped every release; Settings shows a build hash and a force-update button. |
| Condition selector adds friction mid-set | Defaults to last used per exercise; changing it is one tap, never required. |
| `difficultyWeight` is guesswork | Raw reps is the default chart; weighted volume is an opt-in toggle, labeled as a heuristic, with editable weights. |
| Purple-on-black is beautiful at night and dim in sunlight | `--accent` clears 4.97:1 and text sits on ink tokens, not purple. If a gym proves it out, the fix is raising surface lightness, not repainting the accent. |
| Over-modelling before real usage | Phases 0–2 are usable alone. Schema changes are cheap while only a handful of sessions exist. |
| iOS PWA quirks (no push, no background audio for timers) | Accepted for v1. If timer alerts prove essential, evaluate an Expo build later — the data model carries over unchanged. |

---

## 12. Open questions

**None blocking.** The program in §2 is complete and Phase 0 is ready to start.

Things deliberately deferred until there's real usage data:
- Whether the skill block should vary by day once planche work gets heavy (four max holds before a back day
  may cost pull-up quality — the data will show it).
- Whether `tiredReps` needs to exist per exercise or just as a global "drop one rep" rule.
- Whether rest should be tracked as actual elapsed time rather than a target.

---

## 13. Working agreement

- Plan first, build in phases; each phase ends installed on the phone and actually used before the next starts.
- This document is the source of truth and gets updated as decisions change — including reversals.
- Real training data drives priorities from Phase 4 on: what gets looked at gets built out, what gets ignored gets cut.

---

### Changelog
- **v4 (2026-09-07)** — Added §8, the visual design system: black / white / purple, zero-radius geometry,
  hard offset shadows, reserved hazard texture, tokens with measured contrast. Chart palettes validated by
  script. Colorblind-safety checks dropped by decision (single known user, no impairments); full-color
  separation and contrast kept. Skills facet by chart rather than by color; condition encodes as
  primary-vs-reference. Dark-only in v1.
- **v3 (2026-09-07)** — Program complete. Added the fixed warmup sequence and made warmup + skill blocks
  shared across all four days. Skills confirmed as every-session. Dragon flag set to 5×3 / 5×2. Added the
  session `readiness` flag with tired-day prescriptions, a fatigue overlay on charts, and suggestion logic
  that ignores tired sessions. Rest default 4:00. Planche lean seeded at 0 s.
- **v2 (2026-09-07)** — Added the real 4-day program and baseline PRs. Made `condition` (parallettes/floor,
  gloves/bare) a first-class dimension. Replaced global 5×5 with per-exercise prescriptions. Dropped est. 1RM
  and all added-load features. Made level-ups manual with suggestions only. Added progression ladders with goal rungs.
- **v1 (2026-09-07)** — Initial plan: platform, storage, phases.
