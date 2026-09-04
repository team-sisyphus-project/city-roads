# City Roads

Render every single road of any city in one image.

Type a city name, pick its boundary, and the app downloads that city's road
network from OpenStreetMap and draws every road as a line. Rivers, parks and
mountains appear on their own as the gaps where no roads exist.

The result is customizable and exportable, so it works as a print-quality
poster of a city.

## What it does

- **Search any city** by name and pick from the matching administrative boundaries
- **Render every road** in that boundary on a WebGL canvas
- **Pan and zoom** freely over the rendered network
- **Customize** line color, background color and line width
- **Export** the result as PNG or SVG (vector output stays sharp at any print size)

## Tech stack

| Role | Choice | Notes |
| --- | --- | --- |
| Build | Vite | Static output only, no server component |
| Framework | Vue 2 | Single-page app |
| Rendering | WebGL (w-gl) | Draws hundreds of thousands of line segments |
| Data | OpenStreetMap Overpass API | Fetched in the browser at runtime |

There is no backend and no database. The build output is a static bundle of
roughly 270 KB, served by any static host.

## Run it locally

```bash
npm install
npm run build
npx http-server dist -p 8080
```

## Current status

Imported unchanged from upstream and verified to build and run. No feature work
has been done yet.

## Attribution

This project is a copy of [anvaka/city-roads](https://github.com/anvaka/city-roads)
by Andrei Kashcha, used under the MIT License. The original license is preserved
in [LICENSE](./LICENSE) and the original README in
[UPSTREAM_README.md](./UPSTREAM_README.md).

- Upstream repository: https://github.com/anvaka/city-roads
- Imported at commit: `0d89417bb942b34fa87775897cc8cf8437d17b79`
- Map data: © OpenStreetMap contributors, available under the
  [Open Database License](https://www.openstreetmap.org/copyright)
