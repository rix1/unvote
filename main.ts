import ProgressBar from "https://deno.land/x/progressbar@v0.2.0/progressbar.ts";
import {
  percentageWidget,
  amountWidget,
} from "https://deno.land/x/progressbar@v0.2.0/widgets.ts";

import { parseSearchResults } from "./parsers/searchResults.ts";
import { voteDetailsParser } from "./parsers/voteDetails.ts";
import { fetchPageContent } from "./api.ts";
import { insertSummaries, closeDatabase, getDocumentIds } from "./db.ts";
import { writeVoteDetailsToDatabase } from "./db.ts";

const STARTING_YEAR = 1946;
const END_YEAR = 2023;

async function scrapeSearchResultsByYear() {
  let currentYear = STARTING_YEAR;
  const baseURL =
    "https://digitallibrary.un.org/search?ln=en&cc=Voting%20Data&p=&f=&rm=&sf=&so=d&rg=200&c=Voting%20Data&c=&of=hb&fti=0&fct__2=General%20Assembly&fct__9=Vote&fti=0";

  while (currentYear <= END_YEAR) {
    const pageURL = `${baseURL}&fct__3=${currentYear}`;
    console.log(
      `Scraping voting documents from ${currentYear} (${currentYear} - ${END_YEAR}) - ${END_YEAR - currentYear} left.`,
    );
    const htmlContent = await fetchPageContent(pageURL);
    try {
      const votingData = parseSearchResults(htmlContent);
      insertSummaries(votingData);
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes("search results may be empty")
      ) {
        console.log(`No results for ${currentYear}. Continuing...`);
      }
    }
    currentYear++;
  }
}

// scrapeSearchResultsByYear()
//   .then(() => {
//     closeDatabase();
//     console.log("Scraping document summaries complete.");
//   })
//   .catch(console.error);

const widgets = [percentageWidget, amountWidget];
async function scrapeVoteDetails() {
  const documentIds = getDocumentIds() as string[];
  const pb = new ProgressBar({ total: documentIds.length, widgets });
  for (const [index, documentId] of documentIds.entries()) {
    await pb.update(index);
    const baseURL = "https://digitallibrary.un.org/record";
    const url = `${baseURL}/${documentId}`;
    let documentDetails;
    let htmlContent;
    try {
      htmlContent = await fetchPageContent(url);
    } catch (e) {
      console.error(
        `Something went wrong fetching HTML from ${url}. Continuing...`,
      );
      continue;
    }

    try {
      documentDetails = voteDetailsParser(htmlContent);
    } catch (e) {
      console.error(
        `Something went wrong parsing data for ${documentId}. Continuing...`,
      );
      continue;
    }

    // TODO - insert into database
    writeVoteDetailsToDatabase(documentId, documentDetails);
  }
  await pb.finish();
}

scrapeVoteDetails()
  .then(() => {
    closeDatabase();
    console.log("Scraping vote details complete.");
  })
  .catch(console.error);
