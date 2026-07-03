import os
from PIL import Image, ImageDraw, ImageFilter

def make_slick_transparent(img_path, out_path, is_mug=False, is_notebook=False):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return
        
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    # We want a mask initialized to 0 (product)
    # Background pixels connected to corners will be 255 (background)
    mask = Image.new("L", (width, height), 0)
    
    # Find pixels that are very close to white
    pixels = img.load()
    mask_pixels = mask.load()
    
    # White threshold. Mug is very white, so threshold is higher (248) to avoid eating highlights.
    threshold = 248 if is_mug or is_notebook else 240
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                mask_pixels[x, y] = 255
                
    # Floodfill from the corners with 128 (temp background indicator)
    corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    for start_point in corners:
        if mask.getpixel(start_point) == 255:
            ImageDraw.floodfill(mask, start_point, 128)
            
    # Create final alpha mask: background (where value is 128) is 0 (transparent), product is 255 (opaque)
    alpha = Image.new("L", (width, height), 255)
    alpha_pixels = alpha.load()
    for y in range(height):
        for x in range(width):
            if mask.getpixel((x, y)) == 128:
                alpha_pixels[x, y] = 0
                
    # FEATHERING: Apply a soft Gaussian Blur to the alpha mask to make edges anti-aliased and smooth
    # This prevents pixelated jagged edges
    alpha_feathered = alpha.filter(ImageFilter.GaussianBlur(1.5))
    
    # Put the feathered alpha channel back into the image
    img.putalpha(alpha_feathered)
    
    # Save the output image as PNG
    img.save(out_path, "PNG")
    print(f"Slick cutout created: {os.path.basename(out_path)}")

public_dir = r"E:\Sohail\public"
files = [
    ("blank_tshirt.jpg", "blank_tshirt.png"),
    ("blank_mug.jpg", "blank_mug.png"),
    ("blank_pen.jpg", "blank_pen.png"),
    ("blank_hoodie.jpg", "blank_hoodie.png"),
    ("blank_notebook.jpg", "blank_notebook.png"),
    ("blank_phone_case.jpg", "blank_phone_case.png"),
]

for infile, outfile in files:
    inpath = os.path.join(public_dir, infile)
    outpath = os.path.join(public_dir, outfile)
    make_slick_transparent(inpath, outpath, is_mug=("mug" in infile), is_notebook=("notebook" in infile))
