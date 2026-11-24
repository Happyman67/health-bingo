"""Draw the Health Bingo home-screen icons. Requires Pillow."""

from PIL import Image, ImageDraw

CREAM = (251, 246, 236, 255)
COLUMNS = [
    (255, 139, 94, 255),
    (183, 155, 255, 255),
    (255, 155, 192, 255),
    (126, 212, 152, 255),
    (255, 200, 87, 255),
]
DEEP = [
    (194, 75, 34, 255),
    (109, 76, 196, 255),
    (210, 78, 134, 255),
    (46, 139, 78, 255),
    (143, 100, 16, 255),
]


def mix(color, other, amount):
    return tuple(int(color[i] * (1 - amount) + other[i] * amount) for i in range(4))


def draw_icon(size: int, maskable: bool = False) -> Image.Image:
    image = Image.new("RGBA", (size, size), CREAM)
    draw = ImageDraw.Draw(image)
    if not maskable:
        radius = int(size * 0.22)
        mask = Image.new("L", (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
        background = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        plate = Image.new("RGBA", (size, size), CREAM)
        background.paste(plate, (0, 0), mask)
        image = background
        draw = ImageDraw.Draw(image)

    margin = int(size * (0.2 if maskable else 0.16))
    gap = max(2, int(size * 0.028))
    board = size - margin * 2
    cell = (board - gap * 4) / 5
    for row in range(5):
        for col in range(5):
            x0 = margin + col * (cell + gap)
            y0 = margin + row * (cell + gap)
            x1 = x0 + cell
            y1 = y0 + cell
            color = DEEP[col] if row == 0 else mix(COLUMNS[col], CREAM, 0.42)
            radius = max(2, int(cell * 0.28))
            draw.rounded_rectangle((x0, y0, x1, y1), radius=radius, fill=color)
    return image


def main() -> None:
    draw_icon(192).save("public/icon-192.png")
    draw_icon(512).save("public/icon-512.png")
    draw_icon(512, maskable=True).save("public/icon-maskable.png")
    draw_icon(180, maskable=True).save("public/apple-touch-icon.png")
    icon32 = draw_icon(64, maskable=True).resize((32, 32), Image.Resampling.LANCZOS)
    icon32.save("app/favicon.ico", sizes=[(32, 32)])
    icon32.save("public/favicon-32.png")


if __name__ == "__main__":
    main()
