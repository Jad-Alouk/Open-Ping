import { preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { ChatSidebar } from "./ui/ChatSidebar"
import { MobileSidebar } from "./ui/MobileSidebar"


export default async function ChatLayout(
    { children }: { children: React.ReactNode }
) {

    const preThreads = await preloadQuery(api.threads.getThreads)

    return (
        <div className="relative flex h-dvh w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden h-full w-72 shrink-0 md:block">
                <ChatSidebar preThreads={preThreads} />
            </div>

            {/* Mobile Sidebar */}
            <header
                className="absolute left-0 right-0 top-0 z-10 flex items-start gap-3 border-b border-border bg-background px-4 py-3 md:hidden"
            >
                <MobileSidebar preThreads={preThreads} />
            </header>

            {/* Main Content */}
            <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-14 md:pt-0">
                {children}
            </main>
        </div>
    )
}
