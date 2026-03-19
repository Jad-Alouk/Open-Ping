import type { NextConfig } from "next";
import path from "node:path";


const nextConfig: NextConfig = {
	logging: { fetches: { fullUrl: true } },
	turbopack: { root: path.resolve(__dirname, "..") },
	images: { remotePatterns: [new URL("https://img.clerk.com/**")] },
	cacheComponents: false,
};

export default nextConfig;
