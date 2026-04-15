/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@libsql/client",
      "@prisma/adapter-libsql",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push(
        "@libsql/client",
        "@libsql/isomorphic-fetch",
        "@libsql/isomorphic-ws",
        "@libsql/hrana-client",
        "libsql",
        "@prisma/adapter-libsql"
      );
    }
    return config;
  },
};

export default nextConfig;
