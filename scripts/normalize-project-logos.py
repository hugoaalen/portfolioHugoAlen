"""Normalize alpha margins; remove only Moto TV's connected exterior black."""
from collections import deque
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
folder = root / "public/images/project-logos"
for path in folder.glob("*.webp"):
    image = Image.open(path).convert("RGBA")
    if path.stem == "mototv":
        pixels = image.load()
        width, height = image.size
        queue = deque([(x, y) for x in range(width) for y in (0, height - 1)] + [(x, y) for y in range(height) for x in (0, width - 1)])
        seen = set()
        while queue:
            x, y = queue.popleft()
            if (x, y) in seen or not (0 <= x < width and 0 <= y < height):
                continue
            seen.add((x, y))
            r, g, b, a = pixels[x, y]
            if max(r, g, b) > 42:
                continue
            pixels[x, y] = (r, g, b, 0)
            queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
    bounds = image.getchannel("A").point(lambda value: 255 if value > 8 else 0).getbbox()
    if bounds:
        image = image.crop(bounds)
    image.save(path, "WEBP", lossless=True, method=6)
    print(path.name, image.size)
