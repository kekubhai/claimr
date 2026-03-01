"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import ConnectWalletButton from "./ConnectWalletButton";
import { useAccount } from "wagmi";

type Props = {
  email: string;
  initialGithub?: string;
  initialWallet?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function UpdateProfileModal({
  email,
  initialGithub,
  initialWallet,
  isOpen: controlledOpen,
  onClose,
}: Props) {
  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : isOpenLocal;

  const [github, setGithub] = useState(initialGithub || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read wallet address directly from wagmi — single source of truth
  const { address: wagmiAddress } = useAccount();
  const walletAddress = wagmiAddress || initialWallet || "";

  const updateUserInfo = useMutation(api.userFunctions.updateUserInfo);

  useEffect(() => {
    if (!isOpen) {
      setGithub(initialGithub || "");
    }
  }, [isOpen, initialGithub]);

  const open = () => { if (!isControlled) setIsOpenLocal(true); };
  const close = () => {
    if (isControlled) { onClose?.(); }
    else { setIsOpenLocal(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserInfo({
        email,
        githubUsername: github,
        WalletAddress: walletAddress,
      });
      close();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <>
        {!isControlled && (
          <button
            onClick={open}
            className="border border-[#1E1E2E] px-4 py-2 text-xs uppercase tracking-widest hover:border-white transition-colors"
          >
            [ Edit Profile ]
          </button>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md border border-[#1E1E2E] bg-black shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E1E2E] px-6 py-4">
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">
            Update <span className="text-[#22C55E]">Identity</span>
          </h2>
          <button onClick={close} className="text-white/50 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email — read only, for confirmation */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">Email</label>
            <div className="border border-[#1E1E2E] px-4 py-3 text-sm text-white/40">
              {email}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">GitHub Username</label>
            <div className="flex items-center border border-[#1E1E2E] bg-transparent focus-within:border-[#22C55E] transition-colors">
              <span className="pl-4 text-white/40">@</span>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-sm text-white focus:outline-none"
                placeholder="octocat"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">Wallet</label>
            <ConnectWalletButton
              className="w-full border border-[#22C55E] text-[#22C55E] px-4 py-3 text-xs uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors"
            />
            {/* Show the address that will actually be saved */}
            {walletAddress && (
              <p className="mt-2 text-xs text-white/40 font-mono">
                Will save: {walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}
              </p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={close}
              className="flex-1 border border-[#1E1E2E] px-4 py-3 text-xs uppercase tracking-wider text-white/60 hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-xs text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Save Identity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}