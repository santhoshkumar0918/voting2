"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chainId: number | null;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  provider: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  chainId: null,
  isConnecting: false,
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

// Polygon Amoy chain ID
const POLYGON_AMOY_CHAIN_ID = 80002;

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize provider on mount
  useEffect(() => {
    const initProvider = async () => {
      // Check if ethereum is available (MetaMask or other wallet)
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethProvider);

          // Get the current chain ID
          const network = await ethProvider.getNetwork();
          setChainId(Number(network.chainId));

          // Check if already connected
          const accounts = await ethProvider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
          }

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
            } else {
              setAccount(null);
            }
          });

          // Listen for chain changes
          window.ethereum.on("chainChanged", (chainId: string) => {
            setChainId(parseInt(chainId, 16));
          });
        } catch (error) {
          console.error("Error initializing provider:", error);
        }
      }
    };

    initProvider();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () =>
          setAccount(null)
        );
        window.ethereum.removeListener("chainChanged", () => setChainId(null));
      }
    };
  }, []);

  // Function to add Polygon Amoy to MetaMask
  const addPolygonAmoy = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected");
      return false;
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}`,
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
      return true;
    } catch (error) {
      console.error("Failed to add Polygon Amoy:", error);
      return false;
    }
  };

  // Function to switch to Polygon Amoy
  const switchToPolygonAmoy = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected");
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

  const connectWallet = async () => {
    if (!provider) {
      toast.error("No provider available");
      return;
    }

    setIsConnecting(true);

    try {
      // Try to add Polygon Amoy network first
      await addPolygonAmoy();

      // Request account access
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        toast.error("MetaMask not detected");
        return;
      }
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        setAccount(accounts[0].address);

        // Check if we're on Polygon Amoy, if not, try to switch
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== POLYGON_AMOY_CHAIN_ID) {
          await switchToPolygonAmoy();
        }

        toast.success("Wallet connected successfully!");
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        // User rejected the request
        toast.error("Connection rejected by user");
      } else {
        toast.error("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast.success("Wallet disconnected");
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        connectWallet,
        disconnectWallet,
        chainId,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
