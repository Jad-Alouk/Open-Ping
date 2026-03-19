import { mutation, query } from "./_generated/server"
import { ConvexError, v } from "convex/values"
import { getCurrentUser } from "./helpers/auth"
import { formatChatTime } from "./helpers/utils"


export const upsertThread = mutation({

    args: { yapperID: v.string() },

    handler: async (ctx, { yapperID }) => {

        const currentUser = await getCurrentUser(ctx)
        if (currentUser === null) throw new ConvexError({
            code: 403,
            message: "User is not authorized.",
            fix: "Make sure you have a valid account by signing up."
        })

        const otherUser = await ctx.db
            .query("users")
            .withIndex("byExternalID", q => q.eq("externalID", yapperID))
            .first()

        if (otherUser === null) throw new ConvexError({
            code: 404,
            message: "Chatter is not found.",
            fix: "Make sure the requested chatter has a valid account."
        })

        const existingThread = await ctx.db
            .query("threads")
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("yapperOne"), currentUser._id),
                        q.eq(q.field("yapperTwo"), otherUser._id)
                    ),
                    q.and(
                        q.eq(q.field("yapperOne"), otherUser._id),
                        q.eq(q.field("yapperTwo"), currentUser._id)
                    )
                )
            )
            .first()

        if (existingThread) return existingThread._id

        const newThread = await ctx.db.insert("threads", {
            yapperOne: currentUser._id,
            yapperTwo: otherUser._id,
            updatedAt: Date.now()
        })

        return newThread
    }

})

export const getThreads = query({

    async handler(ctx) {

        const user = await getCurrentUser(ctx)
        if (user === null) return null

        const threads = await ctx.db
            .query("threads")
            .filter((q) =>
                q.or(
                    q.eq(q.field("yapperOne"), user._id),
                    q.eq(q.field("yapperTwo"), user._id)
                )
            )
            .collect()

        const threadDetails = await Promise.all(
            threads.map(async (thread) => {

                const otherUser = await ctx.db.get(
                    thread.yapperOne === user._id
                        ? thread.yapperTwo
                        : thread.yapperOne
                )

                const lastMessage = thread.lastMessageID
                    ? await ctx.db.get(thread.lastMessageID)
                    : null

                return {
                    id: thread._id,
                    name: otherUser?.username ?? "Unknown",
                    chatImage: otherUser?.avatar,
                    lastMessage: lastMessage?.content ?? "",
                    time: formatChatTime(new Date(thread.updatedAt)),
                    type: lastMessage?.type
                }
            })
        )

        return threadDetails
            .sort(
                (
                    a: typeof threadDetails[0],
                    b: typeof threadDetails[0]
                ) =>
                    Number(b.time) - Number(a.time)
            )
    }

})

export const deleteThread = mutation({

    args: { threadID: v.id("threads") },

    handler: async (ctx, { threadID }) => {

        const user = await getCurrentUser(ctx)
        if (user === null) throw new ConvexError({
            code: 403,
            message: "User is not authorized.",
            fix: "Make sure you have a valid account by signing up."
        })

        const thread = await ctx.db.get(threadID)

        if (thread === null) return

        if (thread.yapperOne !== user._id && thread.yapperTwo !== user._id) {
            throw new ConvexError({
                code: 403,
                message: "User is not authorized.",
                fix: "Make sure you have a valid account by signing up."
            })
        }

        const chats = await ctx.db
            .query("chats")
            .withIndex("byThreadID", (q) => q.eq("threadID", threadID))
            .collect()

        await Promise.all(chats.map(c => ctx.db.delete(c._id)))
        await ctx.db.delete(threadID)

        return { count: chats.length }
    }

})