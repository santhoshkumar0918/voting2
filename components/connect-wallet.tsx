"use client";

import { formatAddress } from "@/lib/blockchain";

import { useWallet } from "@/app/providers";

export default function ConnectWallet() {
  const { account, connectWallet, disconnectWallet, isConnecting } =
    useWallet();

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block text-sm font-medium">
          {formatAddress(account)}
        </div>

        <button
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={disconnectWallet}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
        onClick={connectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  );
}
