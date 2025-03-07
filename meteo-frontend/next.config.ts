import type { NextConfig } from "next"

const environment = process.env.NODE_ENV || 'development';

const nextConfig: NextConfig = {
  // Proxy to Backend
	rewrites: async () => (environment === 'development' || environment === 'test' ? [
		{
			source: "/api/:path*",
			destination: "http://localhost:8000/api/:path*",
		},
	] : [
    {
			source: "/api/:path*",
			destination: "http://backend:8000/api/:path*",
		}
  ])
}

export default nextConfig
