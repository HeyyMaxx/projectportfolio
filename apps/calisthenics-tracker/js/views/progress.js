export const label = 'Progress';

const RAMP = ['#5B21B6', '#8034E8', '#A855F7', '#C89BFB', '#E9D5FF'];
const SWATCHES = [
  ['--surface', '#0B0B0C', 'var(--ink)'],
  ['--surface-1', '#151517', 'var(--ink)'],
  ['--line', '#2A2A2E', 'var(--ink)'],
  ['--ink', '#F5F5F7', 'var(--surface)'],
  ['--ink-muted', '#A1A1AA', 'var(--surface)'],
  ['--ink-dim', '#71717A', 'var(--surface)'],
  ['--accent', '#A855F7', 'var(--surface)'],
  ['--accent-bright', '#C89BFB', 'var(--surface)'],
  ['--accent-deep', '#7C3AED', 'var(--ink)'],
  ['--danger', '#FF3B30', 'var(--surface)'],
];

// Two conditions of one skill: the raw number leads (solid accent), the assisted
// number is a reference (dashed, muted ink). The gap between them IS the metric.
const sample = inner =>
  `<svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true"
        style="vertical-align:-1px">${inner}</svg>`;

function conditionChart() {
  const raw =      [[0,88],[1,82],[2,74],[3,76],[4,60],[5,50]];
  const assisted = [[0,46],[1,44],[2,40],[3,36],[4,34],[5,32]];
  const x = i => 12 + i * 48;
  const path = pts => pts.map(([i, y], n) => `${n ? 'L' : 'M'}${x(i)},${y}`).join(' ');
  return `
  <svg viewBox="0 0 290 110" width="100%" height="110" role="img"
       aria-label="Max hold over six sessions: raw ahead of assisted, gap closing.">
    ${[30, 60, 90].map(y => `<line x1="10" y1="${y}" x2="270" y2="${y}" stroke="var(--line)" stroke-width="1"/>`).join('')}
    <path d="${path(assisted)}" fill="none" stroke="var(--ink-muted)" stroke-width="1" stroke-dasharray="4 4"/>
    <path d="${path(raw)}" fill="none" stroke="var(--accent)" stroke-width="2"/>
    <rect x="${x(raw.at(-1)[0]) - 4}" y="${raw.at(-1)[1] - 4}" width="8" height="8" fill="var(--ink)"/>
  </svg>
  <div class="row micro" style="margin-top:-4px">
    <span>${sample('<line x1="0" y1="5" x2="22" y2="5" stroke="var(--accent)" stroke-width="2"/>')} raw · floor</span>
    <span>${sample('<line x1="0" y1="5" x2="22" y2="5" stroke="var(--ink-muted)" stroke-width="1" stroke-dasharray="4 4"/>')} assisted</span>
    <span>${sample('<rect x="7" y="1" width="8" height="8" fill="var(--ink)"/>')} PR</span>
  </div>`;
}

export function view() {
  return `
    <p class="micro">Phase 0 · design proof — no real data yet</p>

    <div class="card stack">
      <h2>Skill · condition encoding</h2>
      ${conditionChart()}
      <p style="color:var(--ink-muted);font-size:13px;margin:0">
        Two shades of one purple measured ΔE&nbsp;13.4 apart — below the 15 floor for full-colour
        vision. So condition encodes as primary&nbsp;vs&nbsp;reference instead.
      </p>
    </div>

    <div class="card stack">
      <h2>Consistency ramp</h2>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:2px">
        <div style="background:var(--surface-1);height:40px;border:1px solid var(--line)"></div>
        ${RAMP.map(c => `<div style="background:${c};height:40px"></div>`).join('')}
      </div>
      <p class="micro" style="margin:0">Empty day reads as absence, not as a low value.</p>
    </div>

    <div class="card stack">
      <h2>Tokens</h2>
      <div class="swatches">
        ${SWATCHES.map(([name, hex, fg]) =>
          `<div class="sw" style="background:${hex};color:${fg}"><span>${name.replace('--','')}</span><span>${hex}</span></div>`).join('')}
      </div>
    </div>

    <div class="card stack">
      <h2>Type</h2>
      <p class="micro" style="margin:0">Micro-label · 11px · 0.12em</p>
      <div class="num" style="font-size:44px;line-height:1">00:55 · 5×5</div>
      <p style="color:var(--ink-muted);font-size:13px;margin:0">
        Body copy in Inter. Every counter uses tabular figures, so a running timer
        never jitters as its digits change width.
      </p>
    </div>`;
}
