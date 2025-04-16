// // "use client";

// // import { useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { Button } from "@/components/ui/button";
// // import { toast, Toaster } from "react-hot-toast";
// // import {
// //   useAccount,
// //   useWriteContract,
// //   useWatchContractEvent,
// //   useSimulateContract,
// // } from "wagmi";
// // import { votingContract } from "@/constants/contract";
// // import { Loader2 } from "lucide-react";

// // export default function ProposalForm() {
// //   const router = useRouter();
// //   const { isConnected } = useAccount();

// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     duration: "60", // Default duration in minutes (1 hour)
// //   });

// //   const handleChange = (
// //     e: React.ChangeEvent<
// //       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
// //     >
// //   ) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // Simulate contract without the query property
// //   const { data: simulateData } =
// //     formData.title.length > 0 &&
// //     formData.description.length > 0 &&
// //     parseInt(formData.duration) > 0
// //       ? useSimulateContract({
// //           address: votingContract.address as `0x${string}`,
// //           abi: votingContract.abi,
// //           functionName: "createProposal",
// //           args: [
// //             formData.title,
// //             formData.description,
// //             BigInt(formData.duration),
// //           ],
// //         })
// //       : { data: null };

// //   // Write contract
// //   const { writeContract, data: writeData, isPending } = useWriteContract();

