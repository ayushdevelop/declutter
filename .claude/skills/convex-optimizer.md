# Convex Query Optimizer

Analyzes Convex backend code for performance bottlenecks, best practices, security issues, and optimization opportunities.

## What This Skill Does

Comprehensive Convex backend audit covering:

1. **Query Performance** - Index usage, N+1 queries, pagination
2. **Security** - Authentication checks, authorization patterns
3. **Schema Design** - Index strategy, data modeling
4. **Best Practices** - Convex patterns and anti-patterns
5. **Scalability** - Identifying future bottlenecks

## When to Use

- After implementing new Convex queries/mutations
- When experiencing slow query performance
- Before deploying to production
- During code reviews
- When adding new tables or indexes

## Usage

```bash
/convex-optimizer <file-or-directory>
```

**Examples:**
```bash
/convex-optimizer convex/journal.ts
/convex-optimizer convex/
/convex-optimizer convex/schema.ts
```

---

## What Gets Checked

### 1. Index Usage (Critical for Performance)

**Issue:** Using `.filter()` when an index exists.

```typescript
// ❌ SLOW: Full table scan with filter
export const getEntriesByDate = query({
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("journalEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("date"), args.date)
        )
      )
      .collect();
  },
});

// ✅ FAST: Uses compound index
export const getEntriesByDate = query({
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("journalEntries")
      .withIndex("byUserAndDate", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .collect();
  },
});
```

**Performance Impact:**
- ❌ Filter: O(n) - scans entire table
- ✅ Index: O(log n) - uses B-tree lookup

---

### 2. Compound Index Design

**Checks:**
- ✅ Most selective field first
- ✅ Query access patterns match index order
- ✅ No redundant indexes

```typescript
// ❌ Poor index design
defineTable({
  userId: v.id("users"),
  date: v.string(),
  mood: v.string(),
})
  .index("byDate", ["date"]) // Low selectivity first
  .index("byUser", ["userId"]) // Redundant with compound index

// ✅ Optimal compound index
defineTable({
  userId: v.id("users"),
  date: v.string(),
  mood: v.string(),
})
  .index("byUserAndDate", ["userId", "date"]) // High selectivity first
  .index("byUserId", ["userId"]) // For user-only queries
```

**Why:**
- `userId` is highly selective (millions of users)
- `date` is less selective (365 days/year)
- Compound index can serve both specific queries and range queries

---

### 3. Query Patterns and Range Queries

**Checks:**
- ✅ Using range queries efficiently
- ✅ Proper bounds for date ranges
- ✅ Month boundaries handled correctly

```typescript
// ✅ Efficient month range query
export const getDatesWithEntries = query({
  args: { month: v.string() }, // "YYYY-MM"
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Calculate next month for range
    const [year, month] = args.month.split("-").map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonthStr = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

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

    return Array.from(new Set(entries.map((e) => e.date)));
  },
});
```

**Note:** Index + filter is acceptable when filter reduces results significantly. Pure index would require a composite index for every possible month.

---

### 4. Authentication and Authorization

**Checks:**
- ✅ All queries/mutations use `getCurrentUserOrThrow` or `getCurrentUser`
- ✅ User-scoped data filtered by userId
- ✅ Internal mutations prevent direct client access
- ✅ Webhook handlers validate signatures

```typescript
// ❌ No authentication check
export const getAllEntries = query({
  handler: async (ctx) => {
    return await ctx.db.query("journalEntries").collect();
    // Returns ALL users' entries! 🚨
  },
});

// ✅ Proper authentication and user scoping
export const getAllEntries = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();
    // Only returns current user's entries ✅
  },
});
```

---

### 5. Mutation Validation

