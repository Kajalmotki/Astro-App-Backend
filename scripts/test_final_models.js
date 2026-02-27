const OPENROUTER_API_KEY = "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";

async function test(modelName) {
    console.log('Testing:', modelName);
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://astro-revo-vite.vercel.app',
                'X-Title': 'AstroRevo'
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: 'user', content: 'hi' }]
            })
        });

        const data = await response.json();
        if (data.error) {
            console.log('ERROR:', data.error.message);
        } else {
            console.log('SUCCESS:', data.choices[0].message.content.substring(0, 50));
        }
    } catch (e) {
        console.error('FETCH ERROR:', e);
    }
}

async function runTests() {
    await test('google/gemma-3-27b-it:free');
    await test('openai/gpt-oss-120b:free');
    await test('mistralai/mistral-small-3.1-24b-instruct:free');
    await test('openrouter/free');
}
runTests();
