/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// Check for master token or encryption keys
if (!process.env.MASTER_TOKEN && (!process.env.PRIVATE_KEY || !process.env.PUBLIC_KEY)) {
  throw Error('Expecting one of MASTER_TOKEN or PUBLIC_KEY/PRIVATE_KEY environment variables')
}

module.exports = nextConfig
