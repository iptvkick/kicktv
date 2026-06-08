import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackStartVite } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [TanStackStartVite(), react()],
});
