import type { NextConfig } from "next";
import path from "node:path";


const nextConfig: NextConfig = {
	logging: { fetches: { fullUrl: true } },
	turbopack: { root: path.resolve(__dirname, "..") },
	cacheComponents: false,
};

export default nextConfig;
