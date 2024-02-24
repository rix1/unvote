// Function to fetch page content
export async function fetchPageContent(url: string): Promise<string> {
  const cachedItem = localStorage.getItem(`cache:${url}`);
  if (typeof cachedItem === "string") {
    return cachedItem;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch page");
  }
  const textResponse = await response.text();

  localStorage.setItem(`cache:${url}`, textResponse);

  return textResponse;
}
