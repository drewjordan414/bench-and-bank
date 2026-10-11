# Bench & Bank

The tying bench and the river bank: what to tie for a water and a month, how to tie it, and a log of where it worked.

A personal trout fly-fishing site with three pages:

- **What to tie** — pick a water and a month from a hatch chart; get the hatches that are on and the patterns that cover the most of them.
- **Patterns** — 70 fly patterns, searchable by name or material. Each has a recipe, when it is on, and photographed tying steps.
- **Trip log** — date, water, a pin on a USGS topo map, and for each fish the species, count, length, fly and hook size. Flies that match a pattern link to it, and each pattern page shows how it has done.

> **Keep this private.** The step photographs come from the Southern Wisconsin Trout Unlimited booklet *Fly Tying I* and from web tutorials credited on each pattern page. They are here for personal use and are not licensed for republication. Do not push this to a public repository or host it on the open internet as it stands.

## Run it

### Docker (how it normally runs)

```sh
cp .env.example .env        # optional; see Settings
docker compose up -d --build
```

Then open <http://localhost:5183>. The trip log is kept on the host in `data/`, so it survives rebuilds.

### For development

```sh
tools/dev.sh                # installs dependencies on first run, starts Vite, opens the browser
```

Needs Node 22 or newer. The dev server and the container both use port 5183, so stop one before starting the other (`docker compose down`).

## Settings

All optional. For Docker they go in `.env` beside `docker-compose.yml`; for `tools/dev.sh`, put `MONGO_URL` and `ALLOWED_HOSTS` in `site/.env.local`.

| Variable | Default | What it does |
|---|---|---|
| `MONGO_URL` | off | Keeps a second copy of the trip log in MongoDB, e.g. `mongodb://192.168.4.55:27017/flyfishing` (collection `trips`). |
| `BIND` | `127.0.0.1` | Docker only. Set to `0.0.0.0` to reach the site from other devices. There is no login. |
| `PORT` | `5183` | Docker only. The host port. |
| `ALLOWED_HOSTS` | none | Extra hostnames the site may be opened under, comma-separated. `localhost` and IP addresses always work. |

## Where the trip log lives

- **The file is the source of truth:** `data/trips.json`, written by a small endpoint in `site/vite.config.js` (`GET` and `PUT /api/trips`). Nothing is stored in the browser.
- **One-deep backup:** every save first copies the previous version to `data/trips.backup.json`, and the new file is written in one step so it can never be half-written.
- **MongoDB copy:** when `MONGO_URL` is set, the `trips` collection is made to match the file after every save and whenever the log is read. If MongoDB cannot be reached the save still succeeds and the copy catches up later. It is a mirror, so a trip deleted here is deleted there too.
- **Guard rails:** the endpoint validates every trip, refuses saves that are not same-origin JSON, and refuses requests under a hostname it does not know.

`data/` holds your fishing spots. Decide whether you want it in version control before committing.

## Deployed copy

The live copy runs on the homelab Unraid server at <http://192.168.4.55:5183> (LAN only). Its compose file and trip log are in `/mnt/user/appdata/bench-and-bank/` on that machine; **that trip log is the real one**, and the `data/` folder in this checkout is only for development.

```sh
tools/deploy-anton.sh       # build for x86-64, load the image over SSH, restart the container
```

This needs SSH enabled on the server and this machine's key authorised for `root`. It does not touch the trip log.

## Checks

Run from `site/`:

```sh
npm test                    # node --test: ranking, month ranges, trip validation and stats
npm run check               # data check: every hatch points at a real pattern, every photo exists,
                            # every water has something to tie in every month
npm run build               # production build
```

## Layout

| Path | What |
|---|---|
| `site/src/App.jsx` | Shell: top bar, hash routing (`#/`, `#/patterns`, `#/log`, `#/<pattern-id>`), footer |
| `site/src/pages/` | `Plan.jsx`, `Patterns.jsx`, `Pattern.jsx`, `Log.jsx` (the log and its map load on demand) |
| `site/src/ui.jsx`, `TripMap.jsx`, `hooks.js` | Hatch chart and shared pieces; the Leaflet map; routing, saved choices, loading and saving trips |
| `site/src/trips.js` | Trip rules: validation and stats. Shared by the form, the endpoint and the tests |
| `site/src/data.js` | **Hand-written:** waters, the hatch calendar, what each pattern imitates, fishing sizes |
| `site/src/patterns.json` | **Generated** from the booklet (17 patterns). Do not hand-edit; see `tools/extract_swtu.py` |
| `site/src/web/<id>.json` | One file per web-tutorial pattern (53 of them) |
| `site/public/img/<id>/` | Step photos, numbered in order; the last is the finished fly |
| `site/src/style.css`, `tokens.css` | Hand-written CSS and design tokens |
| `site/vite.config.js` | Build config and the trip-log endpoint with its MongoDB mirror |
| `site/test/`, `site/check.js` | Logic tests and the data check |
| `tools/` | `dev.sh`, `deploy-anton.sh`, `extract_swtu.py` |
| `Dockerfile`, `docker-compose.yml`, `deploy/anton-compose.yml` | Container build, local compose file, and the compose file used on the server |

Built with React 19, Vite 6 and Leaflet. No router, state library or CSS framework.

## Adding things

- **A pattern:** add `site/src/web/<id>.json` (copy an existing one for the shape) and its photos as `site/public/img/<id>/1.jpg`, `2.jpg`, … with the finished fly last. Then list the id against the hatches it suits in `site/src/data.js` and run `npm run check`.
- **A water or a hatch:** edit `REGIONS` and `HATCHES` in `site/src/data.js`. A water needs a map centre (`at`, `zoom`) for the trip log's starting view.

## How far to trust the hatch data

- **Driftless** mayflies, caddis and stoneflies are transcribed from the SWTU hatch chart. Rows marked `*` in the site are general knowledge.
- **White River** and **Idaho** follow published hatch charts for months; some hook sizes come from fly-shop web charts.
- **Michigan** and **the Rockies** are starter calendars that have not been checked against a local chart.

The step text for the web-tutorial patterns was summarised from each tutorial and only spot-checked against the photos.

## Outside services

The site itself runs locally, but two features call out:

- **Map tiles:** USGS The National Map (public domain, no key).
- **Place search:** OpenStreetMap Nominatim (no key). Search terms are sent to its servers, only when Search is pressed.
- **Fonts:** Google Fonts; the page falls back to system fonts offline.
