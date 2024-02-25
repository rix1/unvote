import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Element } from "https://deno.land/x/deno_dom@v0.1.45/src/dom/element.ts";
import { VotingDocument } from "./types.d.ts";

const log = console.log;

function formatKey(raw: string) {
  return raw.trim().toLowerCase().replace(/[\s-]/g, "_");
}

function parseVotingResults(results: string | undefined) {
  /*
   * The voting results are in the format:
   ```html
    <div class=" ">Yes: 159 | No: 1 | Abstentions: 3 | Non-Voting: 30 | Total voting membership: 193</div>
   ```
   */
  if (!results) {
    throw new Error("Failed to parse voting results");
  }
  return results.split("|").reduce((prev, next) => {
    const [key, value] = next.split(":");
    return { ...prev, [formatKey(key)]: Number(value.trim()) };
  }, {});
}

function parseMetadata(meta: string | undefined) {
  /*
  * The metadata is in the format:
    ```html
    <div class="brief-options">
      <i class="fa fa-globe"></i>A/RES/77/248<span class="separator"> | </span> <i class="fa fa-calendar"></i>2022-12-30<span class="separator"> | </span> <i class="fa fa-tag"></i>Voting Data
      <span class="separator"> | </span>
    </div>
    ```
  */
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

  try {
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

    try {
      const votingData = parseVotingResults(votingResults);
      const metadata = parseMetadata(metaData);
      return {
        document_id: id,
        title: title,
        authors: authors,
        votingData,
        metadata,
      };
    } catch (error) {
      log("Error parsing extracted data", votingResults, error);
    }
  } catch (error) {
    log("Error finding DOM elements in row", row, error);
  }
}

// Parse high level document summaries from the search results page
export function parseSearchResults(html: string): Array<VotingDocument> {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  const form = doc.querySelector("form[action='/yourbaskets/add']");

  if (!form) {
    throw new Error("Failed to find form - search results may be empty");
  }

  const rows = [...form.querySelectorAll("table > tbody > tr")];
  return rows.map(parseRow);
}
