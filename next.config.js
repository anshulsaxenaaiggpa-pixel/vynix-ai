/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // Ignore TS errors during build so Railway doesn't fail on type issues
        ignoreBuildErrors: true,
    },
    eslint: {
        // Ignore ESLint errors during build
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-625ea53490d04dc1a859ce04261c2c47.r2.dev',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.r2.dev',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
