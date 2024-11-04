const backendUrl = 'http://localhost:3010';

export const getRequest = async (url: string) => {
  try {
    const response = await fetch(`${backendUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status} ${response.statusText}`);
    }

    return await response.json(); // Retorna a resposta em formato JSON
  } catch (error) {
    console.error('Erro ao enviar a requisição:', error);
    throw error; // Repassa o erro para tratamento onde a função é chamada
  }
};