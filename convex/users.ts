import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
      onboardingCompleted: false,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (userRecord !== null) {
    return userRecord;
  }

  const identity = await ctx.auth.getUserIdentity();
  if (identity !== null && "insert" in ctx.db) {
    const userAttributes = {
      name: identity.name ?? identity.nickname ?? "Anonymous",
      externalId: identity.subject,
      onboardingCompleted: false,
    };
    const userId = await (ctx.db as any).insert("users", userAttributes);
    return (await ctx.db.get(userId))!;
  }

  throw new Error("Can't get current user");
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export const markOnboardingCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.patch(user._id, { onboardingCompleted: true });
  },
});

export const markOnboardingSkipped = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.patch(user._id, { onboardingCompleted: true });
  },
});

export const getOnboardingStatus = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { onboardingCompleted: false };
    }
    return {
      onboardingCompleted: user.onboardingCompleted ?? false,
    };
  },
});
