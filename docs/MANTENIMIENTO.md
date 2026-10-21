# Ejecución y mantenimiento

Guía operativa del proyecto: cómo desarrollar, verificar, desplegar y mantener
Harness Engineering Platform. Complementa a `README.md` (visión rápida) y a
`IMPLEMENTATION_PLAN.md` (decisiones y registro histórico). Actualizada en el
hito H6 (21-10-2026).

## 1. Requisitos

- **Node 24.22.0** (fijado en `.nvmrc` y `.node-version`; CI y Cloudflare lo leen de ahí). Con `nvm`: `nvm use`.
- npm incluido con Node (el proyecto se instala con `npm ci`, nunca con instalaciones globales).
- Git y una cuenta de GitHub con acceso al repositorio `raulferrer-ai/harness-engineering-platform`.
- Cuenta de Cloudflare con acceso al proyecto `harness-engineering-platform` ( Workers + assets estáticos).

No hay otros servicios, bases de datos, variables de entorno ni credenciales: el sitio es estático y el build no necesita secretos.

## 2. Desarrollo local

```bash
npm ci              # instalación reproducible desde package-lock.json
npm run dev         # servidor de desarrollo de Astro (HMR)
npm run preview     # sirve dist/ en local (build previo: npm run build)
```

Rutas útiles en local: `/`, `/curriculo/`, `/curriculo/n0/m1/` (módulo),
`/curriculo/n0/m1/l01-que-es-programar/` (lección), `/buscar/`, `/proyecto/`,
`/enfoque/`, `/glosario/`. Cualquier ruta inexistente sirve la 404 del sitio.

## 3. Comprobaciones (el «gate»)

El gate completo es **`npm run build:deploy`**; es lo que ejecuta el CI de
GitHub y lo que Cloudflare ejecuta en cada despliegue (paridad total):

| Comando                  | Qué verifica                                                          |
| ------------------------ | --------------------------------------------------------------------- |
| `npm run check`          | Tipos de TypeScript contra los `.astro` (astro check)                 |
| `npm run lint`           | ESLint (src, tests, config; `src/scripts` con globals de navegador)   |
| `npm run format:check`   | Formato Prettier                                                      |
| `npm test`               | Vitest (unitarias de lógica de contenido, progreso, etc.)             |
| `npm run links`          | Enlaces internos en `dist/**/*.html` (rutas rotas = fallo)            |
| `npm run pagefind:check` | Utilidad del índice de Pagefind (presente, coherente, 404 fuera)      |
| `npm run build:deploy`   | **Todo lo anterior** + `astro build` + Pagefind (build de producción) |

Flujo local recomendado antes de un PR:

```bash
npm run format   # formatea (write)
npm run build:deploy   # gate completo (sale != 0 si algo falla)
```

`npm run verify` (= check + lint + format:check + test) es el subconjunto rápido
sin build; `npm run build:deploy` lo incluye, así que no hace falta ejecutarlos
ambos.

## 4. Flujo de cambios (obligatorio)

`main` está protegida por una **ruleset de GitHub** («Comprobaciones y
compilación»): los pushes directos a `main` se rechazan (GH013) y los PRs no
fusionan con el check en rojo. El flujo es siempre:

```bash
git switch -c docs/nombre-del-cambio   # o feature/…, fix/…
# …ediciones…
npm run format && npm run build:deploy # gate local
git add -A && git commit -m "tipo: descripción corta"
git push -u origin rama
```

1. Abrir PR contra `main` (desde la URL que sugiere GitHub tras el push).
2. Esperar el check **«Comprobaciones y compilación»** en verde.
3. Fusionar (squash o merge según preferencia) y borrar la rama (remota y local).

Convención de commits: imperativo, en español, prefijo del ámbito
(`docs:`, `fix:`, `feat:`, `chore:`). La identidad de autoría se configura **solo
en el repositorio** (`git config --local user.name/user.email`); nunca en
`~/.gitconfig` compartida.

Cloudflare publica automáticamente desde `main` tras el merge (ver §5). En PRs,
el bot «Deploying Preview» intenta un preview de rama; si el CI está en rojo, el
build del preview falla igualmente y no se publica nada (comportamiento
verificado el 20-10-2026).

## 5. Despliegue y verificación en producción

- **Proyecto**: Cloudflare Workers `harness-engineering-platform` conectado al repo (rama `main`).
- **Build command**: `npm run build:deploy` (gate completo; no usar `npm run build` a secas).
- **Node**: 24.22.0 detectado desde `.nvmrc` en la imagen de build.
- **Configuración de assets**: `wrangler.jsonc` en la raíz del repo (fuente de verdad): `assets.directory: ./dist` y `not_found_handling: "404-page"` (las rutas inexistentes devuelven la 404 del sitio con status 404). Editar ese fichero, no el panel.
- **URL**: `https://harness-engineering-platform.raul-ferrer-caio.workers.dev`.

Comprobación posterior a cada merge (checklist):

