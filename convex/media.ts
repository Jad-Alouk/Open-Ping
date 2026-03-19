import { mutation } from "./_generated/server"
import { v } from "convex/values"


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl()
})

export const getUploadUrl = mutation({

    args: { storageID: v.id("_storage") },

    handler: async (ctx, { storageID }) => {
        return await ctx.storage.getUrl(storageID)
    }

})