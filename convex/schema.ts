import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"


export default defineSchema({

    users: defineTable({
        externalID: v.string(),
        email: v.string(),
        username: v.string(),
        avatar: v.optional(v.string()),
        bio: v.optional(v.string())
    })
        .index("byExternalID", ["externalID"])
        .index("byEmail", ["email"]),

    threads: defineTable({
        yapperOne: v.id("users"),
        yapperTwo: v.id("users"),
        lastMessageID: v.optional(v.id("chats")),
        updatedAt: v.number()
    })
        .index("byBothYappers", ["yapperOne", "yapperTwo"])
        .index("byYapperOne", ["yapperOne"])
        .index("byYapperTwo", ["yapperTwo"]),

    chats: defineTable({
        threadID: v.id("threads"),
        senderID: v.id("users"),
        content: v.string(),
        type: v.union(
            v.literal("text"),
            v.literal("image"),
            v.literal("video"),
            v.literal("audio"),
            v.literal("file")
        ),
        mediaUrl: v.optional(v.string()),
        replyTo: v.optional(v.id("chats")),
        isEdited: v.boolean(),
        updatedAt: v.number()
    })
        .index("byThreadID", ["threadID"])
        .index("bySender", ["senderID"]),

    media: defineTable({
        chatID: v.id("chats"),
        url: v.string(),
        type: v.union(
            v.literal("image"),
            v.literal("video"),
            v.literal("audio"),
            v.literal("file")
        ),
        size: v.number(),
        mimeType: v.string(),
        duration: v.optional(v.number()),
        fileName: v.string(),
        updatedAt: v.number()
    })
        .index("byChatID", ["chatID"])
        .index("byType", ["type"])

})