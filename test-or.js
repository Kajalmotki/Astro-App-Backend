const OPENROUTER_API_KEY = "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";
fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        max_tokens: 100,
        messages: [{ role: "user", content: "test" }]
    })
})
    .then(r => r.text())
    .then(console.log)
    .catch(console.error);
