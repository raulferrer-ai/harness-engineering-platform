# Harness Engineering Platform

Academia online, gratuita y abierta, para aprender a desarrollar software asistido por inteligencia artificial: desde los fundamentos de programación hasta Harness Engineering y sistemas multiagente.

**Estado actual: hitos H0–H8 completados** — scaffolding, sistema de diseño, sistema de contenidos, los **tres primeros módulos completos** del currículo (las 7 lecciones de `n0/m1`, las 7 de `n0/m2` «Tipos, variables y funciones» y las 7 de `n0/m3` «Control de flujo y estructuras de datos», con 44 ficheros en las tres carpetas `ejemplos/` — 12 + 15 + 17 — y 54 pruebas `node --test` en verde entre los módulos, más ejercicios verificados y rojos deliberados con su clase de error), **navegación lateral por módulo, búsqueda estática con Pagefind (`/buscar/`) y progreso local** (H4), **CI + despliegue en Cloudflare Workers con gate de rama activo** (H5, cerrado el 21-10-2026: CI verde en los 5 pushes a `main`, producción verificada con Pagefind y 404, ruleset que exige PR con CI verde, y verificación en navegador del buscador, progreso y navegación), **documentación de mantenimiento + auditoría de accesibilidad** (H6, cerrado el 21-10-2026: `docs/MANTENIMIENTO.md`, `docs/AUDITORIA_A11Y.md` con checklist firmada, Lighthouse accessibility **1.0 en 11 rutas** y 4 hallazgos corregidos) y **publicación de `n0/m2` y `n0/m3`** (H7 y H8, cerrados el 21-10-2026: 7 lecciones cada uno con la plantilla obligatoria, 15 y 17 ficheros de ejemplo ejecutados — 20 y 28 pruebas `node --test` en verde, con 3 y 1 ficheros de error reales más rojos registrados en los tests de cobertura — y `tests/content/ejemplos.test.ts` ampliado con la cobertura de cada módulo). El mapa navegable en `/curriculo/` (9 niveles y 56 módulos) suma **90 páginas** (incluida `/buscar/`), el gate `npm run verify` supera **117 tests** y `npm run build:deploy` valida además enlaces internos e índice de búsqueda.

## Requisitos

- **Node.js 24.22.0** (versión fijada en `.nvmrc` y `.node-version`; cualquier gestor de versiones las respeta: `nvm use`, Volta, asdf, fnm…). Se admite `^24.16.0` como mínimo (`engines` de `package.json`); la instalación falla a propósito si usas otra versión (`.npmrc` con `engine-strict=true`).
- **npm ≥ 9.6.5** (incluido con Node 24).
- Cuenta de GitHub solo para colaborar; y de Cloudflare solo al desplegar. Ningún comando local necesita credenciales.

Si usas **Volta**, el `package.json` ya fija la versión (`volta pin`); ejecuta una vez `volta install node@24.22.0` si aún no la tienes. Si usas **nvm**: `nvm install` (lee `.nvmrc`).

## Instalación

```bash
npm install    # primera vez (genera/actualiza package-lock.json)
npm ci         # instalación reproducible desde el lockfile (la que usa el CI)
```

## Comandos

| Comando                  | Qué hace                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `npm run dev`            | Servidor de desarrollo con recarga en caliente (`astro dev`).                                   |
| `npm run check`          | Comprobación de tipos y diagnósticos de Astro (`astro check`).                                  |
| `npm run lint`           | ESLint sobre Astro y JavaScript (`eslint .`).                                                   |
| `npm run lint:fix`       | ESLint con autoreparación.                                                                      |
| `npm run format`         | Formatea el repositorio con Prettier.                                                           |
| `npm run format:check`   | Comprueba el formato sin escribir nada.                                                         |
| `npm test`               | Tests unitarios con Vitest.                                                                     |
| `npm run test:watch`     | Vitest en modo observación.                                                                     |
| `npm run verify`         | Gate completo: `check` + `lint` + `format:check` + `test`.                                      |
| `npm run build`          | Compila en `dist/` y genera el índice de búsqueda (`astro build` + `pagefind`).                 |
| `npm run build:deploy`   | `verify` + `build` + `links` + `pagefind:check`; es lo que ejecutará Cloudflare Pages.          |
| `npm run preview`        | Sirve `dist/` en local para revisar la compilación.                                             |
| `npm run links`          | Comprueba enlaces y anclas internos del `dist/` (tras un build).                                |
| `npm run pagefind`       | (Re)genera el índice de búsqueda sobre `dist/` (`pagefind.yml`).                                |
| `npm run pagefind:check` | Valida el índice generado: presente, no vacío, coherente con `data-pagefind-body` y sin la 404. |