**Checks:**
- ✅ Server-side validation (don't trust client)
- ✅ Input sanitization (trim strings)
- ✅ Business logic validation
- ✅ Error messages are helpful

```typescript
// ❌ Trusting client validation only
export const createEntry = mutation({
  args: {
    date: v.string(),
    mood: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await ctx.db.insert("journalEntries", {
      userId: user._id,
      ...args, // Directly inserting without validation 🚨
    });
  },
});

// ✅ Comprehensive server-side validation
export const createEntry = mutation({
  args: {
    date: v.string(),
    mood: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Validate date
    const now = new Date();
    const utcTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    if (args.date > utcTomorrow) {
      throw new Error("Cannot create entries for future dates");
    }

    // Validate content length
    const trimmedContent = args.content.trim();
    if (trimmedContent.length < 10) {
      throw new Error("Entry content must be at least 10 characters");
    }
    if (trimmedContent.length > 5000) {
      throw new Error("Entry content must not exceed 5000 characters");
    }

    // Validate mood
    const validMoods = [
      "Happy", "Sad", "Anxious", "Calm",
      "Energetic", "Tired", "Angry", "Peaceful"
    ];
    if (!validMoods.includes(args.mood)) {
      throw new Error("Invalid mood selection");
    }

    await ctx.db.insert("journalEntries", {
      userId: user._id,
      date: args.date,
      mood: args.mood,
      content: trimmedContent, // Use sanitized version
    });
  },
});
```

---

### 6. N+1 Query Detection

**Issue:** Making multiple queries in a loop.

```typescript
// ❌ N+1 query problem
export const getEntriesWithUserNames = query({
  handler: async (ctx) => {
    const entries = await ctx.db.query("journalEntries").collect();

    // For each entry, fetch user (N+1 queries!)
    const entriesWithNames = await Promise.all(
      entries.map(async (entry) => {
        const user = await ctx.db.get(entry.userId); // N queries
        return { ...entry, userName: user?.name };
      })
    );

    return entriesWithNames;
  },
});

// ✅ Optimized: Batch fetch users
export const getEntriesWithUserNames = query({
  handler: async (ctx) => {
    const entries = await ctx.db.query("journalEntries").collect();

    // Get unique user IDs
    const userIds = [...new Set(entries.map((e) => e.userId))];

    // Batch fetch all users (1 query)
    const users = await Promise.all(
      userIds.map((id) => ctx.db.get(id))
    );

    const userMap = new Map(users.map((u) => [u?._id, u]));

    return entries.map((entry) => ({
      ...entry,
      userName: userMap.get(entry.userId)?.name,
    }));
  },
});
```

---

### 7. Pagination for Large Datasets

**Checks:**
- ✅ Using pagination for queries that could return 100+ results
- ✅ Cursor-based pagination implemented
- ✅ Limits enforced

```typescript
// ❌ No pagination (could return thousands)
export const getAllEntries = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect(); // Could return 10,000+ entries!
  },
});

// ✅ Paginated query
export const getAllEntries = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const limit = args.limit ?? 50;

    const results = await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: limit });

    return {
      entries: results.page,
      nextCursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});
```

---

### 8. Schema Design Best Practices

**Checks:**
- ✅ Appropriate field types (v.id() for references)
- ✅ String lengths reasonable (no v.string() for unbounded text)
- ✅ Indexes on frequently queried fields
- ✅ No redundant data (normalize appropriately)

```typescript
// ❌ Poor schema design
defineTable({
  userName: v.string(), // Duplicated from users table
  userEmail: v.string(), // Duplicated from users table
  content: v.string(), // Could be 100KB+, no length limit
  timestamp: v.number(), // Should use _creationTime
});

// ✅ Optimized schema
defineTable({
  userId: v.id("users"), // Reference, not duplication
  content: v.string(), // Validated at mutation layer (10-5000 chars)
  mood: v.string(), // Enum validated at mutation layer
  date: v.string(), // ISO format YYYY-MM-DD
  // _creationTime auto-generated by Convex
})
  .index("byUserAndDate", ["userId", "date"])
  .index("byUserId", ["userId"]);
```

---

### 9. Internal Mutations for Webhooks

**Checks:**
- ✅ Webhook handlers use `internalMutation`
- ✅ Signature validation implemented
- ✅ Error handling for failed webhooks

```typescript
// ❌ Public mutation (can be called directly by client)
export const upsertFromClerk = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    await ctx.db.insert("users", {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
    });
  },
});

// ✅ Internal mutation (only callable via HTTP route)
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  handler: async (ctx, { data }) => {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});
```

---

### 10. Query Return Size Optimization

**Checks:**
- ✅ Returning only necessary fields
- ✅ Aggregations done server-side
- ✅ Avoiding large object transfers

```typescript
// ❌ Returning unnecessary data
export const getEntryStats = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    // Returning ALL entries just to count them!
    return {
      entries, // Could be megabytes of data
      count: entries.length,
    };
  },
});

// ✅ Return only what's needed
export const getEntryStats = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    // Compute stats server-side, return summary only
    const moodCounts = entries.reduce((acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEntries: entries.length,
      moodCounts,
      firstEntryDate: entries[entries.length - 1]?.date,
      lastEntryDate: entries[0]?.date,
    };
  },
});
```

---

## Output Format

### Summary

```
Convex Optimization Report
─────────────────────────────────────
File: convex/journal.ts

✅ Index Usage: 3/3 queries optimized
✅ Authentication: All queries protected
✅ Validation: Comprehensive server-side checks
⚠️ Pagination: Consider for getAllEntries (future-proofing)
✅ Schema Design: Efficient indexes

Overall Score: 9/10 (Excellent)
```

### Detailed Findings

```
[Performance] [Medium Priority]
Location: convex/journal.ts:61

Issue: getAllEntries could return large dataset without pagination

Current:
export const getAllEntries = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("journalEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

Recommended: Add pagination
- Implement cursor-based pagination
- Limit to 50-100 entries per query
- Return nextCursor for infinite scroll

Why: Users with 1000+ entries will experience slow loads
and high bandwidth usage. Pagination prevents this.

Impact: Future-proofing for scale
```

---

## Performance Benchmarks

The skill provides estimated performance for common patterns:

### Query Performance
- **Index lookup**: ~1-5ms (O(log n))
- **Filter without index**: ~50-500ms (O(n))
- **Compound index**: ~2-10ms (O(log n))
- **Pagination**: ~5-20ms per page

### Scalability Estimates
- **10 entries**: All patterns fast
- **100 entries**: Pagination recommended
- **1,000 entries**: Pagination required
- **10,000+ entries**: Consider archival strategy

---

## Integration

Run this skill:
- **Before every deployment** - Catch performance regressions
- **During code review** - Validate query patterns
- **After schema changes** - Ensure indexes are optimal
- **In CI/CD pipeline** - Automated checks

---

## Configuration

```bash
# Full audit
/convex-optimizer convex/

# Focus on specific file
/convex-optimizer convex/journal.ts

# Check only performance issues
/convex-optimizer convex/ --focus=performance

# Strict mode (warn on all .filter() usage)
/convex-optimizer convex/ --strict

# Output with performance estimates
/convex-optimizer convex/journal.ts --benchmark
```

---

## Real Example: Our Journal Feature

### Before Optimization

```typescript
export const getEntriesByDate = query({
  handler: async (ctx, args) => {
    const entries = await ctx.db.query("journalEntries").collect();
    return entries.filter(
      (e) => e.userId === user._id && e.date === args.date
    );
  },
});
```

**Issues:**
- ❌ No authentication check
- ❌ Full table scan
- ❌ Client-side filtering
- ❌ Returns all users' data

**Performance:** O(n) - 500ms with 10,000 entries

---

### After Optimization

```typescript
export const getEntriesByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return await ctx.db
      .query("journalEntries")
      .withIndex("byUserAndDate", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .order("desc")
      .collect();
  },
});
```

**Improvements:**
- ✅ Authentication required
- ✅ Compound index lookup
- ✅ User-scoped automatically
- ✅ Returns only relevant entries

**Performance:** O(log n) - 3ms with 10,000 entries

**Impact:** 166x faster! ⚡

---

## Tips

1. **Index everything you query** - Filters are slow
2. **Compound indexes are powerful** - Design for your access patterns
3. **Validate on server** - Never trust client
4. **Paginate early** - Easier than retrofitting
5. **Use `getCurrentUserOrThrow`** - Security by default
6. **Test with realistic data** - 10 entries won't show issues

---

## Related Skills

- `/ui-ux-audit` - Frontend component validation
- `/form-timezone-check` - Form and date handling validation
