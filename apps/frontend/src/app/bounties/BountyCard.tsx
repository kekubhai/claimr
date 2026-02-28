import React from "react";

type Bounty = {
  title: string;
  description: string;
  amount: number;
  unit: string;
  endDate: Date | string;
  bountySetter: string;
};

interface Props {
  bounty: Bounty;
}

export default function BountyCard({ bounty }: Props) {
  const end = bounty.endDate instanceof Date ? bounty.endDate : new Date(bounty.endDate);

  return (
    <div className="border border-[#1E1E2E] bg-[#0f0f14] p-6 rounded-none hover:shadow-[0_0_24px_rgba(34,197,94,0.06)] transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{bounty.title}</h3>
        <div className="text-right">
          <div className="font-mono text-sm text-[#22C55E]">{bounty.amount} {bounty.unit}</div>
          <div className="text-xs text-white/60">by {bounty.bountySetter}</div>
        </div>
      </div>

      <p className="text-sm text-white/70 mb-4">{bounty.description}</p>

      <div className="flex items-center justify-between text-xs text-white/60">
        <div>Ends: {end.toDateString()}</div>
        <button className="border border-[#22C55E] px-3 py-1 text-[#22C55E] text-xs uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors">
          [ claim_task ]
        </button>
      </div>
    </div>
  );
}

/*
  Convex usage examples (commented out as requested):

  // import { api } from "../../../convex/_generated/api";
  // import { useMutation } from "convex/react";
  //
  // // Query example (get bounty details):
  // const { data: details } = api.getBountyDetails.useQuery({ id: "avl-1" });
  //
  // // Mutation example (create a bounty):
  // const createBounty = useMutation(api.createBounty);
  //
  // // Example data shape you may pass to createBounty (matching your request):
  // const formData = { title: 'Title', description: 'Desc', amount: '100', unit: 'USDC', endDate: '2026-03-01' };
  // const payload = {
  //   title: formData.title,
  //   description: formData.description,
  //   amount: parseFloat(formData.amount),
  //   unit: formData.unit,
  //   endDate: new Date(formData.endDate),
  //   bountySetter: 'userId'
  // };
  // // createBounty(payload);
*/
