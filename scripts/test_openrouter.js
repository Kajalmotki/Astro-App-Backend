const OPENROUTER_API_KEY = "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";

async function test(modelName) {
    console.log("Testing:", modelName);
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://astro-revo-vite.vercel.app",
                "X-Title": "AstroRevo"
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: "user", content: "hi" }]
            })
        });

        const data = await response.json();
        console.log("RESPONSE:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("ERROR:", e);
    }
}

async function runTests() {
    await test("deepseek/deepseek-chat:free");
    await test("mistralai/mistral-7b-instruct:free");
    await test("huggingfaceh4/zephyr-7b-beta:free");
    await test("gryphe/mythomax-l2-13b:free");
}

runTests();
