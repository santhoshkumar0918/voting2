// Types for the voting system

export interface Proposal {
  id: number;

  title: string;

  description: string;

  yesVotes: number;

  noVotes: number;

  endTime: number;

  executed: boolean;
}

export interface VoteData {
  proposalId: number;

  vote: boolean;
}

export interface CreateProposalData {
  title: string;

  description: string;

  durationInMinutes: number;
}
