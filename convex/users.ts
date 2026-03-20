import { mutation, query } from "./_generated/server"
import { ConvexError, v } from "convex/values"
import { getCurrentUser } from "./helpers/auth"


export const getUser = query({
    async handler(ctx) {
        return await getCurrentUser(ctx)
    }
})

export const updateUser = mutation({

    args: {
        username: v.optional(v.string()),
        bio: v.optional(v.string())
    },

    handler: async (ctx, { username, bio }) => {

        const user = await getCurrentUser(ctx)
        if (user === null) throw new ConvexError({
            code: 403,
            message: "User is not authorized.",
            fix: "Make sure you have a valid account by signing up."
        })

        if (!username && !bio) return

        await ctx.db.patch(user._id, {
            ...(username !== null && { username }),
            ...(bio !== null && { bio })
        })

    }

})

export const updateAvatar = mutation({

    args: { avatar: v.string() },

    handler: async (ctx, { avatar }) => {

        const user = await getCurrentUser(ctx)
        if (user === null) throw new ConvexError({
            code: 403,
            message: "User is not authorized.",
            fix: "Make sure you have a valid account by signing up."
        })

        await ctx.db.patch(user._id, { avatar })

    }

})

export const searchUsers = query({

    args: { searchTerm: v.string() },

    handler: async (ctx, { searchTerm }) => {

        const currentUser = await getCurrentUser(ctx)
        if (currentUser === null) return null

        if (!searchTerm) return []

        const formatted = searchTerm.toLowerCase()

        const users = await ctx.db
            .query("users")
            .filter((q) => q.neq(q.field("externalID"), currentUser.externalID))
            .collect()

        return users
            .filter((user) => {
                const nameMatch = user?.username?.toLowerCase().includes(formatted)

                const emailMatch = user?.email?.toLowerCase().includes(formatted)

                return nameMatch || emailMatch
            })
            .slice(0, 10)
    }

})