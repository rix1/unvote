import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { VotingData } from "./types.d.ts";

const db = new DB("./un_voting_data.db");

export function insertIntoDatabase(data: Array<VotingData>) {
  for (const item of data) {
    db.query(
      `INSERT INTO voting_data (
      documentId,
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
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        item.documentId,
        item.title,
        item.authors,
        item.votingData.yes,
        item.votingData.no,
        item.votingData.abstentions,
        item.votingData.non_voting,
        item.votingData.total_voting_membership,
        item.metadata.resolution,
        item.metadata.date,
        item.metadata.resourceType,
      ],
    );
  }
}

export function closeDatabase() {
  db.close();
}
