import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const pdfPath = 'C:\\Users\\Siddharth\\Downloads\\Asana.pdf';

try {
    let dataBuffer = fs.readFileSync(pdfPath);
    pdf(dataBuffer).then(function (data) {
        console.log("Total Pages:", data.numpages);
        fs.writeFileSync('temp_pdf_text.txt', data.text);
        console.log("Successfully extracted text to temp_pdf_text.txt");
    }).catch(err => {
        console.error("Error parsing PDF:", err);
    });
} catch (e) {
    console.error("Error reading file:", e.message);
}
