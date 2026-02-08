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

/** @type {import('postcss').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Add other PostCSS plugins here if needed
  },
};


