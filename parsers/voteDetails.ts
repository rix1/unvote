import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { assert } from "./assert.ts";

// Parse vote details from the vote details page
export function voteDetailsParser(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  const detailsGroup = doc.getElementById("details-collapse");
  if (!detailsGroup) throw new Error("Failed to find details-collapse element");

  const voteDetailsHeader = detailsGroup.querySelector(
    "div:nth-child(10) > span:nth-child(1)",
  );

  assert(
    voteDetailsHeader && voteDetailsHeader.textContent === "Vote",
    "Failed to find vote header",
  );

  assert;
  const voteDetails = detailsGroup.querySelector(
    "div:nth-child(10) > span:nth-child(2)",
  );
  if (!voteDetails) throw new Error("Failed to find vote details");

  const countryVotes = voteDetails.innerHTML.split("<br>");
}
