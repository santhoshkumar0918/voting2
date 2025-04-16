import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileCheck, Vote, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-6">Decentralized Voting System</h1>
        <p className="text-xl text-gray-600 mb-8">
          A transparent and secure way to create and participate in voting
          proposals. Built on Polygon for speed, low cost, and reliability.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/proposals">
            <Button size="lg" className="w-full sm:w-auto">
              View Proposals <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/proposals/create">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Create Proposal
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
            <Vote className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Create Proposals</h3>
          <p className="text-gray-600">
            Create transparent voting proposals for your community to
            participate in. Set duration and description for informed decision
            making.
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
            <FileCheck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Vote Securely</h3>
          <p className="text-gray-600">
            Cast your votes securely on the blockchain. Each wallet can vote
            once per proposal to ensure fair participation.
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Transparent Results</h3>
          <p className="text-gray-600">
            Results are recorded on the blockchain and visible to everyone,
            ensuring complete transparency and trust.
          </p>
        </div>
      </div>
    </div>
  );
}
