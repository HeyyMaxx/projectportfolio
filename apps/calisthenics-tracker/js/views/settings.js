import { BUILD } from '../build.js';

export const label = 'Settings';

export function view() {
  return `
    <div class="card stack">
      <h2>Build</h2>
      <div class="row"><span class="micro">version</span><span class="num">${BUILD}</span></div>
      <p style="color:var(--ink-muted);font-size:13px;margin:0">
        If the app looks stale after a deploy, force an update — the service worker
        caches the shell so it opens offline.
      </p>
      <button class="btn btn--ghost" type="button" id="force-update">Force update</button>
    </div>

    <div class="card stack">
      <h2>Backup</h2>
      <p style="color:var(--ink-muted);font-size:13px;margin:0">
        Export and import arrive in Phase 3, before any real history accumulates.
      </p>
    </div>`;
}

export function mounted() {
  document.getElementById('force-update')?.addEventListener('click', async () => {
    const regs = await navigator.serviceWorker?.getRegistrations?.() ?? [];
    await Promise.all(regs.map(r => r.unregister()));
    for (const key of await caches.keys()) await caches.delete(key);
    location.reload();
  });
}
