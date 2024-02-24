// Import required modules
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Element } from "https://deno.land/x/deno_dom@v0.1.45/src/dom/element.ts";

const log = console.log;

function formatKey(raw: string) {
  return raw.trim().toLowerCase().replace(/[\s-]/g, "_");
}

function parseVotingResults(results: string | undefined) {
  if (!results) {
    throw new Error("Failed to parse voting results");
  }
  return results.split("|").reduce((prev, next) => {
    const [key, value] = next.split(":");
    return { ...prev, [formatKey(key)]: Number(value.trim()) };
  }, {});
}

function parseMetadata(meta: string | undefined) {
  if (!meta) {
    throw new Error("Failed to parse metadata");
  }
  const [resolution, date, resourceType] = meta
    .split("|")
    .map((item) => item.trim());
  return { resolution, date, resourceType };
}

function parseRow(row: Element) {
  const [first, second] = [...row.querySelectorAll("td")].map(
    (node) => node as Element,
  );
  if (!first || !second) {
    throw new Error("Failed to parse row");
  }
  // Get ID from first cell
  const id = first.querySelector("abbr")?.getAttribute("title");

  // Extract other data from the second cell
  const title = second
    .querySelector(".result-title > a")
    ?.innerHTML.replaceAll("\n", "")
    .trim();
  const authors = second.querySelector(".authors")?.innerHTML.trim();
  const votingResults = second
    .querySelector(".result-abstract > div:nth-child(2)")
    ?.textContent.trim();
  const metaData = second
    .querySelector(".brief-options")
    ?.textContent.trim()
    .replace(/\s+/g, " ")
    .replace(/\s\|$/, "");

  const votingData = parseVotingResults(votingResults);
  const metadata = parseMetadata(metaData);

  return {
    documentId: id,
    title: title,
    authors: authors,
    votingData,
    metadata,
  };
}

// Function to parse HTML and extract voting data
export function parseVotingData(html: string): Array<any> {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  // find the <form/> element with action "/yourbaskets/add"
  const form = doc.querySelector("form[action='/yourbaskets/add']");

  const rows = [...form.querySelectorAll("table > tbody > tr")];
  return rows.map(parseRow);
}
