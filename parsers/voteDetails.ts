import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { assert } from "./assert.ts";
import { VotingResults } from "../types.d.ts";

export function parseCountryList(votingResults: string[]) {
  const result: VotingResults = {
    yes_countries: [],
    no_countries: [],
    abstention_countries: [],
    non_voting_countries: [],
    total_voting_membership: 0,
  };

  const pattern = /^(\s[YNA]\s)(.+)/;
  for (const vote of votingResults) {
    const res = pattern.exec(vote);
    switch (res?.[1].trim()) {
      case "Y":
        result.yes_countries.push(res[2].trim());
        break;
      case "N":
        result.no_countries.push(res[2].trim());
        break;
      case "A":
        result.abstention_countries.push(res[2].trim());
        break;
      default:
        result.non_voting_countries.push(vote.trim());
        break;
    }
  }
  return result;
}

// Parse vote details from the vote details page
export function voteDetailsParser(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  const detailsGroup = doc.getElementById("details-collapse");
  if (!detailsGroup) throw new Error("Failed to find details-collapse element");

  const documentTitleDiv = detailsGroup.querySelector("div:nth-child(1)");

  assert(
    documentTitleDiv && documentTitleDiv.children.length === 2,
    `Failed to find document Title`,
  );
  const fullDocumentTitle = documentTitleDiv.children[1].textContent.trim();

  const voteDetailsHeaderDiv = detailsGroup.querySelector("div:nth-child(10)");

  assert(voteDetailsHeaderDiv, "Failed to find 10th chils of details group");

  const [first, second] = voteDetailsHeaderDiv.children;
  const heading = first.textContent.trim();

  assert(
    heading === "Vote",
    `Failed to find Vote header, found ${heading} instead`,
  );

  const votingResults = parseCountryList(second.innerHTML.split("<br>"));

  return {
    title: fullDocumentTitle,
    ...votingResults,
    total_voting_membership:
      votingResults.yes_countries.length +
      votingResults.no_countries.length +
      votingResults.abstention_countries.length +
      votingResults.non_voting_countries.length,
  };
}
