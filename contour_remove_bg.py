import cv2
import numpy as np
import os

def remove_bg_contour(in_path, out_path, is_mug=False, is_pen=False):
    if not os.path.exists(in_path):
        print(f"File not found: {in_path}")
        return
        
    # Read image
    img = cv2.imread(in_path)
    if img is None:
        print(f"Could not open {in_path}")
        return
        
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Threshold to isolate the white background.
    # The backgrounds are very close to white (>= 245)
    threshold_val = 248 if is_mug else 244
    _, thresh = cv2.threshold(gray, threshold_val, 255, cv2.THRESH_BINARY_INV)
    
    # Clean the binary mask with morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    # Find outermost contours (RETR_EXTERNAL ignores internal holes)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        print(f"No contours found for {in_path}")
        return
        
    # Create single-channel alpha mask initialized to black (transparent)
    mask = np.zeros_like(gray)
    
    if is_pen:
        # Pen has fine parts, draw all contours above a tiny size threshold to clean noise
        for c in contours:
            if cv2.contourArea(c) > 20:
                cv2.drawContours(mask, [c], -1, 255, -1)
    else:
        # Draw only the largest contour (the main product) filled with solid white (opaque)
        largest_contour = max(contours, key=cv2.contourArea)
        cv2.drawContours(mask, [largest_contour], -1, 255, -1)
        
    # Apply a Gaussian blur on the mask to create a soft, anti-aliased feather on the edges
    mask_blurred = cv2.GaussianBlur(mask, (5, 5), 0)
    
    # Combine original BGR image with the new alpha channel
    b, g, r = cv2.split(img)
    rgba = cv2.merge([b, g, r, mask_blurred])
    
    # Save the output image as PNG
    cv2.imwrite(out_path, rgba)
    print(f"Slick contour cutout created: {os.path.basename(out_path)}")

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
    remove_bg_contour(inpath, outpath, is_mug=("mug" in infile), is_pen=("pen" in infile))
