
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  base:"meli-static-site",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
