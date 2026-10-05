import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_")
  const siteUrl = (env.VITE_SITE_URL || "https://onrender.com").replace(/\/$/, "")

  return {
    plugins: [
      {
        name: "portfolio-seo-origin",
        transformIndexHtml(html) {
          return html.replaceAll("__SITE_URL__", siteUrl)
        },
      },
      react(),
      tailwindcss(),
      ViteImageOptimizer({
        png: { quality: 80 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { quality: 80 },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-three': ['three', '@react-three/fiber'],
            'vendor-framer': ['framer-motion', 'motion'],
            'vendor-icons': ['lucide-react', 'react-icons', '@tabler/icons-react']
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  }
})