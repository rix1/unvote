CREATE TABLE IF NOT EXISTS voting_data (
  document_id TEXT NOT NULL UNIQUE,
  title TEXT,
  authors TEXT,
  yes INTEGER,
  no INTEGER,
  abstentions INTEGER,
  non_voting INTEGER,
  total_voting_membership INTEGER,
  resolution TEXT,
  vote_date DATE,
  resourceType TEXT,
  scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voting_results (
  document_id TEXT NOT NULL UNIQUE,
  country TEXT,
  vote TEXT CHECK(vote IN ('YES', 'NO', 'ABSTENTION', 'NON_VOTING')),
  FOREIGN KEY (document_id) REFERENCES voting_data(document_id)
);

CREATE TABLE IF NOT EXISTS test (
  count INTEGER,
  created_at DATE DEFAULT CURRENT_DATE
);
