import { internalMutation } from "./_generated/server"
import { v, Validator } from "convex/values"
import { UserJSON } from "@clerk/backend"
import { getUserByExternalID } from "./helpers/auth"


export const upsertFromClerk = internalMutation({

    args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk

    async handler(ctx, { data }) {
        const userAttributes = {
            externalID: data.id,
            email: data.email_addresses[0].email_address,
            username: `${data.first_name} ${data.last_name}`,
            avatar: data.has_image ? data.image_url : undefined,
            bio: undefined
        }

        const user = await getUserByExternalID(ctx, data.id)

        if (user === null) {
            await ctx.db.insert("users", userAttributes)
        } else {
            await ctx.db.patch(user._id, userAttributes)
        }
    }

})

export const deleteFromClerk = internalMutation({

    args: { clerkID: v.string() },

    async handler(ctx, { clerkID }) {

        const user = await getUserByExternalID(ctx, clerkID)

        if (user !== null) await ctx.db.delete(user._id)
    }

})