import { assertEquals } from "https://deno.land/std@0.214.0/assert/mod.ts";
import { parseSearchResults } from "./searchResults.ts";

Deno.test(function testSearchResultsParser() {
  const storedKey = localStorage.key(localStorage.length - 1);
  if (!storedKey) {
    throw new Error("No stored key found in localStorage");
  }
  const html = localStorage.getItem(storedKey);
  if (!html) {
    throw new Error("No stored item found in localStorage");
  }

  const expected = {
    document_id: "282055",
    title: "Question of Namibia : resolution / adopted by the General Assembly",
    authors: "RECORDED based on A/S-14/PV.7 - No machine generated vote.",
    votingData: {
      yes: 126,
      no: 0,
      abstentions: 24,
      non_voting: 9,
      total_voting_membership: 159,
    },
    metadata: {
      resolution: "A/RES/S-14/1",
      vote_date: "1986-09-20",
      resourceType: "Voting Data",
    },
  };
  const parsedDoc = parseSearchResults(html)[0];

  assertEquals(expected, parsedDoc);
});
