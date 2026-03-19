import { ChatMessages } from "../ui/ChatMessages"
import { ChatInput } from "../ui/ChatInput"


export default async function ThreadPage({ params }: PageProps<"/chat/[id]">) {
    const { id } = await params

    return (
        <div className="flex h-full flex-col">
            <ChatMessages threadID={id} />
            <ChatInput threadID={id} />
        </div>
    )
}