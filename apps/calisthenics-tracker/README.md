# Calisthenics Tracker

An offline-first training tracker that lives on one phone. No account, no server, no subscription —
training data is held on-device in IndexedDB and exported as plain JSON.

Built as an installable PWA with **no build step**: plain ES modules the browser loads directly, every
dependency vendored. Edit a file, push, reload.

- **Plan:** the full spec — program, data model, metrics, design system, phased build order — lives in
  [`docs/calisthenics-tracker-plan.md`](https://github.com/HeyyMaxx/projectportfolio/blob/main/docs/calisthenics-tracker-plan.md)
  in the `projectportfolio` repo.
- **Status:** Phase 0 — app shell, design system, offline install. Nothing is wired to data yet.

## Install on a phone

Open the GitHub Pages URL in the phone's browser, then **Share → Add to Home Screen**. It opens
fullscreen and runs with no network.

## Run locally

```sh
python3 -m http.server 8000    # any static server; a service worker needs http(s), not file://
```

## Layout

```
index.html            app shell
manifest.webmanifest  installability
sw.js                 service worker — cache-first shell, versioned by BUILD
css/app.css           design tokens + layout
js/app.js             bootstrap
js/router.js          hash routing
js/build.js           BUILD constant (keep in step with sw.js)
js/views/*.js         one module per screen
fonts/                vendored woff2 — no network request
icons/                PWA icons
```

Bump `BUILD` in **both** `js/build.js` and `sw.js` on every deploy, or the service worker keeps
serving the old shell.

## Fonts

[Anton](https://fonts.google.com/specimen/Anton) and [Inter](https://fonts.google.com/specimen/Inter),
latin subsets, vendored under the [SIL Open Font License 1.1](https://openfontlicense.org/).
