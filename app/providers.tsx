// // "use client";

// // import { createConfig, http, WagmiProvider } from "wagmi";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { polygonAmoy } from "wagmi/chains";
// // import { ConnectKitProvider, getDefaultConfig } from "connectkit";
// // import { useState, useEffect } from "react";
// // import { Toaster } from "react-hot-toast";

// // const wagmiConfig = createConfig(
// //   getDefaultConfig({
// //     appName: "Decentralized Voting System",
// //     walletConnectProjectId: process.env
// //       .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
// //     chains: [polygonAmoy],
// //     transports: {
// //       [polygonAmoy.id]: http(
// //         process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL as string
// //       ),
// //     },
// //   })
// // );

// // const queryClient = new QueryClient();

// // export function Providers({ children }: { children: React.ReactNode }) {
// //   const [mounted, setMounted] = useState(false);

// //   // Ensure we only render the UI on the client
// //   useEffect(() => {
// //     setMounted(true);
// //   }, []);

// //   return (
// //     <WagmiProvider config={wagmiConfig}>
// //       <QueryClientProvider client={queryClient}>
// //         <ConnectKitProvider>
// //           {mounted && children}
// //           <Toaster />
// //         </ConnectKitProvider>
// //       </QueryClientProvider>
// //     </WagmiProvider>
// //   );
// // }

// "use client";

// import {
//   useState,
//   useEffect,
//   createContext,
//   useContext,
//   ReactNode,
// } from "react";
// import { ethers } from "ethers";

// // Extend the Window interface to include the ethereum property
// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// interface WalletContextType {
//   account: string | null;
//   connectWallet: () => Promise<void>;
//   disconnectWallet: () => void;
//   isConnecting: boolean;
//   isConnected: boolean;
//   provider: ethers.BrowserProvider | null;
// }

// const WalletContext = createContext<WalletContextType>({
//   account: null,
//   connectWallet: async () => {},
//   disconnectWallet: () => {},
//   isConnecting: false,
//   isConnected: false,
//   provider: null,
// });

// export function Providers({ children }: { children: ReactNode }) {
//   const [account, setAccount] = useState<string | null>(null);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

//   // Check if wallet was previously connected
//   useEffect(() => {
//     const checkConnection = async () => {
//       if (
//         window.ethereum &&
//         localStorage.getItem("walletConnected") === "true"
//       ) {
//         await connectWallet();
//       }
//     };

//     // Only run in browser environment
//     if (typeof window !== "undefined") {
//       checkConnection();
//     }
//   }, []);

//   // Handle account changes
//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", (accounts: string[]) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0]);
//         } else {
//           disconnectWallet();
//         }
//       });

//       window.ethereum.on("chainChanged", () => {
//         window.location.reload();
//       });

//       return () => {
//         window.ethereum.removeAllListeners();
//       };
//     }
//   }, []);

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask or another Ethereum wallet!");
//       return;
//     }

//     try {
//       setIsConnecting(true);
//       const browserProvider = new ethers.BrowserProvider(window.ethereum);
//       const accounts = await browserProvider.send("eth_requestAccounts", []);

//       if (accounts.length > 0) {
//         setAccount(accounts[0]);
//         setProvider(browserProvider);
//         localStorage.setItem("walletConnected", "true");
//       }
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   const disconnectWallet = () => {
//     setAccount(null);
//     setProvider(null);
//     localStorage.removeItem("walletConnected");
//   };

//   return (
//     <WalletContext.Provider
//       value={{
//         account,
//         connectWallet,
//         disconnectWallet,
//         isConnecting,
//         isConnected: !!account,
//         provider,
//       }}
//     >
//       {children}
//     </WalletContext.Provider>
//   );
// }

// // Hook for components to use the wallet context
// export const useWallet = () => useContext(WalletContext);
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { Toaster } from "react-hot-toast";

// Define wallet context type
interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
}

// Create context
const WalletContext = createContext<WalletContextType>({
  account: null,
  provider: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
});

// Hook to use wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component
export function Providers({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Function to connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app");
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setProvider(provider);

      // Save to localStorage
      localStorage.setItem("walletConnected", "true");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    localStorage.removeItem("walletConnected");
  };

  // Effect to check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem("walletConnected") === "true";

      if (wasConnected && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setProvider(provider);
          }
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
        }
      }

      setMounted(true);
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // Account changed
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  }, [account]);

  // Only render children when mounted (to avoid hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        connectWallet,
        disconnectWallet,
        isConnecting,
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </WalletContext.Provider>
  );
}