1. Actions de GitHub: ejecución en `main` en verde.
2. `curl -s -o /dev/null -w "%{http_code}" https://harness-engineering-platform.raul-ferrer-caio.workers.dev/` → `200`.
3. `curl -s -o /dev/null -w "%{http_code}" https://harness-engineering-platform.raul-ferrer-caio.workers.dev/pagefind/pagefind.js` → `200` (búsqueda desplegada).
4. Ruta inventada (p. ej. `/no-existe/`) → `404` con contenido (no vacía).
5. Opcional: abrir `/buscar/` en el navegador y confirmar resultados en vivo.

Si el despliegue falla, el primer sitio a mirar es el log de build del proyecto
(debe ejecutar `npm ci`, Node 24.x y el gate completo) y después `wrangler.jsonc`.

## 6. Añadir contenido (lecciones, módulos, niveles)

El contenido vive en `src/content/` y se valida con los esquemas de
`src/lib/schemas.ts` (declarados en `src/content.config.ts`):

| Colección     | Carpeta                              | Ficheros                        |
| ------------- | ------------------------------------ | ------------------------------- |
| `niveles`     | `src/content/niveles/`               | `n*.md` (frontmatter del nivel) |
| `modulos`     | `src/content/modulos/<nivel>/<mod>/` | `index.mdx`                     |
| `lecciones`   | …/`lecciones/`                       | `lNN-titulo.md(x)`              |
| `glosario`    | `src/content/glosario/`              | entradas `*.md`                 |
| `referencias` | `src/content/referencias/`           | `*.md(x)`                       |
| `proyecto`    | `src/content/proyecto/`              | fases `*.md`                    |

Pasos para publicar una lección nueva:

1. Crear el MDX siguiendo la plantilla y el orden de secciones de `CURRICULUM.md` (§ «Formato de una lección»); el frontmatter debe pasar el esquema (`schemaLeccion`).
2. Añadirla al índice de su módulo (`index.mdx`) si el módulo lista las lecciones.
3. `npm run build:deploy`: el build regenera las rutas **y el índice de Pagefind** (la búsqueda la incluye automáticamente; `pagefind:check` verifica que la página nueva quedó indexada).

Niveles o módulos sin lecciones publicadas se muestran como «Sin lecciones
publicadas» (comportamiento previsto, no es un error).

## 7. Mantenimiento rutinario

- **Dependencias**: `npm outdated`; actualizar con criterio (patch/minor tranquilamente, majors revisando changelog y `npm run build:deploy` en PR). El lockfile viaja en el repo: siempre `npm ci` tras cambiar dependencias.
- **Node**: al salir un LTS mayor, valorar el bump en `.nvmrc` + `.node-version` + `engines` (las tres vías, en un solo PR, verificando que Cloudflare lo toma del `.nvmrc`).
- **Enlaces y frescura**: el gate ya cubre enlaces internos e índice de búsqueda en cada PR; no hay cron ni trabajo programado (el sitio es estático y no tiene backend).
- **Auditoría a11y**: la primera quedó firmada en `docs/AUDITORIA_A11Y.md` (hito H6). Repetirla al añadir componentes de UI nuevos o cambiar la paleta: Lighthouse (categoría accessibility) sobre páginas representativas + la checklist manual de ese documento.
- **Contraste de la paleta**: los tokens de color están en `src/styles/global.css` (`@theme`). Si se toca `--color-ink-faint`, `--color-ink-soft` o el tema de Shiki, recalcular el ratio WCAG sobre **paper, surface y accent-soft** (el registro de ratios está en el propio CSS y en `docs/AUDITORIA_A11Y.md`).
- **Limpieza local**: `dist/`, `.astro/` y `node_modules/` son regenerables y están en `.gitignore`. El preview de Astro se detiene con `npx astro preview stop`.

## 8. Solución de problemas frecuentes

| Síntoma                                              | Causa probable y solución                                                                             |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm ci` falla por versión de Node                   | Node distinto al `.nvmrc`; `nvm use` y reintentar                                                     |
| El build pasa local y falla en CI                    | Normalmente, fichero nuevo sin formatear o dependencia no fijada en el lockfile                       |
| `pagefind:check` falla tras añadir contenido         | La página nueva no tiene `data-pagefind-body` (se aplica desde el layout de lección/página)           |
| PR no fusiona con «Required status check … expected» | El check «Comprobaciones y compilación» sigue en rojo o pendiente; esperar o ver Actions              |
| Push a `main` rechazado con GH013                    | Comportamiento esperado: la ruleset exige PR con CI verde                                             |
| Despliegue nuevo no se ve / 404 vacía                | Revisar log de build de Cloudflare y `wrangler.jsonc` (`not_found_handling`)                          |
| Búsqueda rota en producción                          | `/pagefind/pagefind.js` no responde 200: el build no corrió Pagefind o `dist/pagefind` no se desplegó |

## 9. Alcance operativo (lo que el proyecto NO tiene)

Por diseño (`VISION.md`): sin autenticación, sin backend, sin base de datos, sin
cookies ni analítica, sin SSR, sin funciones serverless, sin pagos y sin
dominio de pago. Cualquier propuesta que añada uno de estos elementos requiere
revisar `VISION.md` e `IMPLEMENTATION_PLAN.md` antes de implementarla.
