type VotingDocumentSummary = {
  document_id: string;
  title: string;
  authors: string;
  votingData: VotingData;
  metadata: Metadata;
};

type VotingData = {
  yes: number;
  no: number;
  abstentions: number;
  non_voting: number;
  total_voting_membership: number;
};

type Metadata = {
  resolution: string;
  vote_date: string;
  resourceType: string;
};

export type VotingResults = {
  yes_countries: string[];
  no_countries: string[];
  abstention_countries: string[];
  non_voting_countries: string[];
  total_voting_membership: number;
};

export type DetailedVotingDocument = VotingDocumentSummary & VotingResults;
