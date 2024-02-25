// Function to fetch page content
const DEV = Deno.env.get("DEV") === "true";
export async function fetchPageContent(url: string): Promise<string> {
  if (DEV) {
    const cachedItem = localStorage.getItem(`cache:${url}`);
    if (typeof cachedItem === "string") {
      console.log("Using cached item for ", url);
      return cachedItem;
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch page");
  }
  const textResponse = await response.text();

  if (DEV) {
    localStorage.setItem(`cache:${url}`, textResponse);
  }

  return textResponse;
}
