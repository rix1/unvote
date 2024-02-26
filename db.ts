import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { VotingResults, VotingDocumentSummary } from "./types.d.ts";

const db = new DB("./un_voting_data.db");

export function getDocumentIds() {
  const data = db.query("SELECT document_id FROM voting_data");
  return data.flat();
}

export function writeVoteDetailsToDatabase(
  document_id: string,
  data: VotingResults,
) {
  try {
    // Update the title in the voting_data table
    db.query("UPDATE voting_data SET title = ? WHERE document_id = ?", [
      data.title,
      document_id,
    ]);
  } catch (error) {
    console.error(
      `Skipping updating title for <${document_id}> due to error: ${error.message}`,
    );
  }

  // Function to insert vote details for a specific vote type
  const insertVoteDetails = (voteType: string, countries: string[]) => {
    countries.forEach((country) => {
      db.query(
        "INSERT INTO voting_results (document_id, country, vote) VALUES (?, ?, ?)",
        [document_id, country, voteType],
      );
    });
  };

  try {
    // Insert voting details for each vote type
    insertVoteDetails("YES", data.yes_countries);
    insertVoteDetails("NO", data.no_countries);
    insertVoteDetails("ABSTENTION", data.abstention_countries);
    insertVoteDetails("NON_VOTING", data.non_voting_countries);
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      console.error(
        `Skipping database update for <${document_id}>. The votes for this document already exists in database.`,
      );
    } else {
      console.error(
        `Error inserting vote data for <${document_id}> due to error: ${error.message}`,
      );
    }
  }
}

export function insertSummaries(data: Array<VotingDocumentSummary>) {
  for (const item of data) {
    try {
      db.query(
        `INSERT INTO voting_data (
      document_id,
      title,
      authors,
      yes,
      no,
      abstentions,
      non_voting,
      total_voting_membership,
      resolution,
      date,
      resourceType,
      scraped_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          item.document_id,
          item.title,
          item.authors,
          item.votingData.yes,
          item.votingData.no,
          item.votingData.abstentions,
          item.votingData.non_voting,
          item.votingData.total_voting_membership,
          item.metadata.resolution,
          item.metadata.vote_date,
          item.metadata.resourceType,
        ],
      );
    } catch (error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        console.error(
          `Skipping database update for <${item.document_id}>. The document already exists in database.`,
        );
        continue;
      }
      console.error("Unknown error", error);
    }
  }
}

export function closeDatabase() {
  db.close();
}
