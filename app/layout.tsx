import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import ConvexClientProvider from "@/providers/ConvexClientProvider"
import { ThemeProvider } from "@/providers/theme-provider"
import "./globals.css"


export const metadata: Metadata = {
	title: "Open-Ping",
	description: ""
}

export default function RootLayout(
	{ children }: Readonly<{ children: React.ReactNode }>
) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`antialiased`}
			>
				<ClerkProvider>
					<ConvexClientProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
					</ConvexClientProvider>
				</ClerkProvider>
			</body>
		</html>
	)
}
