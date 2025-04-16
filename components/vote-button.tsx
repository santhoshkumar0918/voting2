"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useContractWrite, useTransaction } from "wagmi";
import { votingContract } from "@/constants/contract";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

interface VoteButtonProps {
  proposalId: number;
  vote: boolean; // true for yes, false for no
  hasVoted?: boolean;
  disabled?: boolean;
  onVoteSuccess?: () => void;
}

export default function VoteButton({
  proposalId,
  vote,
  hasVoted = false,
  disabled = false,
  onVoteSuccess,
}: VoteButtonProps) {
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const [isVoting, setIsVoting] = useState(false);

  const { data, write } = useContractWrite({
    address: votingContract.address as `0x${string}`,
    abi: votingContract.abi,
    functionName: "vote",
    args: [BigInt(proposalId), vote],
  });

  const { isLoading } = useTransaction({
    hash: data?.hash,
    onSettled: (data, error) => {
      setIsVoting(false);
      if (error) {
        toast({
          title: "Error",
          description: `Failed to submit vote: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Vote submitted!",
          description: `You have successfully voted ${
            vote ? "Yes" : "No"
          } on proposal #${proposalId}`,
          variant: "success",
        });
        if (onVoteSuccess) {
          onVoteSuccess();
        }
      }
    },
  });

  const handleVote = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }

    if (write) {
      setIsVoting(true);
      write();
    } else {
      toast({
        title: "Error",
        description: "Unable to submit vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleVote}
      disabled={disabled || hasVoted || isLoading || isVoting || !write}
      variant={vote ? "default" : "outline"}
      className={`${
        vote
          ? "bg-green-600 hover:bg-green-700"
          : "border-red-500 text-red-500 hover:bg-red-50"
      } w-full`}
    >
      {isLoading || isVoting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : vote ? (
        <ThumbsUp className="h-4 w-4 mr-2" />
      ) : (
        <ThumbsDown className="h-4 w-4 mr-2" />
      )}
      {hasVoted ? "Already Voted" : vote ? "Vote Yes" : "Vote No"}
    </Button>
  );
}
