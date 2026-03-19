"use client"

import { MessageSquare } from "lucide-react"
import { SearchDialog } from "./SearchDialog"
import { NewChatDialog } from "./NewChatDialog"
import { ThreadsList } from "./ThreadsList"
import { Preloaded } from "convex/react"
import { api } from "@/convex/_generated/api"


export function ChatSidebar(
    { preThreads }: { preThreads: Preloaded<typeof api.threads.getThreads> }
) {
    return (
        <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-sidebar-foreground" />
                    <span className="font-semibold text-sidebar-foreground">Chats</span>
                </div>
                <div className="flex items-center gap-1">
                    <SearchDialog />
                    <NewChatDialog />
                </div>
            </div>

            {/* Thread List */}
            <ThreadsList preThreads={preThreads} />
        </aside>
    )
}
