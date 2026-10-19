/**
 * Colecciones de contenido (hito H2) — IMPLEMENTATION_PLAN.md §3.1.
 *
 * Cada colección declara `base` apuntando a SU carpeta dentro de
 * `src/content`: así el `id` de cada entrada es la ruta relativa dentro de la
 * carpeta (`n0`, `n0/m1`, `n0/m1/lecciones/l01-…`) y no incluye el nombre de
 * la colección. Si `base` apuntara a `src/content` (raíz común), los ids
 * saldrían como `niveles/n0` y las rutas dinámicas se romperían.
 *
 * Esquemas en `src/lib/schemas.ts` (fuente única de la validación).
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import {
  schemaFase,
  schemaGlosario,
  schemaLeccion,
  schemaModulo,
  schemaNivel,
  schemaReferencia,
} from "./lib/schemas";

const niveles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/niveles" }),
  schema: schemaNivel,
});

const modulos = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/modulos" }),
  schema: schemaModulo,
});

const lecciones = defineCollection({
  loader: glob({ pattern: "**/lecciones/*.mdx", base: "./src/content/modulos" }),
  schema: schemaLeccion,
});

const glosario = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/glosario" }),
  schema: schemaGlosario,
});

const referencias = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/referencias" }),
  schema: schemaReferencia,
});

const proyecto = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/proyecto" }),
  schema: schemaFase,
});

export const collections = { niveles, modulos, lecciones, glosario, referencias, proyecto };
