"use client";

import { ethers } from "ethers";

import { votingContract } from "@/constants/contract";

// For read operations with no wallet connection

export const getProvider = () => {
  return new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL
  );
};

// For read operations with contract

export const getVotingContractRead = () => {
  const provider = getProvider();

  return new ethers.Contract(
    votingContract.address,

    votingContract.abi,

    provider
  );
};

// Format timestamp to readable date

export const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Format address to display format (0x123...abc)

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Check if a proposal is active

export const isProposalActive = (endTime: number) => {
  return Date.now() < endTime * 1000;
};

// Get voting status as a string

export const getVotingStatus = (
  yesVotes: number,

  noVotes: number,

  endTime: number,

  executed: boolean
) => {
  if (executed) {
    return yesVotes > noVotes ? "Passed" : "Rejected";
  }

  if (isProposalActive(endTime)) {
    return "Active";
  }

  return "Pending Execution";
};
