
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function assertPositiveAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Bounty amount must be greater than zero.");
  }
}

function assertFutureEndDate(endDate: unknown) {
  if (typeof endDate !== "string" && typeof endDate !== "number") {
    return;
  }

  const timestamp = new Date(endDate).getTime();
  if (!Number.isFinite(timestamp)) {
    throw new Error("Invalid bounty end date.");
  }

  if (timestamp <= Date.now()) {
    throw new Error("Bounty end date must be in the future.");
  }
}

export const createBounty = mutation({
  args: { 
    title: v.string(),
    description: v.string(),
    amount: v.number(),
    unit: v.string(),
    endDate: v.any(),
    bountySetter: v.id("users"),
   },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    const description = args.description.trim();
    const unit = args.unit.trim();

    if (!title || !description || !unit) {
      throw new Error("Title, description, and unit are required.");
    }
    assertPositiveAmount(args.amount);
    assertFutureEndDate(args.endDate);

    // 1. Fetch the user setting the bounty
    const setter = await ctx.db.get(args.bountySetter);
    if (!setter) throw new Error("Setter not found");

    const currentTokens = setter.TotalTokens || 0;

    // 2. Check if they have enough tokens to fund it
    if (currentTokens < args.amount) {
      throw new Error("Insufficient tokens to fund this bounty.");
    }

    // 3. Deduct tokens from setter's balance
    await ctx.db.patch(setter._id, { 
      TotalTokens: currentTokens - args.amount 
    });

    // 4. Create the bounty with the funds locked in escrow
    const BountyId = await ctx.db.insert("bounty", { 
      ...args, 
      title,
      description,
      unit,
      escrowAmount: args.amount, // Lock the funds here
      bountyStatus: "active", 
      amountStatus: "escrowed"   // Mark as safely held
    });

    return BountyId;
  },
});


export const createSolution = mutation({
  args: {
    bountyId: v.id("bounty"),
    hunterId: v.id("users"),
    proof: v.any(),
    score: v.optional(v.number()),
    remarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (typeof args.proof !== "string" || !args.proof.trim()) {
      throw new Error("Submission proof is required.");
    }

    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    if (bounty.bountyStatus !== "active") {
      throw new Error("Bounty is not accepting submissions.");
    }
    assertFutureEndDate(bounty.endDate);

    const hunter = await ctx.db.get(args.hunterId);
    if (!hunter) throw new Error("Hunter not found");
    if (bounty.bountySetter === hunter._id) {
      throw new Error("Bounty setter cannot submit a solution.");
    }

    const existingSubmission = await ctx.db
      .query("solutions")
      .withIndex("by_bounty_hunter", (q) =>
        q.eq("bountyId", args.bountyId).eq("hunterId", args.hunterId)
      )
      .first();

    if (existingSubmission) {
      throw new Error("You have already submitted a solution for this bounty.");
    }

    const solutionId = await ctx.db.insert("solutions", {
      bountyId: args.bountyId,
      hunterId: args.hunterId,
      proof: args.proof.trim(),
      status: "submitted",
      score: 0,
      remarks: "Pending setter review",
    });
    return solutionId;
  },
});

export const getBountyDetailsAfterEnd = query({
  args: {
    bountyId: v.id("bounty"),
  },
  handler: async (ctx, args) => {
    const bountyDetails = await ctx.db
      .query("bounty")
      .filter((q) => q.eq(q.field("_id"), args.bountyId))
      .first();

    if (!bountyDetails) {
      return null;
    }

    const solutions = await ctx.db
      .query("solutions")
      .withIndex("by_bounty", (q) => q.eq("bountyId", args.bountyId))
      .collect(
      );

    const selectedSolution = solutions.find((solution) => solution.status === "selected");

    return {
      ...bountyDetails,
      solutions,
      selectedSolution,
    };
  },
});


export const getBountyDetails = query({
  args: {
    bountyId: v.id("bounty"),
  },
  handler: async (ctx, args) => {
    // Instant, optimized lookup by ID
    const bountyDetails = await ctx.db.get(args.bountyId);
    
    if (!bountyDetails) {
      return null;
    }
    return bountyDetails;   
  }
});

// convex/bountyFunctions.ts

export const getAllBounties = query({
  handler: async (ctx) => {
    // Fetches all bounties, newest first
    return await ctx.db.query("bounty").order("desc").collect();
  },
});



export const acceptSolution = mutation({
  args: {
    solutionId: v.id("solutions"),
    setterId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // 1. Get all the records we need
    const solution = await ctx.db.get(args.solutionId);
    if (!solution) throw new Error("Solution not found");

    const bounty = await ctx.db.get(solution.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    if (bounty.bountySetter !== args.setterId) {
      throw new Error("Only the bounty setter can accept a solution.");
    }
    
    // Prevent double-paying if clicked twice
    if (bounty.bountyStatus === "closed") {
      throw new Error("Bounty is already closed and paid out.");
    }
    if (solution.status !== "submitted") {
      throw new Error("Solution is not eligible for acceptance.");
    }

    const hunter = await ctx.db.get(solution.hunterId);
    if (!hunter) throw new Error("Hunter not found");

    const escrow = bounty.escrowAmount || 0;
    const currentHunterTokens = hunter.TotalTokens || 0;

    // 2. Transfer tokens to the Hunter
    await ctx.db.patch(hunter._id, {
      TotalTokens: currentHunterTokens + escrow
    });

    // 3. Close the Bounty and zero out the escrow
    await ctx.db.patch(bounty._id, {
      escrowAmount: 0,
      amountStatus: "released",
      bountyStatus: "closed",
      bountyHunter: hunter._id // Mark who won it
    });

    // 4. Mark the specific solution as selected
    await ctx.db.patch(solution._id, {
      status: "selected"
    });

    return bounty._id;
  },
});

// ── 3. NEW: GET RANKINGS (Leaderboard) ──
export const getRankings = query({
  handler: async (ctx) => {
    // Fetch all users
    const allUsers = await ctx.db.query("users").collect();

    // Sort them in memory by TotalTokens (highest to lowest)
    const sortedUsers = allUsers.sort((a, b) => {
      const tokensA = a.TotalTokens || 0;
      const tokensB = b.TotalTokens || 0;
      return tokensB - tokensA; // Descending order
    });

    // Return the top 50 hackers
    return sortedUsers.slice(0, 50);
  }
});