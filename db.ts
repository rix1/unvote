import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { VotingDocument } from "./types.d.ts";

const db = new DB("./un_voting_data.db");

export function insertIntoDatabase(data: Array<VotingDocument>) {
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
          `Skipping databaseupdate for <${item.document_id}>. The document already exists in database.`,
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
