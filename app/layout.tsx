import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
	title: "Open-Ping",
	description: ""
}

export default function RootLayout(
	{ children }: Readonly<{ children: React.ReactNode }>
) {
	return (
		<html lang="en" className={cn("font-sans", geist.variable)}>
			<body
				className={`antialiased`}
			>
				<ClerkProvider>
					{children}
				</ClerkProvider>
			</body>
		</html>
	)
}
