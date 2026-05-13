import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const createUser = mutation({
  args: { 
    name: v.string(),
    email: v.string(),
   },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    if (!email) {
      throw new Error("Email is required");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const newId = await ctx.db.insert("users", {
      name: args.name.trim() || "Unnamed Operative",
      email,
      TotalTokens: 100,
    });
    return newId;
  },
});

export const getUserDetails = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const userDetails = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!userDetails) {
      return null;
    }

    const bountiesGiven = await ctx.db
      .query("bounty")
      .withIndex("by_setter", (q) => q.eq("bountySetter", userDetails._id))
      .collect();

    
    const bountiesSolved = await ctx.db
      .query("bounty")
      .withIndex("by_hunter", (q) => q.eq("bountyHunter", userDetails._id))
      .collect();

    return {
      ...userDetails,
      bountiesGiven,
      bountiesSolved,
    };
  },
});

export const updateUserInfo = mutation({
  args: { 
    email: v.string(),
    githubUsername: v.string(),
    WalletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const userDetails = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!userDetails) {
      throw new Error("User not found"); 
    }

    await ctx.db.patch(userDetails._id, {
      githubUsername: args.githubUsername.trim(),
      walletAddress: args.WalletAddress.trim(),
    });

    return userDetails._id; 
  },
});