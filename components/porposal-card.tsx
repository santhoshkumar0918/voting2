"use client";

import { Proposal } from "@/types";

import Link from "next/link";

import { formatTimeRemaining } from "@/lib/utils1";
import { getVotingStatus, isProposalActive } from "@/lib/blockchain";

interface ProposalCardProps {
  proposal: Proposal;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const status = getVotingStatus(
    proposal.yesVotes,

    proposal.noVotes,

    proposal.endTime,

    proposal.executed
  );

  const totalVotes = proposal.yesVotes + proposal.noVotes;

  const yesPercentage =
    totalVotes > 0 ? Math.round((proposal.yesVotes / totalVotes) * 100) : 0;

  const noPercentage =
    totalVotes > 0 ? Math.round((proposal.noVotes / totalVotes) * 100) : 0;

  const timeRemaining = formatTimeRemaining(proposal.endTime);

  const isActive = isProposalActive(proposal.endTime);

  return (
    <div className="bg-white hover:shadow-md transition-shadow border rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold mb-1">{proposal.title}</h3>

            <div className="text-sm text-gray-500">
              Proposal #{proposal.id} • {status}
            </div>
          </div>

          <div className="px-2 py-1 text-xs rounded-full bg-gray-100">
            {timeRemaining}
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {proposal.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              Yes: {proposal.yesVotes} ({yesPercentage}%)
            </span>

            <span>
              No: {proposal.noVotes} ({noPercentage}%)
            </span>
          </div>

          {/* Progress bars */}

          <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-green-500"
              style={{ width: `${yesPercentage}%` }}
            />

            <div className="bg-red-500" style={{ width: `${noPercentage}%` }} />
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t">
        <Link href={`/proposals/${proposal.id}`}>
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            {isActive ? "Vote Now" : "View Details"}
          </button>
        </Link>
      </div>
    </div>
  );
}
