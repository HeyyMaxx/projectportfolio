# Calisthenics Tracker — Build Plan

**Owner:** Marcus Meira · **Status:** planning (nothing built yet) · **Last updated:** 2026-08-22

A personal, offline-first training tracker for calisthenics. Lives on the phone, holds all data
on-device, and is built to be *used mid-set* — not just filled in afterwards.

---

## 1. Context

- 33 y.o., athletic background across many sports, calisthenics since turning 33, progressing consistently.
- Data-oriented (data scientist by trade, graphic design by first training) — visual data is a feature, not decoration.
- Training session structure, in order:
  1. **Warmup**
  2. **Skills** — one *max hold* per skill being practiced
  3. **Strength** — 5×5 sets

### Skills currently trained
| Skill | Variants to track | Unit |
|---|---|---|
| Planche | lean, tuck | seconds |
| L-sit | L-sit, V-sit | seconds |
| Crow pose | — | seconds |
| Dead hang | — | seconds |

Progression variants are tracked as **separate exercises in one family**, so the chart can show a
handoff (tuck planche starts where planche lean plateaus) instead of a misleading single line.

---

## 2. Goals & non-goals

**Goals**
1. Open it during training and know exactly what is next — exercise, set, target reps.
2. Log a set in one tap, without breaking rest timing.
3. Track progressions, PRs, consistency, and strength gains, shown as graphs and bars.
4. Data is mine: local, exportable as raw JSON, no account, no server, no subscription.
5. Works with no signal, in a basement gym, in airplane mode.

**Non-goals (v1)**
- No social features, no sharing, no leaderboards.
- No coaching/AI program generation — the program is authored by Marcus.
- No nutrition, sleep, or bodyweight-composition tracking (bodyweight itself: yes, one number).
- No multi-user support.

---

## 3. Decisions locked

| Decision | Choice | Why |
|---|---|---|
| Platform | **Installable PWA** (Add to Home Screen) | Fullscreen, offline, on-device storage. No app store, no Mac, no build tooling — buildable and shippable entirely from a phone session. |
| Hosting | **GitHub Pages**, new repo `calisthenics-tracker` | Free, HTTPS (required for service workers), deploys on push. |
| Code location | New dedicated repo, not inside `projectportfolio` | Clean history; also stands alone as a portfolio piece. |
| Storage | **IndexedDB** on device | Survives app restarts, room to grow beyond localStorage's ~5MB, structured queries. |
| Backup | **One-tap JSON export / import** | The safety net. Raw data is also directly usable in pandas. |
| Build step | **None.** Plain ES modules, no bundler, no npm at runtime | Editable and deployable from a phone. Every dependency vendored into the repo. |
| Charts | Hand-rolled SVG chart module | ~4 chart types needed; a vendored library costs more bytes and offline complexity than it saves. Full control of styling. |
| Language (UI) | English | Matches how the project has been discussed. Copy is centralized so PT-BR is a later swap, not a rewrite. |

---

## 4. Data model

Single IndexedDB database `ct`, versioned, with an explicit migration function per version bump.
Every record carries `id` (uuid) and `updatedAt` (epoch ms) so export/import can merge sanely later.

### `exercises` — the library
```
{ id, name, category: 'warmup'|'skill'|'strength',
  family,                  // 'planche', 'lsit', 'pullup' — groups progression variants
  level,                   // ordinal within family: lean=1, tuck=2, adv-tuck=3...
  unit: 'seconds'|'reps'|'reps+load',
  bodyweightFactor,        // approx % bodyweight moved; used for volume-load estimates
  cues, active, updatedAt }
```

### `routines` — reusable day templates ("Push Day", "Pull Day")
```
{ id, name, blocks: [
    { type: 'warmup',   items: [{ exerciseId, prescription: '60s' }] },
    { type: 'skill',    items: [{ exerciseId, attempts: 3 }] },          // max hold per attempt
    { type: 'strength', items: [{ exerciseId, sets: 5, reps: 5, load } ] }
  ], updatedAt }
```

### `sessions` — one training day
```
{ id, date, routineId, startedAt, endedAt, bodyweightKg, notes,
  status: 'in-progress'|'completed'|'abandoned', updatedAt }
```