## Estructura

```
src/
├── pages/             # Rutas Astro: /, 404, /curriculo/** y /buscar/
├── styles/            # global.css con Tailwind 4 (CSS-first)
├── layouts/           # Plantilla BaseLayout
├── components/        # ui/, nav/ (breadcrumb, prev/next, barra lateral, mapa…)
├── content/           # Colecciones del currículum (ver src/content/README.md)
├── content.config.ts  # Definición y esquemas de las colecciones
├── lib/               # Lógica pura testeable (rutas, orden, progreso, búsqueda)
└── scripts/           # JS cliente ligero (progreso local y búsqueda, H4)
tests/
├── unit/              # Lógica pura con Vitest
├── content/           # Reglas del currículo y del frontmatter
└── links/             # Enlaces internos e índice de Pagefind del build
pagefind.yml           # Configuración del índice de búsqueda (site: dist)
.github/workflows/     # CI: npm ci → verify → build:deploy
```

La arquitectura completa (rutas, colecciones de contenido, sistema de diseño) está en `IMPLEMENTATION_PLAN.md`; el mapa del currículum, en `CURRICULUM.md`.

## Comprobaciones y CI

- `npm run verify` es el gate obligatorio: tipos, lint, formato y tests. El despliegue usa `npm run build:deploy`, que lo ejecuta antes de compilar y añade la comprobación de enlaces internos y del índice de Pagefind: si algo falla, **no se publica nada**.
- GitHub Actions (`.github/workflows/ci.yml`) ejecuta en cada push a `main`, en cada pull request y bajo demanda (`workflow_dispatch`): `npm ci` (con caché de npm), un paso visible de `npm run verify` y un paso `npm run build:deploy` (la compilación de producción corre **una sola vez**, dentro de ese paso). Permisos mínimos (`contents: read`), cancelación de ejecuciones obsoletas del mismo push/PR (`concurrency`) y versión de Node leída de `.nvmrc`.
- **Estado (21-10-2026)**: el workflow **ya se ha ejecutado en GitHub 7 veces** (6 verdes en pushes a `main` y PRs, 1 rojo **a propósito** como prueba del gate). La exigencia de «CI verde antes de publicar» está **activa y verificada**: una ruleset sobre `main` rechaza los pushes directos (GH013) y bloquea la fusión de PRs con el check rojo (verificado con el PR #1). Cualquier cambio pasa por **rama → PR → CI verde → merge**. El flujo completo está documentado en `docs/MANTENIMIENTO.md` §4.

## Búsqueda, progreso local y prefetch

### Búsqueda (Pagefind)

- **Cómo se genera**: `npm run build` ejecuta `astro build` y después `npm run pagefind` (Pagefind sobre `dist/`, configurado en `pagefind.yml` con `site: dist`). El índice resultante vive en `dist/pagefind/` y se sirve como ficheros estáticos desde el CDN; no hay servidor ni base de datos.
- **Cómo se actualiza**: solo con volver a compilar (el índice se regenera en cada build, así que toda página nueva con `data-pagefind-body` queda incluida). Si necesitas regenerarlo sin compilar: `npm run pagefind`. `npm run pagefind:check` valida que el índice existe, no está vacío, coincide exactamente con las páginas marcadas y que la 404 queda fuera; forma parte de `npm run build:deploy`.
- **Qué se indexa**: el contenido de lecciones y módulos (`data-pagefind-body` en el `<article>` de la lección y en el cuerpo del módulo). Quedan fuera la 404, la home, los niveles, el mapa, la propia página de búsqueda y cualquier zona con `data-pagefind-ignore` (cabecera, pie, migas, barra lateral, prev/next, bloque de progreso).
- **Interfaz**: `/buscar/` con una capa propia sobre la API de Pagefind: resultados con título, extracto y enlace, y estados de ocioso, cargando, sin resultados y error. En `astro dev` no existe el índice (se genera al compilar) y la página muestra el estado de error; para probar la búsqueda, compila y usa `npm run preview`.

### Progreso local

- Solo `localStorage` (clave `hep.progreso.v1`), con identificadores de lecciones: sin cuentas, sin analítica, sin backend y **sin datos personales**; nunca se envía nada al servidor. La interfaz lo explica en la casilla de la lección.
- El HTML estático no afirma progreso (resumen «—», marcas ocultas): se pinta en el navegador. Si `localStorage` no está disponible o falla, los resúmenes indican «No disponible en este navegador» y los guardados fallidos revierten la casilla con un aviso.

### Prefetch

- `prefetch: true` en `astro.config.mjs` y `data-astro-prefetch` **solo en los enlaces de lección** (anterior/siguiente, barra lateral y lista del módulo). La estrategia por defecto «hover» descarga bajo intención del usuario, no hay precargas en el HTML inicial y, en conexiones lentas o con ahorro de datos, Astro cae a la estrategia «tap».

## Despliegue

Sitio publicado en **Cloudflare Workers (assets estáticos)**, conectado por Git al repositorio (producción desde `main`): **https://harness-engineering-platform.raul-ferrer-caio.workers.dev**. La configuración de despliegue vive en el repo (`wrangler.jsonc`: assets `./dist` + página `404.html`). Valores verificados el 20-10-2026 (detalle y gate en `IMPLEMENTATION_PLAN.md` §8 y §8.5):

| Campo                | Valor                                                                            |
| -------------------- | -------------------------------------------------------------------------------- |
| Tipo de proyecto     | Workers con assets estáticos (Git integration; deploy vía `npx wrangler deploy`) |
| Rama de producción   | `main`                                                                           |
| Install command      | `npm ci` (instalación automática con `package-lock.json`)                        |
| Build command        | **`npm run build:deploy`** (corregido en el panel el 20-10-2026)                 |
| Deploy command       | `npx wrangler deploy` (usa `wrangler.jsonc`: `./dist` + `404-page`)              |
| Node                 | `24.22.0` vía `.nvmrc`/`.node-version`                                           |
| Variables de entorno | Ninguna obligatoria. **Sin secretos**                                            |

**Incidencia resuelta (20-10-2026)**: con `wrangler.jsonc` en el repo y el build command corregido a `npm run build:deploy`, el despliegue publica los 162 ficheros de `dist/` (incluido `pagefind/`) y la 404 responde con la página del sitio (`IMPLEMENTATION_PLAN.md` §8.4).

Pasos completados por el usuario (20-10-2026): protección de `main` activa (ruleset «Comprobaciones y compilación») y prueba de fallo deliberada verificada (PR con check rojo no fusionable, rama borrada). El ruleset **rechaza además los pushes directos a `main`** (GH013): a partir de ahora todo cambio pasa por **PR con CI verde**. El 21-10-2026 se completó la **verificación en navegador** (buscador con resultados en vivo, progreso persistente en `localStorage`, 404 con contenido y navegación atrás/adelante): **H5 cerrado**.

## Documentación del proyecto

| Documento                | Contenido                                                |
| ------------------------ | -------------------------------------------------------- |
| `VISION.md`              | Qué construir y principios del proyecto.                 |
| `AGENTS.md`              | Reglas de trabajo del agente.                            |
| `TECH_STACK.md`          | Decisiones tecnológicas.                                 |
| `IMPLEMENTATION_PLAN.md` | Plan de implementación y verificación de versiones.      |
| `CURRICULUM.md`          | Mapa completo del currículum y formato de las lecciones. |
| `docs/MANTENIMIENTO.md`  | Ejecución, despliegue y mantenimiento del proyecto.      |
| `docs/AUDITORIA_A11Y.md` | Auditoría de accesibilidad y checklist firmada (H6).     |
