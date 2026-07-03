import os
from PIL import Image, ImageDraw

def flood_fill_transparent(img_path, out_path):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return
        
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    # Create a grayscale mask initialized to 0 (black)
    mask = Image.new("L", (width, height), 0)
    
    # Fill mask with 255 (white) where the image pixels are near-white
    pixels = img.load()
    mask_pixels = mask.load()
    
    # Set threshold dynamically (slightly lower for pens/notebooks, higher for mug)
    is_mug = "mug" in img_path.lower()
    threshold = 245 if is_mug else 235
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                mask_pixels[x, y] = 255
                
    # Floodfill the mask from the four corners with value 128 (gray)
    # This separates the connected white background from any white details on the product itself
    corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    for start_point in corners:
        if mask.getpixel(start_point) == 255:
            ImageDraw.floodfill(mask, start_point, 128)
            
    # Apply mask: any pixel marked as 128 gets alpha = 0 (fully transparent)
    for y in range(height):
        for x in range(width):
            if mask.getpixel((x, y)) == 128:
                r, g, b, a = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)
                
    img.save(out_path, "PNG")
    print(f"Converted {os.path.basename(img_path)} -> {os.path.basename(out_path)}")

public_dir = r"E:\Sohail\public"
files = [
    ("blank_tshirt.jpg", "blank_tshirt.png"),
    ("blank_mug.jpg", "blank_mug.png"),
    ("blank_pen.jpg", "blank_pen.png"),
    ("blank_hoodie.jpg", "blank_hoodie.png"),
    ("blank_notebook.jpg", "blank_notebook.png"),
]

for infile, outfile in files:
    inpath = os.path.join(public_dir, infile)
    outpath = os.path.join(public_dir, outfile)
    flood_fill_transparent(inpath, outpath)
