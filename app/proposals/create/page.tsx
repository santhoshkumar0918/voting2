"use client";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import ProposalForm from "@/components/proposal-form";

import ConnectWalletButton from "@/components/connect-wallet-button";

import { ArrowLeft } from "lucide-react";

import Link from "next/link";

import { useWallet } from "@/app/providers";

import { Toaster } from "react-hot-toast";

export default function CreateProposalPage() {
  const { account } = useWallet();

  return (
    <div className="container mx-auto px-4">
      {/* Toast notifications container */}

      <Toaster position="top-right" />

      <div className="mb-6">
        <Link href="/proposals">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Proposals
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Proposal</h1>

        <Card className="p-6">
          {account ? (
            <ProposalForm />
          ) : (
            <div className="text-center py-8">
              <h3 className="text-xl font-medium mb-4">Connect Your Wallet</h3>

              <p className="text-muted-foreground mb-6">
                You need to connect your wallet to create a proposal.
              </p>

              <ConnectWalletButton />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
