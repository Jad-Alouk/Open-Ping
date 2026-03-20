"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"


export function NewChatDialog() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const debouncedQuery = useDebounce(query)

    const router = useRouter()
    const suggestions = useQuery(api.users.searchUsers, { searchTerm: debouncedQuery })
    const createThread = useMutation(api.threads.upsertThread)

    const handleThread = async (yapperID: string) => {
        const newThread = await createThread({ yapperID })
        if (newThread) {
            setOpen(false)
            setQuery("")
            router.push(`/chat/${newThread}`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New chat</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Input
                            id="seacrh"
                            placeholder="Search by email or name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div
                        className="flex flex-col gap-2 min-h-50 rounded-md border border-border p-4"
                    >
                        {
                            suggestions ?
                                suggestions.length === 0 ?
                                    (
                                        <p className="text-sm text-muted-foreground">
                                            {`No results found for "${query}"`}
                                        </p>
                                    ) :
                                    suggestions.map(s =>
                                        <p
                                            key={s.externalID}
                                            onClick={() => handleThread(s.externalID)}
                                            className="text-sm text-muted-foreground block cursor-pointer"
                                        >
                                            {s.email}
                                        </p>
                                    ) :
                                (<p className="text-sm text-muted-foreground">
                                    Start typing to search for a user...
                                </p>)
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}