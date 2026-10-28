"""Create small, lossless logo assets without redrawing the supplied originals."""
from collections import deque
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1] / "public/images/organizations"
ORIGINALS = Path(__file__).resolve().parents[1] / "src/assets/organization-originals"
SOURCES = {
    "grupo-marsan": "grupo-marsan-original",
    "siscom": "siscom-original",
    **{name: name for name in (
        "cdec-group", "uoc", "ies-anton-losada-dieguez",
        "ies-pazo-da-merce", "colegio-hogar", "samsung", "google",
    )},
}


def remove_exterior_white(image):
    """Flood only connected exterior white; keep enclosed white logo details."""
    pixels = image.load()
    width, height = image.size
    seen = set()
    queue = deque([(x, y) for x in range(width) for y in (0, height - 1)]
                  + [(x, y) for y in range(height) for x in (0, width - 1)])
    while queue:
        x, y = queue.popleft()
        if (x, y) in seen or not (0 <= x < width and 0 <= y < height):
            continue
        seen.add((x, y))
        r, g, b, a = pixels[x, y]
        if a and min(r, g, b) < 230:
            continue
        pixels[x, y] = (r, g, b, 0)
        queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
    return image


def keep_main_symbol(image):
    alpha = image.getchannel("A")
    remaining = {(x, y) for y in range(image.height) for x in range(image.width)
                 if alpha.getpixel((x, y)) > 16}
    largest = set()
    while remaining:
        start = remaining.pop()
        component = {start}
        queue = deque([start])
        while queue:
            x, y = queue.popleft()
            for point in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if point in remaining:
                    remaining.remove(point)
                    component.add(point)
                    queue.append(point)
        if len(component) > len(largest):
            largest = component
    mask = Image.new("L", image.size)
    for point in largest:
        mask.putpixel(point, 255)
    mask = mask.filter(ImageFilter.MaxFilter(3))
    alpha.paste(0, mask=ImageOps.invert(mask))
    image.putalpha(alpha)
    return image


for name, source in SOURCES.items():
    image = Image.open(ORIGINALS / f"{source}.png").convert("RGBA")
    if name == "ies-anton-losada-dieguez":
        # The supplied artwork places the wordmark below the standalone blue a.
        image = image.crop((0, 0, image.width, 329))
        pixels = image.load()
        for y in range(image.height):
            for x in range(image.width):
                r, g, b, _ = pixels[x, y]
                alpha = 255 - r if g - r > 12 and b - r > 12 else 0
                if alpha:
                    # Remove white matte from antialiased edge pixels.
                    g = min(255, round((g - r) * 255 / alpha))
                    b = min(255, round((b - r) * 255 / alpha))
                pixels[x, y] = (0, g, b, alpha)
        image = keep_main_symbol(image)
    if image.getchannel("A").getextrema()[0] == 255:
        image = remove_exterior_white(image)
    image = image.crop(image.getchannel("A").getbbox())
    # Never invent resolution beyond the input; 192px supports a 64px Retina mark.
    image.thumbnail((192, 192), Image.Resampling.LANCZOS)
    if name == "siscom":
        image = ImageOps.expand(image, border=3)
        alpha = image.getchannel("A")
        outline = alpha.filter(ImageFilter.MaxFilter(5))
        backing = Image.new("RGBA", image.size, "white")
        backing.putalpha(outline)
        backing.alpha_composite(image)
        image = backing
    target = ROOT / f"{name}.webp"
    image.save(target, "WEBP", lossless=True, method=6)
    print(f"{target.name}: {image.width}x{image.height}, {target.stat().st_size} bytes")

# Inspect every asset on both themes, including alpha and preserved white details.
sheet = Image.new("RGB", (720, len(SOURCES) * 110), "white")
from PIL import ImageDraw
draw = ImageDraw.Draw(sheet)
for row, name in enumerate(SOURCES):
    for column, background in enumerate(("#f4f2ed", "#181d23")):
        tile = Image.new("RGBA", (360, 110), background)
        logo = Image.open(ROOT / f"{name}.webp").convert("RGBA")
        logo.thumbnail((120, 80), Image.Resampling.LANCZOS)
        tile.alpha_composite(logo, (12, (110 - logo.height) // 2))
        sheet.paste(tile.convert("RGB"), (column * 360, row * 110))
        draw.text((column * 360 + 145, row * 110 + 45), name,
                  fill="#111" if column == 0 else "#fff")
sheet.save("/private/tmp/organization-logo-proof.png")
