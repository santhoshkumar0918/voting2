"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import ProposalCard from "@/components/porposal-card";

import { Proposal } from "@/types";

import { getVotingContractRead } from "@/lib/blockchain";

import { Loader2, Plus } from "lucide-react";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);

        const contract = getVotingContractRead();

        // Get the proposal count

        const count = await contract.proposalCount();

        const totalProposals = Number(count);

        const proposalPromises = [];

        // Fetch all proposals

        for (let i = 1; i <= totalProposals; i++) {
          proposalPromises.push(contract.getProposal(i));
        }

        const proposalResults = await Promise.all(proposalPromises);

        // Format the results

        const formattedProposals: Proposal[] = proposalResults.map(
          (result, index) => ({
            id: index + 1,

            title: result[0],

            description: result[1],

            yesVotes: Number(result[2]),

            noVotes: Number(result[3]),

            endTime: Number(result[4]),

            executed: result[5],
          })
        );

        setProposals(formattedProposals);
      } catch (err) {
        console.error("Error fetching proposals:", err);

        setError("Failed to load proposals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Proposals</h1>

        <Link href="/proposals/create">
          <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
            <Plus className="h-4 w-4 mr-2" /> Create Proposal
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <span className="ml-2">Loading proposals...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>

          <button
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-medium mb-2">No proposals yet</h3>

          <p className="text-gray-500 mb-6">
            Be the first to create a proposal for the community!
          </p>

          <Link href="/proposals/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
              Create a Proposal
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
}
