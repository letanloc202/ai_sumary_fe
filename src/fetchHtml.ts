export async function fetchContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    // Extract content using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector("title")?.textContent?.trim() || "";
    const headers = Array.from(
      doc.querySelectorAll("h1, h2, h3, h4, h5, h6, p")
    )
      .map((header) => header.textContent?.trim() || "")
      .filter(Boolean);

    // Combine title and headers into a single string
    return [title, ...headers].join("\n");
  } catch (error) {
    console.error("Failed to fetch content:", error);
    throw error;
  }
}
