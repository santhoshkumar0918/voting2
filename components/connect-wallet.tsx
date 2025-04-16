// "use client";

// import { formatAddress } from "@/lib/blockchain";

// import { useWallet } from "@/app/providers";

// export default function ConnectWallet() {
//   const { account, connectWallet, disconnectWallet, isConnecting } =
//     useWallet();

//   if (account) {
//     return (
//       <div className="flex items-center gap-2">
//         <div className="hidden md:block text-sm font-medium">
//           {formatAddress(account)}
//         </div>

//         <button
//           className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
//           onClick={disconnectWallet}
//         >
//           Disconnect
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       <button
//         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
//         onClick={connectWallet}
//         disabled={isConnecting}
//       >
//         {isConnecting ? "Connecting..." : "Connect Wallet"}
//       </button>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/app/providers";
import { formatAddress } from "@/lib/blockchain";
import {
  Wallet,
  ExternalLink,
  Copy,
  Power,
  User,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { ethers } from "ethers";

// Define Polygon Amoy constants
const POLYGON_AMOY_CHAIN_ID = 80002;

const CHAIN_NAMES: { [key: number]: string } = {
  80002: "Polygon Amoy",
  1: "Ethereum Mainnet",
  137: "Polygon Mainnet",
  11155111: "Sepolia Testnet",
};

// Function to add Polygon Amoy to MetaMask
const addPolygonAmoy = async () => {
  if (!window.ethereum) {
    console.error("MetaMask not detected");
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}`, // Convert to hex
          chainName: "Polygon Amoy Testnet",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://rpc-amoy.polygon.technology/"],
          blockExplorerUrls: ["https://amoy.polygonscan.com/"],
        },
      ],
    });
    console.log("Polygon Amoy added to MetaMask!");
    return true;
  } catch (error) {
    console.error("Failed to add Polygon Amoy:", error);
    return false;
  }
};

// Function to switch to Polygon Amoy
const switchToPolygonAmoy = async () => {
  if (!window.ethereum) {
    console.error("MetaMask not detected");
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      return addPolygonAmoy();
    }
    console.error("Failed to switch to Polygon Amoy:", error);
    return false;
  }
};

export default function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  const { account, connectWallet, disconnectWallet, isConnecting, provider } =
    useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Get chain ID and check if it's correct
    const checkNetwork = async () => {
      if (provider && window.ethereum) {
        try {
          const network = await provider.getNetwork();
          const currentChainId = Number(network.chainId);
          setChainId(currentChainId);
          setIsCorrectNetwork(currentChainId === POLYGON_AMOY_CHAIN_ID);

          // Get balance if we have an account
          if (account) {
            const balanceResult = await provider.getBalance(account);
            // Format the balance to 4 decimal places
            setBalance(Number(ethers.formatEther(balanceResult)).toFixed(4));
          }
        } catch (error) {
          console.error("Error checking network:", error);
        }
      }
    };

    checkNetwork();

    // Add event listener for chain changes
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        setIsCorrectNetwork(parseInt(chainId, 16) === POLYGON_AMOY_CHAIN_ID);
      });
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [account, provider]);

  const handleConnect = async () => {
    try {
      // First, try to add the network
      await addPolygonAmoy();

      // Then connect
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToPolygonAmoy();
      setIsCorrectNetwork(true);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      // You could add a toast notification here
    }
  };

  const openExplorer = () => {
    if (account) {
      window.open(`https://amoy.polygonscan.com/address/${account}`, "_blank");
    }
  };

  if (!mounted) {
    return null;
  }

  if (!account) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
      >
        <Wallet className="w-5 h-5" />
        <span className="font-semibold">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all relative"
      >
        <User className="w-5 h-5 text-gray-600" />
        {!isCorrectNetwork ? (
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-yellow-500 border-2 border-white" />
        ) : (
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50">
          <div className="p-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Connected with MetaMask
              </span>
              <button
                onClick={() => {
                  disconnectWallet();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"
              >
                <Power className="w-4 h-4" />
                Disconnect
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{formatAddress(account)}</p>
                  <p className="text-sm text-gray-500">
                    {balance ? `${balance} MATIC` : "Loading..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyAddress}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg flex-1"
              >
                <Copy className="w-4 h-4" />
                Copy Address
              </button>
              <button
                onClick={openExplorer}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg flex-1"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </button>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Network</span>
                {isCorrectNetwork ? (
                  <span className="font-medium">
                    {chainId && CHAIN_NAMES[chainId]
                      ? CHAIN_NAMES[chainId]
                      : `Chain ${chainId}`}
                  </span>
                ) : (
                  <button
                    onClick={handleSwitchNetwork}
                    className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Switch to Polygon Amoy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
