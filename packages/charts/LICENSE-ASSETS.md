# @bek-ui/charts — asset licences

The code of `@bek-ui/charts` is MIT-licensed. The assets below are **not** covered by MIT.

## Map data — Uzbekistan regions (`RegionMap`)

Map data: **svg-maps** (https://github.com/VictorCazanave/svg-maps), package `@svg-maps/uzbekistan` 2.0.0 by Victor Cazanave (map author: Abduvali Mamajonov), based on the work of MapSVG (https://mapsvg.com). Licensed under the **Creative Commons Attribution 4.0 International** licence (CC BY 4.0, https://creativecommons.org/licenses/by/4.0/).

Files: `src/components/region-map/geo.ts` → `dist/components/region-map/geo.js`.

Changes made (as required by CC BY 4.0):

- taken from the simplified copy in the BEK Design System Figma file (4.18 Chart · Chart/Map): scaled to a 304 × 198 frame, fewer points, coordinates rounded to 0.1;
- region ids replaced with ISO 3166-2:UZ codes (`UZ-AN` … `UZ-XO`), names in Uzbek;
- the two `tashkent` ids of the original (region and city) split into `UZ-TO` and `UZ-TK`;
- the Aral Sea kept as a decorative shape.

The hex tile layout (`RegionMap variant="hex"`) is BEK's own design.

When you show the map, credit the source, e.g. "Map: svg-maps (V. Cazanave), CC BY 4.0".
