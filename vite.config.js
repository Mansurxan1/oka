import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE");

  return {
    plugins: [react()],
    base: "/",
    server: {
      port: Number(env.VITE_PORT),
      proxy: {
        "/api": {
          target: env.VITE_API_PORT,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
