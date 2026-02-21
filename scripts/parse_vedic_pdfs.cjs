const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

const PDF_PATHS = [
    "C:\\Users\\Siddharth\\Downloads\\Phaladeepika.pdf",
    "C:\\Users\\Siddharth\\Downloads\\surya_siddhanta_english_text.pdf",
    "C:\\Users\\Siddharth\\Downloads\\saravaliofkalyan01kalyuoft.pdf",
    "C:\\Users\\Siddharth\\Downloads\\Maharishi_Parashara_-_Brihat_Parasara_Hora_Sastra_(Vol._1).pdf",
    "C:\\Users\\Siddharth\\Downloads\\the_brihat_jataka_of_varaha_mihira.pdf",
    "C:\\Users\\Siddharth\\Downloads\\jataka-parijata-vol-1.pdf"
];

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'vedic_knowledge_base.json');

// Process text into 500-word chunks representing logical sections to not overload JSON payload
function chunkText(text, bookName, chunkSize = 500) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push({
            book: bookName,
            content: words.slice(i, i + chunkSize).join(" ")
        });
    }
    return chunks;
}

async function parseAllPDFs() {
    let allChunks = [];
    console.log("Starting extraction of 6 Vedic text books...");

    for (const pdfPath of PDF_PATHS) {
        const bookName = path.basename(pdfPath, '.pdf');
        console.log(`\nProcessing: ${bookName}`);

        try {
            if (!fs.existsSync(pdfPath)) {
                console.error(`ERROR: File not found at ${pdfPath}`);
                continue;
            }

            const dataBuffer = fs.readFileSync(pdfPath);
            const data = await pdfParse(dataBuffer);

            console.log(`Successfully extracted ${data.numpages} pages from ${bookName}`);

            // Clean somewhat messy text
            const cleanedText = data.text.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
            const chunks = chunkText(cleanedText, bookName);

            allChunks.push(...chunks);
            console.log(`Generated ${chunks.length} text chunks for ${bookName}.`);

        } catch (error) {
            console.error(`Failed to parse ${bookName}:`, error.message);
        }
    }

    console.log(`\nAll done! Writing a total of ${allChunks.length} knowledge chunks to ${OUTPUT_PATH}...`);

    // Write out the file to be statically hosted / accessible from frontend
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allChunks, null, 2), 'utf-8');

    console.log("Knowledge base successfully created.");
    console.log("You can now fetch('/vedic_knowledge_base.json') from the frontend, search for relevant sections based on user query keywords, and inject ONLY relevant context into the system prompt to avoid passing 10+ MBs of data per API call.");
}

parseAllPDFs();
