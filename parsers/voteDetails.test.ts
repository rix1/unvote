import { assertEquals } from "https://deno.land/std@0.214.0/assert/mod.ts";
import { voteDetailsParser, parseCountryList } from "./voteDetails.ts";
import { fetchPageContent } from "../api.ts";

Deno.test(async function testVoteDetailsParser() {
  const baseURL = "https://digitallibrary.un.org/record/4030703";
  const htmlContent = await fetchPageContent(baseURL);
  const documentDetails = voteDetailsParser(htmlContent);

  // Ensure that all groups have more than one country
  assertEquals(documentDetails.yes_countries.length > 1, true);
  assertEquals(documentDetails.no_countries.length > 1, true);
  assertEquals(documentDetails.abstention_countries.length > 1, true);
  assertEquals(documentDetails.non_voting_countries.length > 1, true);
  assertEquals(documentDetails.total_voting_membership, 193);
});

const stub = [
  " AFGHANISTAN",
  "  DOMINICA",
  " N ISRAEL",
  " A CAMEROON",
  " Y ALBANIA",
  " Y ANTIGUA AND BARBUDA",
  " Y BOLIVIA (PLURINATIONAL STATE OF)",
  " Y BOSNIA AND HERZEGOVINA",
];

Deno.test(function testCountryVotingResultsParser() {
  const votingResults = parseCountryList(stub);

  assertEquals(votingResults.yes_countries[0], "ALBANIA");
  assertEquals(votingResults.yes_countries[1], "ANTIGUA AND BARBUDA");
  assertEquals(
    votingResults.yes_countries[2],
    "BOLIVIA (PLURINATIONAL STATE OF)",
  );
  assertEquals(votingResults.yes_countries[3], "BOSNIA AND HERZEGOVINA");
  // No
  assertEquals(votingResults.no_countries[0], "ISRAEL");
  // Abstentions
  assertEquals(votingResults.abstention_countries[0], "CAMEROON");
  // Not voting
  assertEquals(votingResults.non_voting_countries[0], "AFGHANISTAN");
  assertEquals(votingResults.non_voting_countries[1], "DOMINICA");
});
