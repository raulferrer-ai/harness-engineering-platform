// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import globals from "globals";

// ESLint 10 (flat config). Alcance: .astro (frontmatter TypeScript incluido),
// JavaScript y Markdown futuro. Los .ts sueltos también los cubre `astro check`;
// si aparece lógica de negocio relevante se ampliará con typescript-eslint completo.
export default defineConfig([
  globalIgnores([
    "node_modules/",
    "dist/",
    ".astro/",
    "coverage/",
    // Ejemplos educativos de las lecciones: se comprueban ejecutándolos
    // (tests de contenido H3+), no con el linter del proyecto.
    "src/content/**/*.js",
  ]),
  js.configs.recommended,
  astro.configs["flat/recommended"],
  {
    // Permite TypeScript en el frontmatter de los componentes .astro.
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    // Globals de Node en los scripts de comprobación (sin dependencia extra).
    files: ["tests/**/*.mjs", "scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  {
    // Globals de navegador para los `<script>` de los componentes (H4:
    // progreso local y búsqueda; se valida también en src/scripts/*.ts con
    // `astro check`, que no pasa por ESLint).
    files: ["src/**/*.astro"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
]);