### `entries` — one set / one hold (the fact table)
```
{ id, sessionId, exerciseId, blockType, order,
  targetReps, actualReps, holdSeconds, loadKg, rpe, restSeconds, notes,
  isPR: bool, completedAt, updatedAt }
```

**Why a flat entries table:** one row per set is a tidy dataset. Every metric below is a groupby
over this table, and the JSON export drops straight into a DataFrame.

### Derived, never stored as source of truth
PRs, streaks, weekly volume, and est. 1RM are **computed** from `entries` at read time and memoized.
Recomputable means a bad write can't silently corrupt history.

---

## 5. Metrics & visualizations

The part worth getting right. Four chart primitives, reused everywhere.

| # | View | Chart | Reads |
|---|---|---|---|
| 1 | **Skill progression** | Line, one series per variant in a family, PR points marked | Max hold (s) per session over time |
| 2 | **Consistency** | Calendar heatmap (contribution-graph style) + current/longest streak + sessions-per-week | Session count per day |
| 3 | **Strength gains** | Grouped bars per week; secondary line for est. 1RM on weighted movements (Epley) | Volume load = Σ reps × (bodyweight × bodyweightFactor + loadKg) |
| 4 | **Session completion** | Stacked bar: sets completed vs prescribed, per session | `entries` vs routine prescription |

Supporting readouts:
- **PR wall** — current best per exercise, date set, and days since. A PR older than ~8 weeks flags as stale.
- **Rep-quality trend** — average reps achieved per 5×5 (a clean 5/5/5/5/5 means it is time to progress).
- **Progression readiness** — flags an exercise when the last 3 sessions all hit full prescribed reps.

Chart rules: dark theme first, high contrast, readable one-handed at arm's length, no chart junk,
tap a point to see the underlying session.

---

## 6. Screens

1. **Today** *(landing screen — the one opened mid-training)*
   - Today's routine, block by block; current item highlighted, everything else collapsed.
   - **Warmup:** checklist, tap to tick.
   - **Skills:** big hold timer — one tap start, one tap stop, records seconds. Shows previous best inline;
     beats it → PR flash. Multiple attempts per skill, best one counts.
   - **Strength:** 5×5 grid, tap a cell to log reps (long-press to edit), auto-start rest timer between sets.
   - Screen wake lock while a session is active.
2. **History** — reverse-chronological session list; tap into a full session detail; edit past entries.
3. **Progress** — the four charts above, filterable by exercise family and date range.
4. **Program** — edit the exercise library and routine templates; reorder blocks; set prescriptions.
5. **Settings** — bodyweight, units, rest-timer defaults, **Export backup**, **Import backup**, theme.

Navigation: bottom tab bar, thumb-reachable. Today is the default tab on launch.

---

## 7. Technical architecture

```
calisthenics-tracker/
  index.html            app shell
  manifest.webmanifest  name, icons, display: standalone, theme color
  sw.js                 service worker — cache-first shell, versioned cache
  css/app.css           design tokens + layout
  js/
    db.js               IndexedDB open/migrate, CRUD
    models.js           schema defaults, validation
    metrics.js          PRs, streaks, volume, est. 1RM  ← pure functions, unit-tested
    charts.js           SVG line / bar / heatmap / stacked-bar
    timer.js            hold timer, rest timer, wake lock
    router.js           hash-based routing
    views/*.js          one module per screen
    seed.js             starting exercise library + routines
  test/                 node --test over the pure functions in metrics.js
  icons/                PWA icons (192, 512, maskable)
```

- **No framework, no build.** ES modules loaded natively by the browser; edit a file, push, reload.
- **State:** a single in-memory store hydrated from IndexedDB on boot; writes go to IDB then update the store.
- **Service worker:** cache-first for the shell with a version constant bumped on release; app data never
  touches the cache (it lives in IndexedDB).
- **Testing:** pure functions in `metrics.js` covered by `node --test`; everything else by an on-device
  manual checklist per phase (below).

---

## 8. Build phases

Each phase ends in something installed and usable on the phone. No phase depends on a later one.

