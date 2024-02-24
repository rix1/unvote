import { parseVotingData } from "./parsers.ts";
import { fetchPageContent } from "./api.ts";
import { insertIntoDatabase } from "./db.ts";

// Main scraping function
async function scrapeUNData() {
  let currentPage = 1;
  const MAX_PAGES = 1;
  const baseURL =
    "https://digitallibrary.un.org/search?ln=en&c=Voting+Data&rg=200&fct__2=General+Assembly&cc=Voting+Data&fct__9=Vote";

  while (currentPage <= MAX_PAGES) {
    const pageURL = `${baseURL}&jrec=${(currentPage - 1) * 200 + 1}`;
    const htmlContent = await fetchPageContent(pageURL);
    const votingData = parseVotingData(htmlContent);
    insertIntoDatabase(votingData);
    currentPage++;
  }
}

scrapeUNData()
  .then(() => console.log("Scraping complete."))
  .catch(console.error);
