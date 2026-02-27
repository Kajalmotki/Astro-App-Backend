import os
import json
import PyPDF2

BOOKS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'books')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'books')

file_map = {
    'astrology': {
        'Maharishi': 'brihat_parashara_hora_shastra.json',
        'brihat_jataka': 'brihat_jataka.json',
        'Phaladeepika': 'phaladeepika.json',
        'saravali': 'saravali.json',
        'jataka-parijata': 'jataka_parijata.json',
        'surya_siddhanta': 'surya_siddhanta.json',
        'atharva_veda': 'atharva_veda.json',
        'vedanga_jyotisha': 'vedanga_jyotisha.json'
    },
    'yoga': {
        'Hatha-Yoga-Pradipika': 'hatha_yoga_pradipika.json',
        'gheranda-samhita': 'gheranda_samhita.json',
        'SivaSamhita': 'siva_samhita.json',
        'sat_chakra_Nirupana': 'sat_chakra_nirupana.json',
        'Asana': 'asana_pranayama_mudra_bandha.json'
    }
}

def parse_all_pdfs():
    print("📚 Starting PDF text extraction with Python/PyPDF2...")

    for category in ['astrology', 'yoga']:
        category_dir = os.path.join(BOOKS_DIR, category)
        if not os.path.exists(category_dir): continue

        for pdf_file in os.listdir(category_dir):
            if not pdf_file.lower().endswith('.pdf'): continue
            
            base_name = os.path.splitext(pdf_file)[0]
            
            target_json = None
            for key, val in file_map[category].items():
                if key.lower() in base_name.lower():
                    target_json = val
                    break
            
            if not target_json:
                target_json = base_name.lower().replace(r'[^a-z0-9]', '_') + '.json'

            pdf_path = os.path.join(category_dir, pdf_file)
            json_path = os.path.join(OUTPUT_DIR, category, target_json)

            print(f"\n⏳ Parsing: {pdf_file}...")
            
            try:
                reader = PyPDF2.PdfReader(pdf_path)
                full_text = []
                for page in reader.pages:
                    text = page.extract_text()
                    if text: full_text.append(text)
                
                raw_text = "\n".join(full_text)
                print(f"   ✅ Extracted {len(reader.pages)} pages ({len(raw_text)} characters)")

                chunks = []
                chunk_size = 10000
                for i in range(0, len(raw_text), chunk_size):
                    chunks.append(raw_text[i:i+chunk_size])

                chapters_data = [
                    {
                        "number": idx + 1,
                        "name": f"Extracted Section {idx + 1}",
                        "verses": [
                            {
                                "number": 1,
                                "translation": chunk,
                                "keywords": []
                            }
                        ]
                    }
                    for idx, chunk in enumerate(chunks)
                ]

                book_data = {
                    "title": base_name.replace('_', ' '),
                    "author": "Unknown",
                    "category": category,
                    "chapters": chapters_data
                }

                if os.path.exists(json_path):
                    with open(json_path, 'r', encoding='utf-8') as f:
                        try:
                            existing = json.load(f)
                            book_data = {**existing, "chapters": chapters_data}
                        except: pass

                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(book_data, f, indent=2, ensure_ascii=False)
                
                print(f"   💾 Saved extracted text to: {target_json}")

            except Exception as e:
                print(f"   ❌ Failed to parse {pdf_file}: {str(e)}")

    print("\n🎉 All PDFs parsed and injected using Python!")

if __name__ == "__main__":
    parse_all_pdfs()
