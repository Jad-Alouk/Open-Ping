import { Show, UserButton } from "@clerk/nextjs"
import Link from "next/link"


export default function Home() {
	return (
		<main className="w-full h-screen flex flex-col justify-center items-center">
			<h1>Open Ping</h1>
			<h2>{`It's like whatsapp... but shittier.`}</h2>
			<Link href={"/sign-up"}>Get started</Link>
			<Link href={"/chat"}>Continue yapping</Link>
			<Show when={"signed-in"}><UserButton /></Show>
		</main>
	)
}