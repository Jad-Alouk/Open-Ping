"use client"

import { useState } from "react"
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

export function SearchDialog() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")

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
                        placeholder="Search conversations..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <div className="min-h-50 rounded-md border border-border p-4">
                        {query ? (
                            <p className="text-sm text-muted-foreground">
                                No results found for &quot;{query}&quot;
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Start typing to search through your conversations...
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
