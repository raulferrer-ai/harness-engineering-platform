// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// Configuración mínima del hito H0 (IMPLEMENTATION_PLAN.md §2.4).
// `site` se definirá cuando exista un dominio definitivo (IMPLEMENTATION_PLAN.md §9),
// necesario para canonical, sitemap y Open Graph.
export default defineConfig({
  // H4 (IMPLEMENTATION_PLAN.md §5.2): prefetch de Astro. Solo se descarga bajo
  // petición del usuario (enfoque/foco/toco) y únicamente en los enlaces
  // marcados con `data-astro-prefetch` (sin `prefetchAll`); en conexiones lentas
  // o con ahorro de datos Astro cae a la estrategia «tap», sin descargas
  // anticipadas. Evaluación y alcance: §10.4 (H4).
  prefetch: true,
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
