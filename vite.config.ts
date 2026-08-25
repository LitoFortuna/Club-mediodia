import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        preset: "firebase",
      },
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  ssr: {
    // Bundle everything EXCEPT firebase-admin (CJS, uses __dirname)
    // and firebase (large, works better as external)
    noExternal: true,
    external: ["firebase-admin", "firebase-admin/app", "firebase-admin/firestore"],
  },
});
