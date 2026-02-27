const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BOOKS_DIR = path.join(__dirname, '..', 'src', 'data', 'books');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'books');

const fileMap = {
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
};

// Extremely rudimentary PDF text extractor that just looks for ASCII strings in uncompressed streams.
// Not perfect but bypasses all nodejs module/native compilation errors in this environment.
function extractRawTextFromPDF(pdfBuffer) {
    let extractedText = '';

    // Look for streams
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/gm;
    let match;

    while ((match = streamRegex.exec(pdfBuffer.toString('binary'))) !== null) {
        const streamData = match[1];

        try {
            // Attempt to uncompress if it is zlib compressed (FlateDecode)
            const uncompressed = zlib.inflateSync(Buffer.from(streamData, 'binary'));
            const text = uncompressed.toString('utf8');

            // Extract text from TJ / Tj operators
            const tjRegex = /\((.*?)\)\s*T[jJ]/g;
            let tjMatch;
            while ((tjMatch = tjRegex.exec(text)) !== null) {
                // PDF strings often have octal and escape sequences, we do a basic replace
                let str = tjMatch[1]
                    .replace(/\\r/g, '\n')
                    .replace(/\\n/g, '\n')
                    .replace(/\\\(/g, '(')
                    .replace(/\\\)/g, ')')
                    .replace(/\\\\/g, '\\');
                extractedText += str + ' ';
            }
        } catch (e) {
            // Stream wasn't zlib compressed or wasn't text data.
            // Just scan for printable ASCII as a fallback.
            const asciiText = streamData.replace(/[^\x20-\x7E\n]/g, '');
            if (asciiText.length > 50) { // Only keep substantial chunks
                extractedText += asciiText + '\n';
            }
        }
    }

    return extractedText.trim();
}

async function parseAllPdfs() {
    console.log('📚 Starting Vanilla PDF text extraction...');

    for (const category of ['astrology', 'yoga']) {
        const categoryDir = path.join(BOOKS_DIR, category);
        if (!fs.existsSync(categoryDir)) continue;

        const files = fs.readdirSync(categoryDir);
        const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));

        for (const pdfFile of pdfFiles) {
            const baseName = path.basename(pdfFile, '.pdf');

            let targetJsonFile = null;
            for (const [key, val] of Object.entries(fileMap[category])) {
                if (baseName.includes(key) || key.includes(baseName)) {
                    targetJsonFile = val;
                    break;
                }
            }

            if (!targetJsonFile) targetJsonFile = `${baseName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;

            const pdfPath = path.join(categoryDir, pdfFile);
            const jsonPath = path.join(OUTPUT_DIR, category, targetJsonFile);

            console.log(`\n⏳ Parsing: ${pdfFile}...`);

            try {
                const pdfBuffer = fs.readFileSync(pdfPath);
                console.log(`   Analysing ${pdfBuffer.length} bytes...`);

                const rawText = extractRawTextFromPDF(pdfBuffer);

                if (rawText.length < 100) {
                    console.log(`   ⚠️ Could not extract meaningful text from ${pdfFile}. PDF might be scanned images or heavily encrypted.`);
                    continue;
                }

                console.log(`   ✅ Extracted text (${rawText.length} characters)`);

                const chunks = [];
                const chunkSize = 10000;
                for (let i = 0; i < rawText.length; i += chunkSize) {
                    chunks.push(rawText.substring(i, i + chunkSize));
                }

                const chaptersData = chunks.map((chunk, index) => ({
                    number: index + 1,
                    name: `Extracted Section ${index + 1}`,
                    verses: [
                        {
                            number: 1,
                            translation: chunk.substring(0, 10000), // Safety clip
                            keywords: []
                        }
                    ]
                }));

                let bookData = {
                    title: baseName.replace(/_/g, ' '),
                    author: "Unknown",
                    category: category,
                    chapters: chaptersData
                };

                if (fs.existsSync(jsonPath)) {
                    try {
                        const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                        bookData = { ...existingData, chapters: chaptersData };
                    } catch (e) { }
                }

                fs.writeFileSync(jsonPath, JSON.stringify(bookData, null, 2));
                console.log(`   💾 Saved extracted text to: ${targetJsonFile}`);

            } catch (err) {
                console.error(`   ❌ Failed to parse ${pdfFile}:`, err);
            }
        }
    }

    console.log('\n🎉 All PDFs parsed and injected using Vanilla extractor!');
}

parseAllPdfs();
