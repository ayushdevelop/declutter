import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
  messages: defineTable({
    body: v.string(),
    user: v.string(),
  }),
  journalEntries: defineTable({
    userId: v.id("users"),
    content: v.string(),
    mood: v.string(), // "Happy" | "Sad" | "Anxious" | "Calm" | "Energetic" | "Tired" | "Angry" | "Peaceful"
    date: v.string(), // ISO format YYYY-MM-DD
  })
    .index("byUserAndDate", ["userId", "date"])
    .index("byUserId", ["userId"]),
});
