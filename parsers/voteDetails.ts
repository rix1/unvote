import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { assert } from "./assert.ts";
import { VotingResults } from "../types.d.ts";
import { Element, Node } from "https://deno.land/x/deno_dom@v0.1.45/src/api.ts";

export function parseCountryList(votingResults: string[]) {
  const result: VotingResults = {
    yes_countries: [],
    no_countries: [],
    abstention_countries: [],
    non_voting_countries: [],
    total_voting_membership: 0,
  };

  const pattern = /^([YNA]\s)(.+)/;
  for (const vote of votingResults) {
    const res = pattern.exec(vote.trim());
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
function isElement(node: Node | undefined): node is Element {
  return !!node && node.nodeType === Node.ELEMENT_NODE;
}

function findSiblingOfVoteTitle(el: Element) {
  const elements = el.querySelectorAll(".title");
  const targetElement = [...elements].find(
    (el) => el.textContent.trim() === "Vote",
  );
  if (!isElement(targetElement)) {
    throw new Error("Failed to find Vote title!");
  }
  const sibling = targetElement?.nextElementSibling;
  return sibling;
}

// Parse vote details from the vote details page
export function voteDetailsParser(html: string): VotingResults {
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

  const countryDiv = findSiblingOfVoteTitle(detailsGroup);
  assert(countryDiv, "Vote title was found, but no sibling was found.");

  const votingResults = parseCountryList(countryDiv.innerHTML.split("<br>"));

  return {
    ...votingResults,
    title: fullDocumentTitle,
    total_voting_membership:
      votingResults.yes_countries.length +
      votingResults.no_countries.length +
      votingResults.abstention_countries.length +
      votingResults.non_voting_countries.length,
  };
}
