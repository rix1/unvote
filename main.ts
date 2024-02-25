import { parseSearchResults } from "./parsers.ts";
import { fetchPageContent } from "./api.ts";
import { insertIntoDatabase, closeDatabase } from "./db.ts";

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
      insertIntoDatabase(votingData);
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

scrapeSearchResultsByYear()
  .then(() => {
    closeDatabase();
    console.log("Scraping complete.");
  })
  .catch(console.error);
