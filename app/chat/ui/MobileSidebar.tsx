"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ThreadsList } from "./ThreadsList"
import { SearchDialog } from "./SearchDialog"
import { NewChatDialog } from "./NewChatDialog"
import { Preloaded } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"


export function MobileSidebar(
    { preThreads }: { preThreads: Preloaded<typeof api.threads.getThreads> }
) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <Sheet open={isOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost" size="icon" className="md:hidden"
                    onClick={() => setIsOpen(p => !p)}
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-72 p-0 flex min-h-0 flex-col overflow-hidden"
            >
                <SheetHeader className="border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between pr-8">
                        <SheetTitle className="text-base">Chats</SheetTitle>
                        <div className="flex items-center gap-1">
                            <SearchDialog />
                            <NewChatDialog />
                        </div>
                    </div>
                    <SheetDescription className="sr-only">
                        Your chat conversations
                    </SheetDescription>
                </SheetHeader>
                <ThreadsList preThreads={preThreads} mobile={setIsOpen} />
            </SheetContent>
        </Sheet>
    )
}
