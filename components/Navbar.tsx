// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

// export default function Navbar() {
//   const pathname = usePathname();

//   const navItems = [
//     { name: "Home", href: "/" },
//     { name: "Proposals", href: "/proposals" },
//     { name: "Create Proposal", href: "/proposals/create" },
//   ];

//   return (
//     <header className="border-b bg-background">
//       <div className="container mx-auto flex h-16 items-center justify-between px-4">
//         <div className="flex gap-6 md:gap-10">
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="text-xl font-bold">VoteChain</span>
//           </Link>
//           <nav className="hidden md:flex gap-6">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   "text-sm font-medium transition-colors hover:text-primary",
//                   pathname === item.href
//                     ? "text-primary"
//                     : "text-muted-foreground"
//                 )}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </nav>
//         </div>
//         <div className="flex items-center gap-4">
//           <ConnectButton showBalance={false} />
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/app/providers";

export default function Navbar() {
  const pathname = usePathname();
  const { account, connectWallet, disconnectWallet, isConnecting } =
    useWallet();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Proposals", href: "/proposals" },
    { name: "Create Proposal", href: "/proposals/create" },
  ];

  // Format the account address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">VoteChain</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {account ? (
            <div className="flex items-center gap-2">
              <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {formatAddress(account)}
              </span>
              <Button variant="outline" size="sm" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
