export const fetchSummary = async (prompt: string): Promise<string> => {
  const url = "http://localhost:8000/summary";
  const data = { prompt };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error; // Re-throw the error to handle it at the call site
  }
};
