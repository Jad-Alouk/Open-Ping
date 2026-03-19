import { QueryCtx } from "../_generated/server"


export const getCurrentUser = async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) return null

    return await getUserByExternalID(ctx, identity.subject)
}

export const getUserByExternalID = async (ctx: QueryCtx, externalId: string) => {
    return await ctx.db
        .query("users")
        .withIndex("byExternalID", (q) => q.eq("externalID", externalId))
        .unique()
}