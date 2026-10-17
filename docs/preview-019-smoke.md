# 019 Mac smoke checklist — manual, not yet executed
Parent/supervisor: use normal macOS account, not root/sudo.

1. Download only the repository's 019 branch `下载并启动积木世界.command`. Confirm source URL `feat/019-local-photo-quality.zip`. First run should create `~/BrickWorld3D-preview-019` and open `http://127.0.0.1:4176`. Existing 4173/4174/4175 origins and homes should remain unchanged. Re-running the same script will reuse the same 019 install **without updating code**; back up and use a new directory if testing a newer build.
2. With a toy brick car, select 2+ JPG/PNG/WebP photos taken under different lighting/viewpoints. Check **manual** front/rear/left/right/top/diagonal labeling and missing-direction feedback; do not assume filenames predict angles.
3. Check a small-resolution or badly lit photo warns in its preview. The app computes bounded local samples only and does not classify real vehicle parts, guarantee blur detection, upload bytes or produce geometry.
4. Input measured toy body length/width/height cm, export capture JSON, inspect it: should contain names/types/sizes/views and optional three centimetre dimensions, **no** original photo content, EXIF, GPS or blob URLs.
5. Open Chrome or Safari network tab; photo selections should not POST or upload bytes. Replacing/clearing photos should clear previous preview URLs and warnings; inspect browser memory if available.
6. GLB import/export, six-slot garage, keyboard/touch drive, 3 fictional junctions, 3 road trip gates and FPS diagnostics still work. Capture screenshots & reference Mac FPS. Mac Safari HEIC remains unsupported until a validated decoder is available.
7. Record result/date, OS/browser, first downloaded URL, 4176 success/failure, privacy observations and no real photographs in issue/PR logs. No claim of photo→3D, structural-realistic style or Stockholm real map.

Automated CI: see [PR #18](https://github.com/JohnsonGarden/3D/pull/18) and [019 tasks](../specs/019-local-photo-quality/tasks.md). Real hardware approval pending.
