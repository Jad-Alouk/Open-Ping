import { preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { ChatSidebar } from "./ui/ChatSidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { MobileSidebar } from "./ui/MobileSidebar"


export default async function ChatLayout(
    { children }: { children: React.ReactNode }
) {

    const preThreads = await preloadQuery(api.threads.getThreads)

    return (
        <div className="flex h-dvh w-full">
            {/* Desktop Sidebar */}
            <div className="hidden w-72 shrink-0 md:block">
                <ChatSidebar preThreads={preThreads} />
            </div>

            {/* Mobile Sidebar */}
            <header
                className="flex items-start absolute gap-3 border-b border-border px-4 py-3 md:hidden"
            >
                <MobileSidebar preThreads={preThreads} />

                <Link href="/chat" className="hidden md:block">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to chats</span>
                    </Button>
                </Link>
                {/* <h1 className="truncate font-semibold">{title}</h1> */}
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden">
                {children}
            </main>
        </div>
    )
}
