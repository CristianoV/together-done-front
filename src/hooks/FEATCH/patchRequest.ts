const backendUrl = 'http://localhost:3010';

export const patchRequest = async (url: string, payload: { arg: Record<string, string> }) => {
  try {
    const response = await fetch(`${backendUrl}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload.arg),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json(); // Retorna a resposta em formato JSON
  } catch (error) {
    console.error('Failed to send request:', error);
    throw error; // Repassa o erro para que possa ser tratado onde a função é chamada
  }
};