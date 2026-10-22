# Harness Engineering Platform

Academia online, gratuita y abierta, para aprender a desarrollar software asistido por inteligencia artificial: desde los fundamentos de programación hasta Harness Engineering y sistemas multiagente.

**Estado actual: hitos H0–H18 completados** — scaffolding, sistema de diseño, sistema de contenidos, los **siete módulos completos** del nivel `n0` (las 7 lecciones de `n0/m1`, las 7 de `n0/m2` «Tipos, variables y funciones», las 7 de `n0/m3` «Control de flujo y estructuras de datos», las 7 de `n0/m4` «Estructura de proyectos y dependencias», las 7 de `n0/m5` «Control de versiones con Git» y las 7 de `n0/m6` «Pruebas y depuración» y las 7 de `n0/m7` «Fundamentos web: HTML, CSS y HTTP», con 102 ficheros en las siete carpetas `ejemplos/` — 12 + 15 + 17 + 21 + 9 + 13 + 15, incluido el mini-proyecto `proyecto/` de m4 con 3 módulos, manifiesto, lockfile y README — y 109 pruebas `node --test` en verde entre los módulos, más ejercicios verificados y rojos deliberados con su clase de error — de los **7 módulos** que CURRICULUM.md §3 define para `n0`; con `n0/m7` publicado, el nivel `n0` y la fase `f1` del proyecto longitudinal quedan **completos**), **navegación lateral por módulo, búsqueda estática con Pagefind (`/buscar/`) y progreso local** (H4), **CI + despliegue en Cloudflare Workers con gate de rama activo** (H5, cerrado el 21-10-2026: CI verde en los 5 pushes a `main`, producción verificada con Pagefind y 404, ruleset que exige PR con CI verde, y verificación en navegador del buscador, progreso y navegación), **documentación de mantenimiento + auditoría de accesibilidad** (H6, cerrado el 21-10-2026: `docs/MANTENIMIENTO.md`, `docs/AUDITORIA_A11Y.md` con checklist firmada, Lighthouse accessibility **1.0 en 11 rutas** y 4 hallazgos corregidos) y **publicación de `n0/m2`, `n0/m3`, `n0/m4` y `n0/m5`** (H7, H8, H9 y H10, cerrados el 21-10-2026: 7 lecciones cada uno con la plantilla obligatoria, 15, 17, 21 y 9 ficheros de ejemplo ejecutados — 20, 28, 24 y 7 pruebas `node --test` en verde, con rojos deliberados con su clase de error verificada y casos rojos registrados en los tests de cobertura — y `tests/content/ejemplos.test.ts` ampliado con la cobertura de cada módulo) y **publicación de `n1/m1`** (H11, cerrado el 21-10-2026: 6 lecciones con la plantilla obligatoria y el primer módulo conceptual del currículo — «Cómo funcionan los modelos de código» — con 10 scripts ejecutables de **solo librería estándar** (sin dependencias, red ni claves), `nota-ejemplo.md`, 3 rojos deliberados —`TypeError` de la API inventada, ventana excedida y claim refutado, todos en `1`—, los 6 bloques de ejercicio ejecutados literalmente desde su carpeta, 12 fuentes verificadas con HTTP 200 y el entregable de nota técnica validado por `comprobar-nota.js`) y **publicación de `n0/m6`** (H12, cerrado el 21-10-2026: 7 lecciones —de elegir qué probar a componer el entregable— con 13 ficheros de ejemplo ejecutados: 10 verdes y 3 rojos deliberados —`AssertionError` sin mensaje, estado compartido entre pruebas y `TypeError` con traza, todos en `1`—, con la suite del entregable que cae en rojo con el bug de frontera y vuelve a verde sin él, y `tests/content/ejemplos.test.ts` ampliado con 12 tests más) y **publicación de `n0/m7`** (H13, cerrado el 21-10-2026: las 7 lecciones que cierran `n0` —de la anatomía HTML al entregable— con 15 ficheros de ejemplo ejecutados: la implementación compartida `web.js`, 8 demos verdes, 3 rojos deliberados —HTML sin estructura, CSS con declaración sin «:» y ruta inexistente, todos en `1`— y las 3 entradas `pagina/`, con la suite del entregable que cae en rojo con la página rota y vuelve a verde con la buena) y **publicación de `n1/m2`** (H14, cerrado el 22-10-2026: las 6 lecciones que enseñan a formular tareas —de la anatomía del encargo al entregable— con 18 ficheros de ejemplo ejecutados: 7 demos verdes con **solo librería estándar** (anatomía, contexto mínimo medido en palabras, criterios en rojo→verde, alcance, serie, validador y medición con ms reales), 4 rojos deliberados —tarea ambigua, contexto inflado, alcance excedido y serie rota, los cuatro en `1`— y 7 ficheros `tareas/` con las tres implementaciones de referencia, el borrador plausible y sus suites, más `tests/content/ejemplos.test.ts` ampliado con 13 tests) y **publicación de `n1/m3`** (H15, cerrado el 22-10-2026: las 6 lecciones que enseñan a revisar lo que el asistente entrega —del diff al informe de revisión— con 21 ficheros de ejemplo ejecutados: 6 demos verdes con **solo librería estándar** (dif LCS, suites de la entrega, dependencias declaradas contra usadas, batería de casos límite, checklist de 4 criterios con veredicto e informe sobre las 3 entregas), 5 rojos deliberados —entrega que no carga, prosa refutada, dependencia sobrante, caso límite que devuelve basura en silencio y la entrega rota ejecutada directamente, los cinco en `1`— y el fixture `entregas/` con las tres entregas en versiones antes/después, sus suites y su manifiesto declarado, más `tests/content/ejemplos.test.ts` ampliado con 16 tests) y **publicación de `n1/m4`** (H16, cerrado el 22-10-2026: las 6 lecciones que enseñan a trabajar con asistente sin perder el control —del mapa de superficies al entregable— con 17 ficheros de ejemplo ejecutados: 6 demos verdes con **solo librería estándar** (anatomía de la sesión, análisis de chat, parches con Keep/Undo, lista permitida de comandos, comprobador reejecutable del registro y veredicto del entregable), 4 rojos deliberados —chat sin comando, parche roto, comando fuera de la lista y registro que declara «verificada» con código 1, los cuatro en `1`— y el fixture `sesiones/` con el registro de 5 sesiones, la transcripción de chat y el mini-proyecto con sus suites, más `tests/content/ejemplos.test.ts` ampliado con 14 tests) y **publicación de `n1/m5`** (H17, cerrado el 22-10-2026: las 6 lecciones que enseñan a convertir convenciones en reglas ejecutables —de la declaración al entregable certificado— con 16 ficheros de ejemplo ejecutados: 6 demos verdes con **solo librería estándar** y git local (presentador de convenciones, runner que decide con `0`/`1`, rojos esperados en variantes rotas, pre-commit instalado en repos temporales, validador de deriva y certificador del entregable), 4 rojos deliberados —proyecto infractor ante el runner, commit bloqueado por el hook, regla declarada sin comprobación y comprobación sin regla declarada, los cuatro en `1`— y el fixture `proyecto/` con las 4 reglas declaradas e implementadas y sus 6 pruebas, más `tests/content/ejemplos.test.ts` ampliado con 15 tests) y **publicación de `n1/m6`** (H18, cerrado el 22-10-2026: las 6 lecciones que cierran `n1` —de la anatomía del fallo al entregable certificado— con 15 ficheros de ejemplo ejecutados: 6 demos verdes con **solo librería estándar** y sin red (presentador de patrones, verificador de APIs offline con controles reales, ejecutor de casos límites, comparador manifiesto/lock, runner que decide con `0`/`1` y certificador del entregable), 4 rojos deliberados —`TypeError` de API aprobada sin verificar, `AssertionError` de caso límite, `ERR_MODULE_NOT_FOUND` de paquete inventado y fallo declarado sin comprobación con el runner en `1`, los cuatro en `1`— y el fixture `fallos/` con la colección personal de 10 fallos en 3 tipos y `proyecto/` con 5 dependencias declaradas y 2 resueltas en el lock, más `tests/content/ejemplos.test.ts` ampliado con 17 tests). Con `n1/m6` publicado, el nivel `n1` queda **completo**. El mapa navegable en `/curriculo/` (9 niveles y 56 módulos) suma **154 páginas** (incluida `/buscar/`), el gate `npm run verify` supera **261 tests**, `npm run build:deploy` valida además enlaces internos (**5176 OK**) e índice de búsqueda (**141 páginas** indexadas por Pagefind).

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
- **Estado (21-10-2026)**: el workflow **ya se ha ejecutado en GitHub 20 veces** (18 verdes y 2 rojas: una **a propósito** como prueba del gate, en el PR #1, y la del PR #8 de H10, causada por el test no portable de las marcas de rama y corregida en `acfe752` — detalle en `IMPLEMENTATION_PLAN.md` §10.10). La exigencia de «CI verde antes de publicar» está **activa y verificada**: una ruleset sobre `main` rechaza los pushes directos (GH013) y bloquea la fusión de PRs con el check rojo (verificado con el PR #1). Cualquier cambio pasa por **rama → PR → CI verde → merge**. El flujo completo está documentado en `docs/MANTENIMIENTO.md` §4.

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