### Phase 0 — Skeleton that installs *(smallest end-to-end slice)*
- Create repo, enable GitHub Pages.
- `index.html` + manifest + icons + service worker; bottom tab bar with 5 empty screens.
- **Done when:** "Add to Home Screen" on the phone gives a fullscreen app that opens in airplane mode.

### Phase 1 — Data layer + program
- `db.js`, `models.js`, migrations.
- Seed the exercise library: planche lean, tuck planche, L-sit, V-sit, crow, dead hang + the strength lifts (§10).
- Program screen: create/edit routines, assign warmup/skill/strength blocks.
- **Done when:** a full week's routines can be authored on the phone and survive a force-quit.

### Phase 2 — Session runner *(the core value)*
- Today screen: block sequencing, hold timer, 5×5 logging grid, rest timer, wake lock.
- Session start/complete/abandon; resume an in-progress session after an app kill.
- **Done when:** a real training session is logged start-to-finish without touching anything else.

### Phase 3 — History + export/import *(ships before data accumulates)*
- History list and session detail, editing past entries.
- Export to JSON file; import with a preview and confirm.
- **Done when:** export → wipe app data → import restores everything byte-for-byte.

> Phase 3 lands before Phase 4 deliberately. Charts are the fun part, but losing three months of
> training history because the backup path wasn't built yet is the one unrecoverable failure here.

### Phase 4 — Progress & charts
- `charts.js` + `metrics.js`; the four views from §5.
- **Done when:** each chart renders correctly at 1 session, 10 sessions, and 200 sessions of data.

### Phase 5 — PRs, streaks, polish
- PR detection and flash on the Today screen, PR wall, streak counters, progression-readiness flags.
- Empty states, error states, haptics, launch-time tuning.
- **Done when:** the app is pleasant enough that logging is automatic rather than a chore.

### Phase 6 — Backlog (only after 4+ weeks of real use)
Deload detection · plate/band math · per-exercise notes and form video links · session RPE and fatigue
trend · CSV export alongside JSON · PT-BR translation · widget-style "next session" summary.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **iOS evicts storage for unused web apps** (~7 days without use in Safari) | Installing to the Home Screen makes eviction much less likely; the real answer is habitual export. Phase 5 adds a nag if the last export is >14 days old. |
| Timers pause when the screen locks mid-hold | Timers derive from wall-clock timestamps, not `setInterval` ticks; wake lock is requested while a session is active. |
| Losing the phone loses everything | JSON export to iCloud/Drive after each week. Revisit cloud sync only if this proves annoying in practice. |
| Service worker serves stale code after a deploy | Cache version constant bumped every release; Settings shows a build hash and a "force update" button. |
| Over-modelling the program before knowing real usage | Phases 0–2 are usable on their own. Schema changes are cheap while only a handful of sessions exist. |
| iOS PWA quirks (no push, odd viewport, no background audio for timers) | Accepted for v1. If timer alerts prove essential, evaluate an Expo build later — the data model would carry over unchanged. |

---

## 10. Open questions

Answers turn Phase 1's seed data from placeholder into real content.

1. **Weekly split** — how many sessions per week, and how are they divided (push/pull, full-body, skill days)?
2. **Warmup** — fixed sequence, or improvised? If fixed, what's in it?
3. **Strength lifts** — which exercises are in the 5×5 block right now (pull-ups, dips, rows, pistol squats, push-ups, weighted variants)?
4. **Current numbers** — approximate best holds per skill and current 5×5 loads/variants, to seed baselines and make the first charts meaningful immediately.
5. **Added load** — any weighted work (vest, belt, bands)? Determines whether `loadKg` and est. 1RM matter in v1.
6. **Rest defaults** — preferred rest between 5×5 sets and between skill attempts.
7. **Progression rule** — what triggers moving up a variant? (e.g. 5×5 clean two sessions running, or a hold ≥ X seconds.)
8. **The original brief was cut off mid-screenshot** — anything after "…then proceed to 5×5 sets for strength" that should be captured here?

---

## 11. Working agreement

- Plan first, build in phases; each phase ends installed on the phone and actually used before the next starts.
- This document is the source of truth and gets updated as decisions change — including decisions we reverse.
- Real training data drives priorities from Phase 4 onward: what gets looked at gets built out, what gets ignored gets cut.
