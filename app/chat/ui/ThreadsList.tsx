"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"


export function ThreadsList(
    { preThreads }: { preThreads: Preloaded<typeof api.threads.getThreads> }
) {
    const pathname = usePathname()
    const threads = usePreloadedQuery(preThreads)

    return (
        <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
                {threads?.map((thread) => {
                    const isActive = pathname === `/chat/${thread.id}`
                    return (
                        <Link
                            key={thread.id}
                            href={`/chat/${thread.id}`}
                            className={cn(
                                "flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive && "bg-accent text-accent-foreground"
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="truncate font-medium">{thread.name}</span>
                                <span className="shrink-0 text-xs text-muted-foreground">{thread.time}</span>
                            </div>
                            <span className="truncate text-xs text-muted-foreground">{thread.lastMessage}</span>
                        </Link>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
