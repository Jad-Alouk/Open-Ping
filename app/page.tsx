import Link from "next/link"
import { Button } from "@/components/ui/button"


export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
			<div className="text-center">
				<h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
					<span className="bg-linear-to-r from-foreground via-foreground/70 to-foreground bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-500">
						Open Ping
					</span>
				</h1>
				<p className="mt-5 text-muted-foreground">
					{`It's like WhatsApp... But shittier.`}
				</p>
				<div className="mt-8 flex items-center justify-center gap-4">
					<Button asChild variant="outline">
						<Link href="/sign-up">Sign Up</Link>
					</Button>
					<Button asChild>
						<Link href="/chat">Start Yapping</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}
