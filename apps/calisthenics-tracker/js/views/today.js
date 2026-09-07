export const label = 'Today';

// Phase 0: static preview of the design system. Nothing here is wired to data yet —
// the session runner is Phase 2, and it needs the data layer from Phase 1 first.
export function view() {
  return `
    <p class="micro">Sunday · no session</p>

    <div class="card card--live stack">
      <div class="row">
        <h2>Dead hang</h2>
        <span class="micro">skill · max hold</span>
      </div>
      <div class="row" style="align-items:flex-end">
        <span class="num" style="font-size:56px; line-height:1">00:00</span>
        <span class="micro">best 55s · gloves</span>
      </div>
      <button class="btn" type="button" disabled>Start hold</button>
    </div>

    <div class="card stack">
      <div class="row"><h3>Pull-ups</h3><span class="micro">5 × 5</span></div>
      <div class="row micro" style="gap:2px">
        ${[1,2,3,4,5].map(n => `<span style="flex:1;border:1px solid var(--line);padding:14px 0;text-align:center">${n}</span>`).join('')}
      </div>
    </div>

    <div class="card stack">
      <div class="row"><h3>Rest</h3><span class="micro">reserved texture</span></div>
      <div class="hatch" style="height:12px"></div>
    </div>

    <p class="micro" style="margin-top:24px">
      Phase 0 — shell only. Nothing is wired to data yet.
    </p>`;
}
