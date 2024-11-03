import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    //env variable from .env file
    "process.env.VITE_KEY": JSON.stringify(process.env.VITE_KEY),
    "process.env.VITE_BACKEND_URL": JSON.stringify(
      process.env.VITE_BACKEND_URL
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
