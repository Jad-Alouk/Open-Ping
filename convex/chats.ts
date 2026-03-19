import { mutation, query } from "./_generated/server"
import { ConvexError, v } from "convex/values"
import { formatChatTime } from "./helpers/utils"
import { getCurrentUser } from "./helpers/auth"


export const sendMessage = mutation({

    args: {
        threadID: v.id("threads"),
        content: v.string(),
        type: v.optional(v.union(v.literal("text"), v.literal("image"))),
        mediaUrl: v.optional(v.string())
    },

    handler: async (ctx, args) => {

        const sender = await getCurrentUser(ctx)
        if (sender === null) throw new ConvexError({
            code: 403,
            message: "User is not authorized.",
            fix: "Make sure you have a valid account by signing up."
        })

        const messageID = await ctx.db.insert("chats", {
            threadID: args.threadID,
            senderID: sender._id,
            content: args.content,
            type: args.type ?? "text",
            mediaUrl: args.mediaUrl,
            updatedAt: Date.now(),
            isEdited: false
        })

        await ctx.db.patch(args.threadID, {
            lastMessageID: messageID,
            updatedAt: Date.now()
        })

        return messageID

    }

})

export const getMessages = query({

    args: {
        threadID: v.id("threads"),
        limit: v.optional(v.number())
    },

    handler: async (ctx, { threadID, limit }) => {

        const user = await getCurrentUser(ctx)
        if (user === null) return null

        const chats = await ctx.db
            .query("chats")
            .withIndex("byThreadID", q => q.eq("threadID", threadID))
            .order("asc")
            .take(limit ?? 50)

        return await Promise.all(
            chats.map(async c => {
                const sender = await ctx.db.get(c.senderID)
                return {
                    id: c._id,
                    senderID: sender?.externalID,
                    sender: sender?.username ?? "Unknown",
                    isMine: sender?.externalID === user.externalID,
                    content: c.content,
                    time: formatChatTime(new Date(c._creationTime)),
                    type: c.type,
                    mediaUrl: c.mediaUrl
                }
            })
        )
    }

})