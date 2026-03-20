"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { useEffect, useRef } from "react"


export function ChatMessages({ threadID }: { threadID: string }) {

    const messages = useQuery(api.chats.getMessages, { threadID: threadID as Id<"threads"> })

    const scrollRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <ScrollArea className="flex-1 min-h-0 p-4">
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
                {messages?.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex flex-col gap-1",
                            message.isMine ? "items-end" : "items-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-2",
                                message.isMine
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                            )}
                        >
                            <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="px-2 text-xs text-muted-foreground">
                            {message.time}
                        </span>

                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>
        </ScrollArea>
    )
}
