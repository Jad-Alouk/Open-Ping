import { ChatMessages } from "../ui/ChatMessages"
import { ChatInput } from "../ui/ChatInput"


export default async function ThreadPage({ params }: PageProps<"/chat/[id]">) {
    const { id } = await params

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <ChatMessages threadID={id} />
            <ChatInput threadID={id} />
        </div>
    )
}