module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true }
}

module.exports = nextConfig

