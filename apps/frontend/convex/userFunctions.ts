import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//done
export const createUser = mutation({
  args: { 
    name: v.string(),
    email: v.string(),
   },
  handler: async (ctx, args) => {
    if(args.email) {
        const existingUser = await ctx.db .query("users").filter((q) => q.eq(q.field("email"), args.email)).first();
        if (existingUser) {
          return existingUser._id; // Return existing user ID if found
        }
    }
    const newId = await ctx.db.insert("users", { name: args.name, email: args.email, TotalTokens: 100 });
    return newId;
  },
});

//done
export const getUserDetails = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userDetails = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
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
    const userDetails = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!userDetails) {
      throw new Error("User not found"); 
    }

    await ctx.db.patch(userDetails._id, {
      githubUsername: args.githubUsername,
      walletAddress: args.WalletAddress,
    });

    // FIX 2: Return something consistently so the frontend knows it succeeded
    return userDetails._id; 
  },
});