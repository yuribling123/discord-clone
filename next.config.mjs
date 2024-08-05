/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "uploadthing.com",
            "utfs.io"  // Add the domain causing the error here
        ]
    }
};

export default nextConfig;
