export const askLocalBackend = async (question, birthData, userName = 'Seeker') => {
  const payload = {
    question,
    birthData,
    userName,
  };

  const response = await fetch('/api/ask-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Local backend error: ${response.status} ${text}`);
  }

  return response.json();
};

