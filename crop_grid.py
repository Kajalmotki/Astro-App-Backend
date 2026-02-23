import os
from PIL import Image

def crop_grid():
    img_path = r"d:\astro app\public\images\yoga\Gemini_Generated_Image_jmveiujmveiujmve.png"
    out_dir = r"d:\astro app\public\images\yoga"
    
    # Load image
    img = Image.open(img_path)
    width, height = img.size
    
    # Calculate crop dimensions for a 2x4 grid
    item_w = width // 4
    item_h = height // 2
    
    filenames = [
        "svadhisthana_trikonasana",     "manipura_ardhamatsyendrasana", "manipura_paschimottanasana", "manipura_suryanamaskar",
        "anahata_ustrasana",            "anahata_gomukhasana",          "anahata_setubandhasana",     "ajna_prasarita"
    ]
    
    count = 0
    for row in range(2):
        for col in range(4):
            left = col * item_w
            upper = row * item_h
            right = left + item_w
            lower = upper + item_h
            
            box = (left, upper, right, lower)
            cropped_img = img.crop(box)
            
            # Save cropped image
            out_path = os.path.join(out_dir, f"{filenames[count]}.png")
            cropped_img.save(out_path)
            count += 1
            print(f"Saved {out_path}")

if __name__ == "__main__":
    crop_grid()
