import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Mouryan-Tech-Solution/",
  plugins: [
    tailwindcss(),
    react(),
  ],
  // The browser talks to this local path during development. Vite forwards it
  // to Render, avoiding a separate localhost CORS setting on the API.
  server: {
    proxy: {
      "/api": {
        target: "https://mouryan-backend.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
