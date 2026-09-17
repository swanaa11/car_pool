/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@carpull/ui","@carpull/config","@carpull/i18n","@carpull/types","@carpull/utils","@carpull/validation"],
  images: { remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }, { protocol: "https", hostname: "images.unsplash.com" }] },
  experimental: { typedRoutes: false },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};
export default nextConfig;
