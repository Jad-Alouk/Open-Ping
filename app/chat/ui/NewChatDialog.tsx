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
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function NewChatDialog() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")

    const handleCreate = () => {
        // Handle new chat creation
        console.log("Creating chat:", { title, message })
        setTitle("")
        setMessage("")
        setOpen(false)
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
                    <DialogTitle>New Conversation</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Conversation title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="message">First Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Start your conversation..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={!title.trim()}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
