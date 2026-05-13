import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bounty: defineTable({
    title: v.string(),
    description: v.string(),
    amount: v.number(), 
    unit: v.string(),
    endDate: v.any(), 
    escrowAmount: v.optional(v.number()),
    amountStatus: v.string(),
    bountyStatus: v.string(),
    bountySetter: v.id("users"),
    bountyHunter: v.optional(v.id("users")) 
  })
  .index("by_setter", ["bountySetter"])
  .index("by_hunter", ["bountyHunter"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    walletAddress : v.optional(v.string()),
    githubUsername : v.optional(v.string()),
    TotalTokens : v.optional(v.number()),
  }).index("by_email", ["email"]),

  solutions: defineTable({
    bountyId: v.id("bounty"),
    hunterId: v.id("users"),
    proof: v.any(), 
    status: v.string(), 
    score: v.number(),
    remarks: v.string(),
  })
  .index("by_bounty", ["bountyId"])
  .index("by_hunter", ["hunterId"])
  .index("by_bounty_hunter", ["bountyId", "hunterId"])
});