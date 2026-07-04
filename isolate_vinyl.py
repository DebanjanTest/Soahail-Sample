import cv2
import numpy as np
import os

def isolate_vinyl():
    in_path = r"C:\Users\DEBANJAN MONDAL\.gemini\antigravity-cli\brain\387aa779-65c2-475c-b5c7-81fd588cd356\vinyl_record_disc_1783187211513.jpg"
    out_path = r"E:\Sohail\public\vinyl_record.png"
    
    if not os.path.exists(in_path):
        print("Input file not found")
        return
        
    img = cv2.imread(in_path)
    if img is None:
        print("Could not load image")
        return
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Threshold to find the black circle against the white background
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("No contours detected")
        return
        
    mask = np.zeros_like(gray)
    largest_contour = max(contours, key=cv2.contourArea)
    
    # Draw the circular vinyl mask as fully opaque
    cv2.drawContours(mask, [largest_contour], -1, 255, -1)
    
    # Feather edges slightly
    mask_blurred = cv2.GaussianBlur(mask, (3, 3), 0)
    
    # Merge channels
    b, g, r = cv2.split(img)
    rgba = cv2.merge([b, g, r, mask_blurred])
    
    # Save as transparent PNG
    cv2.imwrite(out_path, rgba)
    print("Transparent vinyl record PNG created successfully!")

if __name__ == "__main__":
    isolate_vinyl()
