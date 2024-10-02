/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: `${process.env.NEXT_PUBLIC_BACKEND}/:path*`, // Proxy to Backend
    //         },
    //     ];
    // },
};

export default nextConfig;
