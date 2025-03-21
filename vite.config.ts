import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//config de Youn pour régler le problème de CORS
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://freetestapi.com",
                changeOrigin: true,
            },
            "/geo": {
                target: "https://nominatim.openstreetmap.org",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/geo/, ""),
            },
        },
    },
});