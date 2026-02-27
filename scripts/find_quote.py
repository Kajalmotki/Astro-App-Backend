import json
import os
import glob

files = glob.glob('src/data/books/yoga/*.json')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = json.load(file)
        if 'chapters' not in data: continue
        for ch in data['chapters']:
            for verse in ch.get('verses', []):
                t = verse.get('translation', '').lower()
                
                # Check for key keywords that might have survived the raw text extraction
                if 'disease' in t and ('asana' in t or 'yoga' in t):
                    idx = t.find('disease')
                    print(f"[{data['title']}]", t[max(0, idx-100):idx+100].replace('\n', ' '))
