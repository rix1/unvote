CREATE TABLE IF NOT EXISTS voting_data (
  documentId TEXT PRIMARY KEY,
  title TEXT,
  authors TEXT,
  yes INTEGER,
  no INTEGER,
  abstentions INTEGER,
  non_voting INTEGER,
  total_voting_membership INTEGER,
  resolution TEXT,
  date TEXT,
  resourceType TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
