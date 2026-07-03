import cv2
import numpy as np
import os

def process_mug():
    in_path = r"E:\Sohail\public\blank_mug.jpg"
    out_path = r"E:\Sohail\public\blank_mug.png"
    
    if not os.path.exists(in_path):
        print(f"File not found: {in_path}")
        return
        
    img = cv2.imread(in_path)
    if img is None:
        print("Could not open image")
        return
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Threshold at 252 to remove only pure white background
    _, thresh = cv2.threshold(gray, 252, 255, cv2.THRESH_BINARY_INV)
    
    # Morphological clean up
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    # Find outer contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("No contours found")
        return
        
    mask = np.zeros_like(gray)
    largest_contour = max(contours, key=cv2.contourArea)
    cv2.drawContours(mask, [largest_contour], -1, 255, -1)
    
    # Soft feathering
    mask_blurred = cv2.GaussianBlur(mask, (5, 5), 0)
    
    b, g, r = cv2.split(img)
    rgba = cv2.merge([b, g, r, mask_blurred])
    
    cv2.imwrite(out_path, rgba)
    print("New mug PNG generated successfully with clean background!")

if __name__ == "__main__":
    process_mug()
