import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

/**
 * Get all journal entries for a specific date
 * Uses byUserAndDate index for efficient querying
 */
export const getEntriesByDate = query({
  args: { date: v.string() }, // ISO format YYYY-MM-DD
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("journalEntries")
      .withIndex("byUserAndDate", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .order("desc") // Newest first (by _creationTime)
      .collect();
  },
});

/**
 * Get all dates that have journal entries for a given month
 * Used to show indicators on the calendar
 */
export const getDatesWithEntries = query({
  args: { month: v.string() }, // Format: YYYY-MM
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Calculate the next month for range query
    const [year, month] = args.month.split("-").map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonthStr = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

    // Query all entries for the user in the given month
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), `${args.month}-01`),
          q.lt(q.field("date"), nextMonthStr)
        )
      )
      .collect();

    // Return unique dates that have entries
    const uniqueDates = new Set(entries.map((e) => e.date));
    return Array.from(uniqueDates);
  },
});

/**
 * Get all journal entries for the current user
 * Useful for future features like search or analytics
 */
export const getAllEntries = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

/**
 * Create a new journal entry
 * Validates date, mood, and content before inserting
 */
export const createEntry = mutation({
  args: {
    date: v.string(), // ISO format YYYY-MM-DD
    mood: v.string(), // One of the 8 mood categories
    content: v.string(), // Journal entry text
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Validation: Ensure date is not in the future
    // Allow entries for "today" in any timezone by checking if date is within reasonable range
    // This accounts for timezone differences (user could be up to UTC+14)
    const now = new Date();
    const utcToday = now.toISOString().split("T")[0];
    const utcTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    if (args.date > utcTomorrow) {
      throw new Error("Cannot create entries for future dates");
    }

    // Validation: Content length
    if (args.content.trim().length < 10) {
      throw new Error("Entry content must be at least 10 characters");
    }

    if (args.content.trim().length > 5000) {
      throw new Error("Entry content must not exceed 5000 characters");
    }

    // Validation: Valid mood
    const validMoods = [
      "Happy",
      "Sad",
      "Anxious",
      "Calm",
      "Energetic",
      "Tired",
      "Angry",
      "Peaceful",
    ];
    if (!validMoods.includes(args.mood)) {
      throw new Error("Invalid mood selection");
    }

    await ctx.db.insert("journalEntries", {
      userId: user._id,
      date: args.date,
      mood: args.mood,
      content: args.content.trim(),
    });
  },
});
