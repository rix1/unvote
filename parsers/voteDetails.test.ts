import { assertEquals } from "https://deno.land/std@0.214.0/assert/mod.ts";
import { voteDetailsParser } from "./voteDetails.ts";
import { fetchPageContent } from "../api.ts";

Deno.test(async function testVoteDetailsParser() {
  const baseURL = "https://digitallibrary.un.org/record/4030703";
  const htmlContent = await fetchPageContent(baseURL);
  const documentDetails = voteDetailsParser(htmlContent);
  assertEquals(false, true);
});
