"""Flatten approved opaque redactions before exporting public WebP files."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / ".private/PreviewsProyectosMarsan"
OUTPUT = ROOT / "public/projects/marsan"
# Coordinates refer to original pixels, before resizing. Never blur sensitive data.
JOBS = {
    "mpms": ("08.MPMS/Main.png", []),
    "cotizador": ("06.Cotizador/Main.png", [(285,140,1865,213), (295,318,1182,835), (1228,317,1860,461), (15,600,240,830), (10,887,185,941)]),
    "bi": ("11.Cuadro de Mando/Main.png", [(10,8,396,71), (519,30,697,71), (712,30,1030,71), (210,127,1288,630), (12,672,930,812), (1317,145,1509,474), (124,813,1509,847)]),
    "mhrm": ("03.MHRM/Modulos.png", [(1532,8,1725,82)]),
    "pacs": ("05.PACs/main.png", [(1265,6,1420,39), (15,53,1600,84), (9,123,250,145), (126,153,290,188), (15,254,1865,924), (1627,52,1710,83)]),
    "navsync": ("07.NavSync/Admin.png", [(12,87,182,294), (277,323,1660,686)]),
    "presencia": ("02.Presencia/Main.png", [(1520,0,1710,31), (294,83,840,136), (292,267,991,593), (1063,143,1620,535), (1100,641,1610,696), (264,849,1643,1028)]),
    "planificador": ("10.Planificador/main.png", [(120,44,322,99), (399,110,1250,145), (773,47,1316,69), (580,186,1895,207), (16,207,1893,986), (0,1005,750,1030)]),
}

OUTPUT.mkdir(parents=True, exist_ok=True)
font_path = "/System/Library/Fonts/Supplemental/Arial.ttf"
font = ImageFont.truetype(font_path, 16)
proof = Image.new("RGB", (1280, 4 * 390), "#18202b")
for index, (name, (source, rectangles)) in enumerate(JOBS.items()):
    with Image.open(SOURCE / source) as original:
        image = original.convert("RGB")
    draw = ImageDraw.Draw(image)
    for x0, y0, x1, y1 in rectangles:
        draw.rectangle((x0, y0, x1, y1), fill="#e7edf3")
        if x1 - x0 > 140 and y1 - y0 > 25:
            draw.text((x0 + 12, y0 + 8), "Datos ocultos", font=font, fill="#526478")
    # Explicit notice is baked into the pixels, not a removable HTML overlay.
    label = Image.new("RGB", (image.width, 38), "#18202b")
    ImageDraw.Draw(label).text((16, 10), "CAPTURA REAL / DATOS OCULTOS" if rectangles else "CAPTURA REAL / SELECTOR DE MODULOS", font=font, fill="#d9e5f5")
    result = Image.new("RGB", (image.width, image.height + 38), "white")
    result.paste(image, (0, 0))
    result.paste(label, (0, image.height))
    result.thumbnail((1440, 1000), Image.Resampling.LANCZOS)
    result.save(OUTPUT / f"{name}.webp", "WEBP", quality=88, method=6)
    tile = result.copy()
    tile.thumbnail((620, 340), Image.Resampling.LANCZOS)
    x, y = (index % 2) * 640, (index // 2) * 390
    proof.paste(tile, (x + 10, y + 32))
    ImageDraw.Draw(proof).text((x + 12, y + 8), name, font=font, fill="white")
    print(f"{name}: {len(rectangles)} opaque redactions; {result.size}")
proof.save("/private/tmp/marsan-redaction-proof.jpg", quality=90)