// //   // Watch for contract events
// //   useWatchContractEvent({
// //     address: votingContract.address as `0x${string}`,
// //     abi: votingContract.abi,
// //     eventName: "ProposalCreated",
// //     onLogs: () => {
// //       setIsSubmitting(false);
// //       toast.success("Proposal created successfully!");
// //       router.push("/proposals");
// //     },
// //     enabled: !!writeData,
// //   });

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!isConnected) {
// //       toast.error("Please connect your wallet to create a proposal");
// //       return;
// //     }

// //     if (!formData.title.trim()) {
// //       toast.error("Please provide a title for your proposal");
// //       return;
// //     }

// //     if (!formData.description.trim()) {
// //       toast.error("Please provide a description for your proposal");
// //       return;
// //     }

// //     if (simulateData) {
// //       setIsSubmitting(true);
// //       writeContract({
// //         address: votingContract.address as `0x${string}`,
// //         abi: votingContract.abi,
// //         functionName: "createProposal",
// //         args: [formData.title, formData.description, BigInt(formData.duration)],
// //       });
// //     } else {
// //       toast.error("Unable to create proposal. Please try again.");
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-6">
// //       <div className="space-y-2">
// //         <label htmlFor="title" className="text-sm font-medium">
// //           Title
// //         </label>
// //         <input
// //           id="title"
// //           name="title"
// //           value={formData.title}
// //           onChange={handleChange}
// //           required
// //           className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
// //           placeholder="Enter proposal title"
// //         />
// //       </div>

// //       <div className="space-y-2">
// //         <label htmlFor="description" className="text-sm font-medium">
// //           Description
// //         </label>
// //         <textarea
// //           id="description"
// //           name="description"
// //           value={formData.description}
// //           onChange={handleChange}
// //           required
// //           rows={5}
// //           className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
// //           placeholder="Describe your proposal in detail"
// //         />
// //       </div>

// //       <div className="space-y-2">
// //         <label htmlFor="duration" className="text-sm font-medium">
// //           Voting Duration
// //         </label>
// //         <select
// //           id="duration"
// //           name="duration"
// //           value={formData.duration}
// //           onChange={handleChange}
// //           className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
// //         >
// //           <option value="60">1 hour</option>
// //           <option value="1440">1 day</option>
// //           <option value="4320">3 days</option>
// //           <option value="10080">7 days</option>
// //         </select>
// //       </div>

// //       <Button
// //         type="submit"
// //         disabled={isSubmitting || isPending || !simulateData}
// //         className="w-full"
// //       >
// //         {isSubmitting || isPending ? (
// //           <>
// //             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
// //           </>
// //         ) : (
// //           "Create Proposal"
// //         )}
// //       </Button>
// //     </form>
// //   );
// // }
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import { votingContract } from "@/constants/contract";
// import { useWallet } from "@/app/providers";
// import { ethers } from "ethers";

// export default function ProposalForm() {
//   const router = useRouter();
//   const { account, provider } = useWallet();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     duration: "60", // Default duration in minutes (1 hour)
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!account) {
//       toast.error("Please connect your wallet to create a proposal");
//       return;
//     }

//     if (!formData.title.trim()) {
//       toast.error("Please provide a title for your proposal");
//       return;
//     }

//     if (!formData.description.trim()) {
//       toast.error("Please provide a description for your proposal");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       // Get signer from provider
//       const signer = await provider?.getSigner();

//       if (!signer) {
//         toast.error("Unable to get signer from wallet");
//         setIsSubmitting(false);
//         return;
//       }

//       // Create contract instance
//       const contract = new ethers.Contract(
//         votingContract.address,
//         votingContract.abi,
//         signer
//       );

//       // Create transaction
//       const tx = await contract.createProposal(
//         formData.title,
//         formData.description,
//         BigInt(formData.duration)
//       );

//       // Wait for transaction to be mined
//       await tx.wait();

//       toast.success("Proposal created successfully!");
//       router.push("/proposals");
//     } catch (error: any) {
//       console.error("Error creating proposal:", error);
//       toast.error(
//         error.message || "Unable to create proposal. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <label htmlFor="title" className="text-sm font-medium">
//           Title
//         </label>
//         <input
//           id="title"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//           placeholder="Enter proposal title"
//         />
//       </div>

//       <div className="space-y-2">
//         <label htmlFor="description" className="text-sm font-medium">
//           Description
//         </label>
//         <textarea
//           id="description"
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//           rows={5}
//           className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//           placeholder="Describe your proposal in detail"
//         />
//       </div>

//       <div className="space-y-2">
//         <label htmlFor="duration" className="text-sm font-medium">
//           Voting Duration
//         </label>
//         <select
//           id="duration"
//           name="duration"
//           value={formData.duration}
//           onChange={handleChange}
//           className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
//         >
//           <option value="60">1 hour</option>
//           <option value="1440">1 day</option>
//           <option value="4320">3 days</option>
//           <option value="10080">7 days</option>
//         </select>
//       </div>

//       <Button type="submit" disabled={isSubmitting} className="w-full">
//         {isSubmitting ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
//           </>
//         ) : (
//           "Create Proposal"
//         )}
//       </Button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { votingContract } from "@/constants/contract";
import { useWallet } from "@/app/providers";
import { ethers } from "ethers";

export default function ProposalForm() {
  const router = useRouter();
  const { account, provider } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "60", // Default duration in minutes (1 hour)
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet to create a proposal");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please provide a title for your proposal");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please provide a description for your proposal");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create loading toast
      const loadingToast = toast.loading("Creating your proposal...");

      // Get signer from provider
      const signer = await provider?.getSigner();

      if (!signer) {
        toast.error("Unable to get signer from wallet");
        toast.dismiss(loadingToast);
        setIsSubmitting(false);
        return;
      }

      // Create contract instance
      const contract = new ethers.Contract(
        votingContract.address,
        votingContract.abi,
        signer
      );

      // Log the arguments for debugging
      console.log("Proposal arguments:", {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
      });

      try {
        // First try to estimate gas to check if the call will succeed
        const gasEstimate = await contract.createProposal.estimateGas(
          formData.title,
          formData.description,
          BigInt(formData.duration)
        );

        console.log("Gas estimate successful:", gasEstimate.toString());

        // If gas estimation succeeds, proceed with the transaction
        const tx = await contract.createProposal(
          formData.title,
          formData.description,
          BigInt(formData.duration),
          {
            gasLimit: Math.ceil(Number(gasEstimate) * 1.2), // Add 20% buffer
          }
        );

        // Wait for transaction to be mined
        await tx.wait();

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Proposal created successfully!");

        // Navigate to proposals page
        router.push("/proposals");
      } catch (error) {
        console.error("Gas estimation failed:", error);

        // If gas estimation fails, try with manual gas limit
        const tx = await contract.createProposal(
          formData.title,
          formData.description,
          BigInt(formData.duration),
          {
            gasLimit: 300000, // Set a reasonable manual gas limit
          }
        );

        // Wait for transaction to be mined
        await tx.wait();

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Proposal created successfully!");

        // Navigate to proposals page
        router.push("/proposals");
      }
    } catch (error: any) {
      console.error("Error creating proposal:", error);

      // More user-friendly error message
      let errorMessage = "Unable to create proposal. Please try again.";

      if (error.message) {
        // Check for common errors
        if (error.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected in your wallet.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas * price + value.";
        } else if (error.message.includes("nonce")) {
          errorMessage = "Transaction nonce error. Please reset your wallet.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter proposal title"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your proposal in detail"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="duration" className="text-sm font-medium">
          Voting Duration
        </label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="60">1 hour</option>
          <option value="1440">1 day</option>
          <option value="4320">3 days</option>
          <option value="10080">7 days</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
          </span>
        ) : (
          "Create Proposal"
        )}
      </button>
    </form>
  );
}
