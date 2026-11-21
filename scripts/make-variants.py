"""Make an 800px-wide variant (<name>-800.webp) of every capture in src/assets/screens wider than 1000px.

Phones and small screens take the variant through srcset (src/lib/screens.ts); the original stays the large
candidate. Re-run after replacing a capture:  python scripts/make-variants.py
"""
from pathlib import Path
from PIL import Image

SCREENS = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'screens'
WIDTH = 800

for src in sorted(SCREENS.glob('*.webp')):
    if src.stem.endswith(f'-{WIDTH}'):
        continue
    with Image.open(src) as im:
        if im.width <= 1000:
            continue
        h = round(im.height * WIDTH / im.width)
        out = src.with_name(f'{src.stem}-{WIDTH}.webp')
        im.resize((WIDTH, h), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
        print(f'{out.name}: {WIDTH}x{h}, {out.stat().st_size // 1024} KB (from {src.stat().st_size // 1024} KB)')
