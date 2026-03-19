"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"


export function ChatInput({ threadID }: { threadID: string }) {
    const [message, setMessage] = useState("")
    const sender = useMutation(api.chats.sendMessage)

    const handleSend = async () => {
        if (!message.trim()) return
        await sender({ content: message, threadID: threadID as Id<"threads"> })
        setMessage("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="border-t border-border bg-background p-4">
            <div className="mx-auto flex max-w-2xl items-end gap-2">
                <Textarea
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="min-h-10 max-h-32 resize-none"
                />
                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="shrink-0"
                >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </div>
    )
}
