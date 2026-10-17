# Brick car reconstruction pipeline (M1 — NOT implemented)

## Current source manifest
Original HEIC files at photo source branch root:
`IMG_0719.HEIC`, `IMG_0720.HEIC`, `IMG_0721.HEIC`, `IMG_0722.HEIC`, `IMG_0723.HEIC`, `IMG_0724.HEIC`.
Do not overwrite originals or treat a file list as an actual visual quality audit. EXIF may contain sensitive location; strip metadata on exports.

## Physical reference: parent's measurements (2026-10-17)
- Body length **without front bumper**: 10.4 cm
- Body width: 3.1 cm
- Front-cab highest point: 4.7 cm
- Tire outside diameter: 1.4 cm
- Front bumper maximum protrusion beyond body front: **0.8cm** (game **0.645m**); bumper height unmeasured
- Width-calibrated in-world size: 2.50 m × 8.387 m × 3.790 m; wheel diameter 1.129 m, scale 80.645×; single isotropic multiplier. Overall front-bumper-included length = **9.032m**, subject to verifying other rear appendages.
- Four axle centerlines: first 2.4cm from body front, subsequent spacings 3.2 / 1.6 / 1.6cm, fourth 1.6cm before body rear. Sum **2.4+3.2+1.6+1.6+1.6=10.4cm**. Positions from body front game: 1.9355 / 4.5161 / 5.8065 / 7.0968m; first-to-last span 5.1613m. Assumes tape measures axle centerlines.
- Imported GLB preliminary bbox-X calibration only; final asset should use named body-width landmarks so mirrors/side wheels don't distort the reference. See specs/006-proportional-truck-scale.

## Capture protocol
Capture 12–24 or more sharply focused overlapping views around the assembled model, consistent diffuse illumination, a matte/plain background, fixed focal length and no motion blur. Include front/rear/sides/roof/underside where safe. Add a ruler or known stud pitch as a scale reference. Shoot colorful/reflective and repeating LEGO studs carefully. Photographing several sides is NOT equivalent to guaranteed watertight reconstruction.

## Competing reconstruction methods
1. **Brick-structural (recommended for faithful block geometry)**: manually reconstruct using permitted LDraw/CAD references and photos, review brick counts and hidden surfaces, export GLB. Verify LDraw parts library license/attribution and LEGO trademark conditions.
2. **Classical multiview photogrammetry**: estimate cameras, dense reconstruction, texture/mesh clean-up, check reflectivity and missing undersides; likely hard on glossy uniform brick faces.
3. **AI multi-image model draft**: image-conditioned mesh followed by human geometric corrections. May invent unseen details. Must label inferred areas.

No automatic 'HEIC → accurate Lego CAD model' promise in M0.

## Asset contract
- `source_kind`: photos / manually assembled parts / inferred mesh
- `source_ids`: filenames and hashes (no EXIF)
- `approval`: parent-reviewed, unreviewed, rejected
- `dimensions_m`: actual toy dimensions when measured; `play_scale`: one uniform multiplier
- `forward_axis`, `up_axis`, pivot: documented / validated
- `geometry`: clean normals, appropriate triangle budget, wheel appearance and physically separate collider
- `rights`: creator, source, SPDX/other terms, attribution, permitted redistribution
- `quality`: photo comparison checklist (front, rear, both sides, top, wheels, proportions)

Use content-addressed versioned GLB in future and keep original photos in protected/raw location. GLTFLoader supports GLB, but not arbitrary untrusted scripts; memory-size and disposal constraints need enforcement.

## Third-party map/brick content
LDrawLoader accepts .ldr with a configured parts library; **library not bundled**. Parts library licensing differs by file/version: https://www.ldraw.org/docs-main/licenses/legal-info.html . Attribution policy: https://www.ldraw.org/article/the-ldraw-organization/link-to-ldraw.html .
If/when OSM-derived LA road data is used, follow ODbL attribution: https://osmfoundation.org/wiki/Attribution_Guidelines .
Do not import proprietary Google Maps 3D Tiles into a game without verified licensing.

## M1 acceptance
- Side-by-side render vs images at matching camera angles.
- Parent signs off recognizable contours, colors, wheels and brick connections.
- Never silently fabricate unseen studs; annotate uncertain geometry.
- Export checked GLB with correct orientation and uniform scale; fit road lane without deforming model.
