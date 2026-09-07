import { createRouter } from './router.js';
import { BUILD } from './build.js';
import * as today from './views/today.js';
import * as history from './views/history.js';
import * as progress from './views/progress.js';
import * as program from './views/program.js';
import * as settings from './views/settings.js';

const routes = { today, history, progress, program, settings };

createRouter(routes, {
  mount: document.getElementById('view'),
  tabbar: document.getElementById('tabbar'),
  onRoute: id => routes[id].mounted?.(),
});

document.getElementById('build-tag').textContent = BUILD;

if ('serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err =>
      console.warn('Service worker registration failed — the app still runs online.', err));
  });
}
