// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackStartVite } from "@tanstack/react-start/plugin/vite";
var vite_config_default = defineConfig({
  plugins: [TanStackStartVite(), react()]
});
export {
  vite_config_default as default
};
