"""Pull the 17 one-page patterns (recipe, 6 step captions, 6 step photos) out of the
SWTU Fly Tying I booklet into site/src/patterns.json + site/public/img/<id>/<n>.jpg.

    python extract_swtu.py "<path to SWTU booklet.pdf>" ../site      (needs: pip install pymupdf)

ponytail: hard-coded to this booklet's layout (pages 11-27, 2x3 photo grid, caption above
each photo). Another PDF = another small script, not a generic extractor.
"""
import json, re, sys, pathlib
import pymupdf

pdf, site = pymupdf.open(sys.argv[1]), pathlib.Path(sys.argv[2])
grid = lambda r: (round(r[1] / 100), r[0])  # reading order: row, then column
patterns = []
for pno in range(10, 27):
    page = pdf[pno]
    imgs = sorted(page.get_image_info(xrefs=True), key=lambda i: grid(i["bbox"]))
    assert len(imgs) == 6, (pno, len(imgs))
    top = imgs[0]["bbox"][1] - 42                              # captions sit in the 42pt above each photo
    clip = lambda *r: page.get_text(clip=pymupdf.Rect(*r), sort=True)
    name, kind = [s.strip() for s in re.split(r"\s+[–-]\s+", " ".join(clip(0, 0, 396, 42).split()), maxsplit=1)]
    pid = re.sub(r"[^a-z0-9]+", "-", name.lower().replace("'", "")).strip("-")

    recipe = []
    for line in clip(0, 42, 396, top).splitlines():
        line = line.strip()
        m = re.match(r"(Weight|[A-Z][A-Za-z &]{1,14}:)\s*(.*)", line)  # the scud page drops the colon after Weight
        if m: recipe.append([m[1].strip(": "), m[2].strip(": ")])
        elif line and recipe: recipe[-1][1] = (recipe[-1][1].rstrip("-") + ("" if recipe[-1][1].endswith("-") else " ") + line).strip()

    caps = [clip(i["bbox"][0] + 15, i["bbox"][1] - 42, i["bbox"][2] + 8, i["bbox"][1]) for i in imgs]
    assert all(len(c.strip()) > 12 for c in caps), (name, caps)

    out = site / "public" / "img" / pid
    out.mkdir(parents=True, exist_ok=True)
    steps = []
    for n, (cap, im) in enumerate(zip(caps, imgs), 1):
        pix = pymupdf.Pixmap(pdf, im["xref"])
        if pix.n - pix.alpha != 3: pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        pix.save(out / f"{n}.jpg", jpg_quality=85)
        text = re.sub(r"-\n(?=[a-z])", "", cap)           # re-join words hyphenated across lines
        text = re.sub(r"\s+", " ", text).strip().replace("..", ".")
        steps.append({"text": text, "img": f"img/{pid}/{n}.jpg"})
    patterns.append({"id": pid, "name": name, "kind": kind, "page": pno - 1, "recipe": recipe, "steps": steps})

# generated - do not hand-edit; fix this script, or add notes in src/data.js
(site / "src" / "patterns.json").write_text(json.dumps(patterns, indent=1, ensure_ascii=False) + "\n")
print(len(patterns), "patterns:", ", ".join(p["id"] for p in patterns))
