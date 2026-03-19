import { preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import ProfileComponent from "./ui/ProfileComponent"


export default async function ProfilePage() {

    const preUserData = await preloadQuery(api.users.getUser)

    return (
        <div className="w-full">
            <ProfileComponent preUserData={preUserData} />
        </div>
    )
}