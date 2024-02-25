import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Element } from "https://deno.land/x/deno_dom@v0.1.45/src/dom/element.ts";
import { VotingDocumentSummary } from "../types.d.ts";
import { assert } from "./assert.ts";

function formatKey(raw: string): keyof VotingDocumentSummary["votingData"] {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]/g, "_") as keyof VotingDocumentSummary["votingData"];
}

function parseVotingResults(
  results: string | undefined,
): VotingDocumentSummary["votingData"] {
  /*
   * The voting results are in the format:
   ```html
    <div class=" ">Yes: 159 | No: 1 | Abstentions: 3 | Non-Voting: 30 | Total voting membership: 193</div>
   ```
   */
  if (!results) {
    throw new Error("Failed to parse voting results");
  }
  return results.split("|").reduce(
    (prev, next) => {
      const [key, value] = next.split(":");
      return { ...prev, [formatKey(key)]: Number(value.trim()) };
    },
    {} as VotingDocumentSummary["votingData"],
  );
}

function parseMetadata(
  meta: string | undefined,
): VotingDocumentSummary["metadata"] {
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
  const [resolution, vote_date, resourceType] = meta
    .split("|")
    .map((item) => item.trim());
  return { resolution, vote_date, resourceType };
}

function parseRow(row: Element): VotingDocumentSummary {
  // Assert that we have the expected number of <td> elements
  const cells = [...row.querySelectorAll("td")];
  assert(cells.length >= 2, "Row does not contain at least two cells.");

  const [firstCell, secondCell] = cells.map((node) => node as Element);

  // Assert and extract document ID
  const idElement = firstCell.querySelector("abbr");
  assert(idElement, "Failed to find <abbr> element for document ID.");
  const documentId = idElement.getAttribute("title");
  assert(documentId, "Document ID is missing.");

  // Extract title
  const titleElement = secondCell.querySelector(".result-title > a");
  assert(titleElement, "Failed to find title element.");
  const title = titleElement.innerHTML.replaceAll("\n", "").trim();

  // Extract authors
  const authorsElement = secondCell.querySelector(".authors");
  assert(authorsElement, "Failed to find authors element.");
  const authors = authorsElement.innerHTML.trim();

  // Extract voting results
  const votingResultsElement = secondCell.querySelector(
    ".result-abstract > div:nth-child(2)",
  );
  assert(votingResultsElement, "Failed to find voting results element.");
  const votingResults = votingResultsElement.textContent.trim();

  // Extract metadata
  const metaDataElement = secondCell.querySelector(".brief-options");
  assert(metaDataElement, "Failed to find metadata element.");
  const metaData = metaDataElement.textContent
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s\|$/, "");

  // Parse voting results and metadata
  const votingData = parseVotingResults(votingResults);
  const metadata = parseMetadata(metaData);

  return {
    document_id: documentId,
    title: title,
    authors: authors,
    votingData,
    metadata,
  };
}

// Parse high level document summaries from the search results page
export function parseSearchResults(html: string): Array<VotingDocumentSummary> {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  const form = doc.querySelector("form[action='/yourbaskets/add']");

  if (!form) {
    throw new Error("Failed to find form - search results may be empty");
  }

  const rows = [
    ...form.querySelectorAll("table > tbody > tr"),
  ] as Array<Element>;

  return rows.map(parseRow);
}
