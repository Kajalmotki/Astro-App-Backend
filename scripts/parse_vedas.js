const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const vedaDir = path.join(__dirname, '../src/data/vedas');
const outputDir = path.join(__dirname, '../src/data/books/vedas');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Simple chunking function - splits text into ~1000 char blocks
function chunkText(text, chunkSize = 1000) {
    const words = text.split(/\s+/);
    const chunks = [];
    let currentChunk = [];
    let currentLen = 0;

    for (let word of words) {
        if (currentLen + word.length > chunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [];
            currentLen = 0;
        }
        currentChunk.push(word);
        currentLen += word.length + 1; // +1 for space
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }
    return chunks;
}

async function processPDFs() {
    console.log("Starting PDF extraction...");
    const files = fs.readdirSync(vedaDir).filter(f => f.endsWith('.pdf'));

    for (let file of files) {
        let title = file.replace('.pdf', '');
        console.log(`Processing ${title}... This may take a moment for large files.`);

        let pdfPath = path.join(vedaDir, file);
        let dataBuffer = fs.readFileSync(pdfPath);

        try {
            const data = await pdf(dataBuffer);
            console.log(`Successfully extracted ${data.numpages} pages from ${title}`);

            // Clean up text
            let rawText = data.text.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');

            // Chunk into verses
            const versesText = chunkText(rawText);

            const verses = versesText.map((v, i) => ({
                number: i + 1,
                translation: v.trim(),
                sanskrit: ""
            }));

            const bookJson = {
                title: title,
                author: "Ancient Sages",
                category: "vedas",
                chapters: [
                    {
                        name: "Entire Text",
                        number: 1,
                        verses: verses
                    }
                ]
            };

            const outputPath = path.join(outputDir, `${title.toLowerCase()}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(bookJson, null, 2));
            console.log(`Saved JSON for ${title} to ${outputPath}\n`);
        } catch (err) {
            console.error(`Error processing ${title}:`, err);
        }
    }
    console.log("Finished converting PDFs to JSON knowledge bases.");
}

processPDFs();
