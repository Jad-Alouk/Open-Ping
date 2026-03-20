"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useDebounce } from "@/hooks/useDebounce"
import Link from "next/link"


export function SearchDialog(
    { preThreads }: { preThreads: Preloaded<typeof api.threads.getThreads> }
) {
    const threads = usePreloadedQuery(preThreads)
    const [open, setOpen] = useState(false)

    const [query, setQuery] = useState("")
    const [seacrh, setSearch] = useState<typeof threads>()
    const debouncedQuery = useDebounce(query, 100)

    useEffect(() => {
        const f = debouncedQuery.toLowerCase().trim()
        if (f) {
            setSearch(threads?.filter(t => {
                const nameMatch = t.name.toLowerCase().includes(f)
                const lastMessageMatch = t.lastMessage.toLowerCase().includes(f)
                return nameMatch || lastMessageMatch
            }).slice(0, 5))
        } else {
            setSearch(null)
        }
    }, [debouncedQuery])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search threads</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Search Threads</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Search by name or last message..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <div className="min-h-50 rounded-md border border-border p-4">
                        {
                            seacrh ?
                                seacrh.length === 0 ?
                                    (
                                        <p className="text-sm text-muted-foreground">
                                            {`No results found for "${query}"`}
                                        </p>
                                    ) :
                                    seacrh.map(t =>
                                        <Link
                                            key={t.id}
                                            href={`/chat/${t.id}`}
                                            onClick={() => setOpen(false)}
                                            className="text-sm text-muted-foreground block"
                                        >
                                            {t.name}
                                        </Link>
                                    ) :
                                (<p className="text-sm text-muted-foreground">
                                    Start typing to search through your conversations...
                                </p>)
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
