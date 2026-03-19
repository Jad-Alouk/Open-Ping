import { MessageSquarePlus } from "lucide-react"


export default function ChatHomePage() {
    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <MessageSquarePlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-foreground">
                        Select a thread
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Choose a thread from the sidebar or start a new conversation
                    </p>
                </div>
            </div>
        </div>
    )
}