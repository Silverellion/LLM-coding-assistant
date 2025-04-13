import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isCloudflare = !!env.CLOUDFLARE_TUNNEL_HOSTNAME;

  // Log the environment variables for debugging
  console.log("Environment Configuration:");
  console.log(
    "- OLLAMA_BASE_URL:",
    env.OLLAMA_BASE_URL || "http://localhost:11434"
  );
  console.log("- VITE_API_PREFIX:", env.VITE_API_PREFIX || "/api/ollama");
  console.log(
    "- CLOUDFLARE_TUNNEL:",
    env.CLOUDFLARE_TUNNEL_HOSTNAME || "not set"
  );

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      allowedHosts: [
        env.CLOUDFLARE_TUNNEL_HOSTNAME?.replace(/^https?:\/\//, "") ||
          "localhost",
      ],
      proxy: {
        "/api/ollama": {
          target: env.OLLAMA_BASE_URL || "http://localhost:11434",
          changeOrigin: true,
          secure: false,
          headers: {
            Host: "localhost:11434",
            Origin: "http://localhost:11434",
          },
          rewrite: (path) => {
            const newPath = path.replace(/^\/api\/ollama/, "");
            console.log(`Rewriting path: ${path} -> ${newPath}`);
            return newPath;
          },
        },
      },
    },
    define: {
      "process.env.VITE_API_PREFIX": JSON.stringify(
        env.VITE_API_PREFIX || "/api/ollama"
      ),
    },
  };
});
