# Plan de implementación — Harness Engineering Platform

Estado: **hitos H0–H4 completados** (19 de octubre de 2026) y **H5 completado** (cierre el 21-10-2026): repositorio `https://github.com/raulferrer-ai/harness-engineering-platform` con **CI verde en los cinco pushes a `main`** (`9d16d60`, `68d2d4e`, `7acd50b`, `e71d010` y el merge `c3e29ad`) y en el PR #2, y sitio **desplegado y verificado** en `https://harness-engineering-platform.raul-ferrer-caio.workers.dev` (proyecto tipo Workers con assets estáticos, §8.2 y D34; versión `cef5718d`: 162 assets incluido `pagefind/`, rutas inexistentes con 404 con contenido y build command `npm run build:deploy` con gate completo; incidencias cerradas el 20-10-2026, §8.4 y §10.5). **Gate de rama activo y verificado** (ruleset «Comprobaciones y compilación» sobre `main` + prueba de fallo deliberada: PR con check rojo no fusionable; §8.4 y §8.5, 20-10-2026). **Verificación en navegador completada** el 21-10-2026 (§8.4, punto 8). **H6 completado** el 21-10-2026: documentación de ejecución y mantenimiento (`docs/MANTENIMIENTO.md`) y auditoría a11y con checklist firmada (`docs/AUDITORIA_A11Y.md`): accessibility **1.0 en 11 rutas** con Lighthouse, 4 hallazgos corregidos (contraste de `--color-ink-faint`, contraste de comentarios de código, foco del skip link y estructura de listas); §10.6. **H7 completado** el 21-10-2026: segundo módulo del nivel `n0` publicado (`n0/m2` «Tipos, variables y funciones»: 7 lecciones con la plantilla de §6, 15 ficheros de ejemplo ejecutados y 20 pruebas `node --test` en verde; §10.7). **H8 completado** el 21-10-2026: tercer módulo del nivel `n0` publicado (`n0/m3` «Control de flujo y estructuras de datos»: 7 lecciones, 17 ficheros de ejemplo ejecutados con 28 pruebas `node --test` en verde y el script `demo-informe.js` que procesa un fichero real; §10.8). **H9 completado** el 21-10-2026: cuarto módulo del nivel `n0` publicado (`n0/m4` «Estructura de proyectos y dependencias»: 7 lecciones, 21 ficheros que incluyen el mini-proyecto `proyecto/` con 3 módulos, manifiesto, lockfile generado y README validado, 24 pruebas `node --test` en verde; §10.9). **H10 completado** el 21-10-2026: quinto módulo del nivel `n0` publicado (`n0/m5` «Control de versiones con Git»: 7 lecciones, 9 ficheros de ejemplo ejecutados con la suite `flujo-completo.test.js` de 7 pruebas `node --test` en verde y 2 rojos deliberados —conflicto de fusión y push rechazado—; §10.10). **H11 completado** el 21-10-2026: primer módulo del nivel `n1` publicado (`n1/m1` «Cómo funcionan los modelos de código»: 6 lecciones con la plantilla de §6, 10 scripts ejecutables con solo librería estándar más `nota-ejemplo.md`, 3 rojos deliberados —API inventada con `TypeError`, ventana excedida y claim refutado, todos en `1`— y el entregable del módulo validado por `comprobar-nota.js`; §10.11). **Corrección de alcance en H11** (hallazgo del usuario): `n0` define **7 módulos** en CURRICULUM.md §3 y solo 5 tienen contenido — `n0/m6` y `n0/m7` existen como fichas sin lecciones —, por lo que ni `n0` ni la fase `f1` están completos (§10.10 y §10.11); **H12 completado** el 21-10-2026: sexto módulo del nivel `n0` publicado (`n0/m6` «Pruebas y depuración»: 7 lecciones con la plantilla de §6 y 13 ficheros de ejemplo ejecutados —10 verdes y 3 rojos deliberados con clase, mensaje y código reales—; §10.12). **H13 completado** el 21-10-2026: séptimo y último módulo del nivel `n0` publicado (`n0/m7` «Fundamentos web: HTML, CSS y HTTP»: 7 lecciones con la plantilla de §6 y 15 ficheros de ejemplo ejecutados —8 demos verdes con la implementación compartida `web.js`, 3 rojos deliberados con mensaje, línea y código reales y 3 entradas `pagina/`—; §10.13); con él, el nivel `n0` y la fase `f1` quedan **completos** (corrección de alcance de H11 cerrada) y se retoma `n1/m2`. **H14 completado** el 22-10-2026: segundo módulo del nivel `n1` publicado (`n1/m2` «Tareas pequeñas: instrucciones y contexto mínimo»: 6 lecciones con la plantilla de §6 y 18 ficheros de ejemplo ejecutados —7 demos verdes con solo librería estándar, 4 rojos deliberados con sus incidencias y códigos reales y 7 ficheros `tareas/` con las tres implementaciones de referencia, el borrador plausible y sus suites—; §10.14). El proyecto compila y supera el gate `npm run build:deploy` (que incluye `npm run links` y la comprobación del índice de Pagefind).
Fecha de verificación de versiones: **19 de octubre de 2026** (fuentes: registro de npm, documentación de Astro, documentación de Cloudflare).

Documentos relacionados: `VISION.md` (qué construir), `TECH_STACK.md` (decisiones tecnológicas ya tomadas), `AGENTS.md` (reglas de trabajo), `CURRICULUM.md` (mapa del contenido).

---

## 1. Verificación de compatibilidad del stack

El stack está decidido (Astro, TypeScript, Markdown/MDX, Tailwind CSS, GitHub, Cloudflare Pages). No se reelige: se comprueba que las versiones estables actuales de esas mismas tecnologías son compatibles entre sí.

### 1.1 Versiones estables verificadas hoy

| Tecnología | Versión estable verificada | Compatibilidad comprobada |
| --- | --- | --- |
| Astro | 7.4.0 | Requiere Node `>=22.22.0` y npm `>=9.6.5`. Trae Vite 8.3.4 empaquetado. |
| @astrojs/mdx | 8.1.0 | Peer: `astro ^7.2.10` ✔ compatible con Astro 7.4.0. |
| @astrojs/sitemap | 3.7.4 | Desarrollado y probado contra Astro 7.2.10 ✔. |
| Tailwind CSS | 4.3.3 | Se integra mediante `@tailwindcss/vite` 4.3.3, cuyo peer es `vite ^5.2 \|\| ^6 \|\| ^7 \|\| ^8` ✔ (Astro 7 usa Vite 8). |
| TypeScript | 6.0.3 (fijado) | `@astrojs/check` 0.9.10 declara peer `typescript ^5 \|\| ^6`. La última versión general es 7.0.2, **no** compatible con el tooling de tipos de Astro. |
| @astrojs/check | 0.9.10 | Verificación de tipos de `.astro` ✔. |
| ESLint | 10.13.0 | `eslint-plugin-astro` 3.2.1 declara peer `eslint >=10` ✔. |
| eslint-plugin-astro | 3.2.1 | Requiere Node `^22.22.3 \|\| ^24.16.0 \|\| >=26.3.0` ✔ con Node 24 LTS. |
| Prettier | 3.9.10 | `prettier-plugin-astro` 1.1.1 declara peer `prettier ^3.5.3` ✔. |
| prettier-plugin-astro | 1.1.1 | Además satisface el peer de `@astrojs/language-server` (`>=0.11.0`) ✔. |
| Vitest | 5.0.5 | Peer `vite ^6.4 \|\| ^7 \|\| ^8` ✔; Node `^22.12 \|\| ^24 \|\| >=26` ✔. |
| Pagefind | 1.5.2 | Índice de búsqueda estático post-compilación; `@pagefind/default-ui` 1.5.2. Binario disponible para `linux-x64` (imagen de build de Pages) ✔. |
| Node.js (runtime) | 24.22.0 (LTS, fijado) | Satisface a la vez Astro (`>=22.22`), eslint-plugin-astro (`^24.16`) y Vitest (`^24`). |
| GitHub Actions | `actions/checkout@v7` (7.0.1), `actions/setup-node@v7` (7.1.0) | Versiones actuales verificadas ✔. |

### 1.2 Compatibilidad cruzada: resultado

- **Astro 7 + Tailwind 4**: compatibles vía `@tailwindcss/vite` (plugin Vite con peer `^8`). La integración `@astrojs/tailwind` está obsoleta según la documentación de Astro y **no** se instala.
- **Astro 7 + MDX**: `@astrojs/mdx` 8.1.0 es la pareja correcta para Astro 7.
- **Astro 7 + TypeScript**: el tooling de Astro (`@astrojs/check` / language server) todavía no admite TypeScript 7; hay que fijar 6.0.3.
- **Astro 7 + Vite 8**: Vite va empaquetado en Astro; los plugins Vite de terceros deben declarar soporte de `^8`. `@tailwindcss/vite` lo declara ✔.
- **Astro 7 + Cloudflare Pages**: salida 100 % estática (`dist/`), sin adaptador ni Functions. La imagen de build v3 de Pages trae Node **22.16.0 por defecto**, por debajo del mínimo de Astro 7 (22.22.0): hay que fijar la versión de Node (ver 1.3).

### 1.3 Ajustes mínimos estrictamente necesarios

Ninguno cambia las decisiones de `TECH_STACK.md`; son requisitos de compatibilidad:

1. **Fijar Node 24.22.0** en `.nvmrc`, `.node-version`, `engines` de `package.json` y variable `NODE_VERSION` en Cloudflare Pages. Motivo: la imagen de build de Pages trae Node 22.16.0 y Astro 7 exige `>=22.22.0`.
2. **Fijar TypeScript 6.0.3** (no 7.x). Motivo: peer de `@astrojs/check`. Se revisará cuando el tooling de Astro admita TS 7.
3. **Tailwind 4 se integra con `@tailwindcss/vite`**, no con `@astrojs/tailwind` (obsoleto). CSS-first: sin `tailwind.config.js`, tokens en `src/styles/global.css` con `@theme`.
4. **Procesador Markdown por defecto (Sätteri)**: Astro 7 ya no incluye la cadena remark/rehype por defecto. Primera fase sin plugins remark/rehype. Si algún día hacen falta (anclajes de encabezados, enlaces externos, matemáticas), habrá que instalar `@astrojs/markdown-remark` y declarar `markdown.processor: unified()`. Decisión pospuesta (sección 11).
5. **HTML más estricto (compilador Rust de Astro 7)**: las etiquetas sin cerrar ahora son error de compilación; conviene una regla de revisión de plantillas.
6. **`compressHTML` pasa a `'jsx'` por defecto**: puede eliminar espacios entre elementos inline en plantillas. Se mantiene el valor por defecto y se añade una regla de revisión visual; si aparece algún caso, se cambia a `compressHTML: true` como decisión explícita y documentada.
7. **`src/fetch.ts` es un nombre reservado** en Astro 7 (enrutado avanzado): se evita usarlo como nombre de fichero propio.
8. **`SITE_URL` como variable pública opcional** para `site` de Astro (canonical, sitemap, OG). No es un secreto.
9. **Instalación con verificación de `engines`**: `.npmrc` con `engine-strict=true`, de modo que `npm install` falla con un mensaje claro si se usa una versión de Node fuera del rango soportado. En máquinas que usan Volta, `package.json` incluye además el campo `volta.node` (24.22.0) para que el proyecto seleccione esa versión automáticamente; `.nvmrc` y `.node-version` siguen siendo la referencia para nvm, CI y Cloudflare Pages.

---

## 2. Arquitectura de Astro y estructura de rutas

### 2.1 Principios arquitectónicos

- Renderizado **100 % estático** (`output: 'static'`, valor por defecto): sin adaptador, sin Functions, sin base de datos, sin autenticación.
- El contenido educativo vive **separado de la lógica** (`src/content/` frente a `src/pages/`, `src/components/`, `src/lib/`).
- Toda la interactividad se resuelve con JavaScript nativo ligero en el cliente; React solo si aparece una necesidad real que lo justifique (pospuesto, sección 11).
- Todo lo que se pueda comprobar en compilación (tipos, lint, esquemas de contenido, enlaces) se comprueba antes de publicar.

### 2.2 Estructura de directorios prevista

```
/
├── .nvmrc                       # 24.22.0 (usado por local, CI y Cloudflare Pages)
├── .node-version                # mismo valor (doble seguridad)
├── package.json                 # scripts y engines
├── package-lock.json            # comprometido en Git (npm ci en CI/CD)
├── astro.config.mjs             # site, integraciones, plugins vite, compressHTML
├── tsconfig.json                # extiende astro/tsconfigs/strict
├── eslint.config.js             # ESLint 10 flat config + eslint-plugin-astro
├── .prettierrc.json / .prettierignore
├── vitest.config.ts
├── pagefind.yml                 # configuración del índice de búsqueda
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── _headers                 # cabeceras HTTP cuando se decida añadirlas
├── .github/workflows/ci.yml     # mismas comprobaciones que el despliegue
├── src/
│   ├── content.config.ts        # colecciones + esquemas (zod de Astro)
│   ├── styles/global.css        # Tailwind 4 (@import "tailwindcss"; @theme {...})
│   ├── content/                 # SOLO contenido (ver sección 3)
│   │   ├── niveles/
│   │   ├── modulos/<nivel>/<modulo>/index.mdx
│   │   ├── modulos/<nivel>/<modulo>/lecciones/*.mdx
│   │   ├── glosario/
│   │   ├── referencias/
│   │   └── proyecto/
│   ├── layouts/                 # BaseLayout, LevelLayout, ModuleLayout, LessonLayout
│   ├── components/
│   │   ├── ui/                  # primitivas del sistema de diseño
│   │   ├── content/             # Callout, Exercise, Solution, CodeBlock…
│   │   └── nav/                 # Header, Footer, Breadcrumb, Sidebar, PagerPrevNext
│   ├── lib/                     # lógica pura (orden, rutas, validación, progreso)
│   ├── pages/                   # rutas (ver 2.3)
│   └── scripts/                 # JS cliente embebido (progreso, búsqueda)
└── tests/
    ├── unit/                    # lógica pura
    ├── content/                 # reglas del currículo y frontmatter
    └── links/                   # enlaces internos del build
```

### 2.3 Mapa de rutas

Todas las rutas son estáticas y se generan con `getStaticPaths()` a partir de las colecciones. La jerarquía de URLs refleja la jerarquía del contenido.

| Ruta | Fichero | Origen de los datos |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | colección `niveles` (resumen) |
| `/curriculo/` | `src/pages/curriculo/index.astro` | `niveles` + `modulos` (mapa completo) |
| `/curriculo/[nivel]/` | `src/pages/curriculo/[nivel]/index.astro` | colección `niveles` |
| `/curriculo/[nivel]/[modulo]/` | `src/pages/curriculo/[nivel]/[modulo]/index.astro` | colección `modulos` |
| `/curriculo/[nivel]/[modulo]/[leccion]/` | `src/pages/curriculo/[nivel]/[modulo]/[leccion].astro` | colección `lecciones` |
| `/glosario/` y `/glosario/[term]/` | `src/pages/glosario/…` | colección `glosario` |
| `/referencias/` | `src/pages/referencias/index.astro` | colección `referencias` |
| `/proyecto/` | `src/pages/proyecto/index.astro` | colección `proyecto` (fases) |
| `/buscar/` (si la UI embebida no basta) | `src/pages/buscar/index.astro` | índice de Pagefind |
| `404` | `src/pages/404.astro` | estático |
| `/sitemap-index.xml` | `@astrojs/sitemap` | requiere `site` |
| `/robots.txt` | `public/robots.txt` | estático |

Convención de identificadores: niveles `n0`…`n8`, módulos `m1`…, lecciones `l01-…`, coherente con `CURRICULUM.md`.

### 2.4 Configuración clave de `astro.config.mjs`

- `site`: valor de `SITE_URL` (aún sin dominio: se usa la URL de preview o se deja pendiente hasta el paso de dominio propio).
- `integrations`: `mdx()` y, cuando haya `site` definitivo, `sitemap()`.
- `vite.plugins`: `[tailwindcss()]` de `@tailwindcss/vite`.
- `markdown`: sin plugins en la primera fase (procesador por defecto). Shiki para resaltado, con tema claro/oscuro.
- `compressHTML`: se deja el default `'jsx'` + regla de revisión (ajuste 1.3.6).
- No se usa `src/fetch.ts` (ajuste 1.3.7).

---

## 3. Organización de los contenidos Markdown/MDX

### 3.1 Colecciones (`src/content.config.ts`)

Cada colección se define con `defineCollection({ loader: glob({ pattern, base }) , schema })` y esquema zod. El esquema es la primera línea de validación: una lección sin objetivos, con orden duplicado o con nivel inexistente **no compila**.

| Colección | Patrón | Contenido |
| --- | --- | --- |
| `niveles` | `niveles/**/*.{md,mdx}` | Una página por nivel del itinerario (`n0`…`n8`): misión, prerrequisitos, módulos. |
| `modulos` | `modulos/**/index.mdx` | Índice de un módulo: objetivos, prerrequisitos, resultado entregable. |
| `lecciones` | `modulos/**/lecciones/*.mdx` | Lección individual (formato de la sección 3.3). |
| `glosario` | `glosario/**/*.md` | Término, definición corta, enlaces a lecciones. |
| `referencias` | `referencias/**/*.md` | Fuentes, estándares y lecturas con fecha de consulta. |
| `proyecto` | `proyecto/**/*.mdx` | Fases del proyecto longitudinal. |

**Implementado en H2.** Detalle relevante (decisión D20, §10.2): los patrones de la tabla son relativos a `src/content`, pero el loader `glob` necesita `base` **apuntando a la carpeta propia de cada colección** (`./src/content/niveles`, …). Si `base` apuntara a `src/content`, los `id` saldrían como `niveles/n0` y las rutas dinámicas `getStaticPaths()` se romperían. Los esquemas viven en `src/lib/schemas.ts` (importando `z` de `astro/zod`, el mismo módulo que reexporta `astro:content`, D19). Las colecciones `glosario`, `referencias` y `proyecto` se declaran con su esquema en H2 pero **sin ficheros ni rutas todavía** (D16).

### 3.2 Metadatos comunes (frontmatter)

**Implementado en H2** (esquemas en `src/lib/schemas.ts`; decisiones D2–D6 de §10.2). Por tipo de unidad:

- **Niveles**: `titulo`, `pregunta`, `mision`, `prerrequisitos` (ids de nivel; vacío en `n0`), `criterio`, `actualizado`. La lista de módulos **no** es frontmatter: se deriva de la colección `modulos`; el orden se deriva del id `nN`.
- **Módulos**: `titulo`, `nivel`, `modulo`, `objetivos` (1–6; el objetivo único de CURRICULUM.md §3 se carga como lista de uno), `entregable` (obligatorio: es la prueba del módulo), `prerrequisitos`, `tags`, `actualizado`. Sin `resumen` (la página usa `objetivos[0]`), sin `orden` (se deriva de `mK`) y sin `dificultad`/`tiempoEstimado`/`tipo` (el currículo no los define por módulo: forzarlos obligaría a inventar datos).
- **Lecciones**: `titulo`, `resumen` (1–2 frases, también meta descripción), `nivel`, `modulo`, `orden` (entero, único dentro del módulo y base de «anterior/siguiente»), `dificultad` (`inicial|intermedio|avanzado|experto`), `tiempoEstimado` (minutos), `objetivos` (3–6 observables), `prerrequisitos`, `tags`, `actualizado`, `fuentes` (URL + fecha de consulta, opcional), `tipo` (`leccion|laboratorio|ejercicio`, por defecto `leccion`).

Campos con valor por defecto (opcionales al escribir): `prerrequisitos`, `tags` y, en lecciones, `tipo`. Identidad de unidad para `prerrequisitos` (D9): `nN`, `nN/mK` o `nN/mK/lNN-slug` (la ruta bajo `/curriculo/`, independiente de la carpeta física `lecciones/`).

Reglas adicionales validadas por tests de currículo (no solo por zod): los `prerrequisitos` deben existir como unidad, el `orden` no puede repetirse dentro de un módulo y debe coincidir con el prefijo `lNN` del fichero, la ruta del fichero debe coincidir con `nivel`/`modulo` del frontmatter, ningún módulo puede quedar huérfano de nivel, las rutas generadas deben ser únicas, y cada lección debe declarar al menos un ejercicio (sección `## Ejercicio` en el cuerpo) o ser de `tipo: laboratorio`.

### 3.3 Formato de una lección

MDX con componentes ligeros importados desde `src/components/content/`. Secciones obligatorias, en este orden:

1. Título (H1, único) y resumen.
2. **Objetivos de aprendizaje** (3–6, observables).
3. **Respuesta corta** al problema de la lección (útil para citación y repaso).
4. Conceptos, con ejemplos de código ejecutables y comprobables.
5. **Ejercicio** (enunciado, criterios de verificación, pista).
6. **Solución explicada** (por qué funciona, alternativas, errores típicos).
7. **Cómo verificarlo** (comandos concretos que el alumno ejecuta).
8. Errores comunes / trampas.
9. Fuentes (con fecha de consulta) y siguientes pasos.

**Reparto en la plantilla de página (D10, H2)**: el H1, la entradilla (`resumen`) y la sección «Objetivos de aprendizaje» los aporta la página desde el frontmatter; el cuerpo MDX empieza en «Respuesta corta». Así la página renderiza el orden 1→9 de esta plantilla sin duplicar H1 ni objetivos (jerarquía de encabezados sin saltos, CURRICULUM.md §11). La sección «Siguientes pasos» no enlaza a lecciones aún no publicadas: las menciona como próximas.

MDX se usa cuando la lección necesita componentes (ejercicios con pestañas, diagramas, llamadas). Las lecciones sin componentes pueden ser `.md` puro.

### 3.4 Separación contenido/lógica

- `src/content/` no importa nada de `src/components/` salvo componentes MDX declarados en la plantilla (`components` prop de `LessonLayout`).
- `src/lib/` no importa contenido: opera sobre datos ya tipados (`getCollection`), lo que permite testearlo con Vitest sin compilar el sitio.
- Los ejemplos de código de las lecciones viven en el propio MDX o en `src/content/…/ejemplos/` cuando necesiten ejecutarse en tests.

---

## 4. Sistema de diseño y estrategia de componentes

### 4.1 Base

- **Tailwind CSS 4 (CSS-first)**: `@import "tailwindcss";` en `src/styles/global.css`, tokens con `@theme` (color, tipografía, espaciado, radios, sombras). Sin `tailwind.config.js`.
- Verificación obligatoria en el hito H0: que Tailwind 4 detecta automáticamente las clases en ficheros `.astro` y `.mdx`; si algún directorio queda fuera del escaneo, se añade `@source` explícito.
- Semántica HTML primero: `header`, `nav`, `main`, `article`, `aside`, `footer`, listas y heading hierarchy correctos.

### 4.2 Capas de componentes

| Capa | Ejemplos | Regla |
| --- | --- | --- |
| Tokens | `--color-*`, `--font-*`, `--space-*` en `@theme` | Única fuente de verdad visual. |
| Primitivas (`components/ui/`) | `Button`, `Badge`, `Card`, `Callout`, `Progress`, `Table` | Presentacionales, sin lógica de negocio, sin fetch. |
| Contenido (`components/content/`) | `Exercise`, `Solution`, `CodeBlock`, `Objectives`, `KeyTakeaways`, `SourceList` | Se usan dentro de MDX; props mínimas. |
| Navegación (`components/nav/`) | `SiteHeader`, `SiteFooter`, `Breadcrumb`, `ModuleSidebar`, `PrevNext`, `CurriculumMap` | Consumen datos de colecciones, no HTML crudo. |
| Plantillas (`src/layouts/`) | `BaseLayout`, `LevelLayout`, `ModuleLayout`, `LessonLayout` | Encargan head, SEO, nav global y slot de contenido. |

### 4.3 Componentes interactivos

- Preferencia por `.astro` + `<script>` nativo (progress bar de lectura, menú móvil, guardado de progreso en `localStorage`, UI de búsqueda).
- Ningún componente ejecuta código del visitante en el servidor; todo es cliente estático.
- Si aparece interactividad compleja (p. ej. editor con evaluación), se valorará `@astrojs/react` en su momento; queda fuera de la primera versión.

### 4.4 Accesibilidad y responsive (requisitos de aceptación)

- Mobile-first, sin rupturas a 320 px; punto de quiebre principal a 768/1024 px.
- Contraste AA, foco visible, `aria-current` en la navegación activa, skip-link, teclado completo, `prefers-reduced-motion`.
- Imágenes con `alt` o `alt=""` decorativas; `figure/figcaption` cuando aporta.
- Comprobación manual obligatoria con teclado + lector de pantalla básico antes de publicar cada hito; auditoría automatizada con axe queda pospuesta (sección 11).

### 4.5 Código y calidad de revisión

- Resaltado con Shiki (incluido en Astro), temas claro/oscuro.
- Reglas de plantilla derivadas de Astro 7: etiquetas siempre cerradas, sin anidamiento inválido (`div` dentro de `p`), espacios explícitos entre elementos inline (`{" "}`).

---

## 5. Búsqueda y navegación del currículo

### 5.1 Búsqueda

- **Pagefind 1.5.2** como índice estático post-compilación: se ejecuta sobre `dist/` al final del build (`pagefind --site dist`), genera un índice que se sirve desde el propio CDN. Sin backend, sin base de datos, sin coste adicional, compatible con la salida estática de Pages. ✔ H4: `npm run pagefind` (configuración en `pagefind.yml`, `site: dist`) encadenado dentro de `npm run build`.
- Indexación restringida: `data-pagefind-body` en el contenido principal de lecciones/módulos/glosario y `data-pagefind-ignore` en cabecera, pie, barra lateral y navegación, para que las búsquedas devuelvan contenido, no menús. ✔ H4: marcado en las 7 lecciones y los 56 módulos (**63 páginas indexadas**); la 404, la home, los niveles, el mapa y `/buscar/` quedan fuera por ausencia de marcado (la CLI lo confirma: «Ignoring pages without this tag»).
- UI: se valora primero `@pagefind/default-ui` (embutido) o una capa propia mínima sobre la API de Pagefind. La página `/buscar/` solo se crea si el diálogo no resulta suficiente. ⇒ H4: **capa propia mínima** sobre la API (D27), con estados propios en español; `/buscar/` creada y `@pagefind/default-ui` no instalado.
- Los ficheros del índice (~100–300 KB) se cargan bajo demanda; se comprueba el comportamiento en móvil. ✔ H4: el script de Pagefind se importa dinámicamente **solo al primer-buscar** (no hay `<link rel="prefetch">` ni precarga del índice en el HTML estático); ✔ H6 (parcial): verificación **estática** responsive en `docs/AUDITORIA_A11Y.md` §1.5 (`meta viewport`, 0 anchos fijos ≥321 px, breakpoints mobile-first) — la verificación **visual** en viewport de 320 px y dispositivo real sigue pendiente (la herramienta Lighthouse de H6 corre en modo desktop).

### 5.2 Navegación del currículo

- **Mapa completo en `/curriculo/`**: los 9 niveles con sus módulos, prerrequisitos y estado del progreso local. ✔ Implementado en H2 (`CurriculumMap`); el estado de progreso local se añadió en H4 (D28): los módulos con lecciones muestran «N de M» (los vacíos no muestran nada).
- **Barra lateral por módulo** en lecciones: árbol nivel → módulo → lecciones, con `aria-current="page"`. ✔ Implementado en H4 (`nav/ModuleSidebar.astro`, D26): árbol en escritorio y lista compacta del módulo actual en móvil; los módulos sin lecciones se declaran «Sin lecciones publicadas» y solo se enlazan rutas existentes.
- **Breadcrumb** en todas las páginas de contenido: Inicio › Currículo › Nivel › Módulo › Lección. ✔ Implementado en H2 (`Breadcrumb.astro`; la miga actual lleva `aria-current="page"` y los separadores `aria-hidden`).
- **Anterior / Siguiente** calculados desde el campo `orden` (no a mano). ✔ Implementado en H2 (`PrevNext.astro` + `paresDeNavegacion` en `src/lib/curriculum.ts`, testeado con fixtures y con el contenido real).
- Menú principal corto: Inicio, Currículo, Proyecto, Glosario, Referencias, Buscar. En H2 se publican solo Inicio, Currículo, Proyecto y Enfoque: **no se enlaza ninguna ruta inexistente** (Glosario y Referencias llegan con sus hitos; **Buscar** se añadió en H4 al existir `/buscar/`). `aria-current` por prefijo de ruta para páginas y por igualdad para anclas (D18).
- Prefetch de Astro (`prefetch: true`) para navegación rápida entre lecciones adyacentes. ✔ Adoptado en H4 tras evaluación: solo en enlaces de lecciones con `data-astro-prefetch` (prev/next y barra lateral), estrategia «hover», sin `prefetchAll` (D29).
- Mapa del sitio XML (cuando exista `site`), `robots.txt` y `404` con enlace al mapa del currículo. ✔ `404.astro` implementado en H2 (estático, `noindex`, enlaces a `/curriculo/` y `/`).

### 5.3 Progreso del alumno (sin registro)

- `localStorage` con una clave versionada: lecciones completadas por id, último punto de lectura, notas privadas opcional.
- Escrito por un script cliente pequeño en `src/lib/progreso.ts` (lógica pura testable) + adaptador `localStorage`.
- Nunca se envía al servidor; nunca se pierde el acceso al contenido sin él; documentado como "progreso local" en la interfaz.
- ✔ Implementado en H4 (D28): clave `hep.progreso.v1`, **solo lecciones completadas por id + resumen del módulo** (sidebar, página de módulo y mapa). El punto de lectura y las notas (opcionales en este diseño) quedan pospuestos a un hito posterior con alcance explícito.

---

## 6. Estrategia de pruebas y validación

### 6.1 Niveles de comprobación

| Nivel | Herramienta | Qué cubre | ¿Bloquea el despliegue? |
| --- | --- | --- | --- |
| Tipos | `astro check` (@astrojs/check + TS 6.0.3) | `.astro`, `.ts`, esquemas de colección, MDX tipado | Sí |
| Lint | ESLint 10 + `eslint-plugin-astro` 3.2.1 | Errores comunes en scripts, reglas de accesibilidad básicas | Sí |
| Formato | Prettier 3.9.10 + `prettier-plugin-astro` 1.1.1 | Formato coherente de TS, MDX, JSON, CSS | Sí |
| Unitarias | Vitest 5.0.5 | `src/lib/`: orden, rutas, progreso, búsqueda, utilidades de frontmatter | Sí |
| Reglas de currículo | Vitest (colec. `tests/content/`) | Prerrequisitos existentes, órdenes únicos, sin huérfanos, ≥1 ejercicio por lección, campos obligatorios | Sí |
| Enlaces internos | `npm run links` → `tests/links/check-links.mjs` sobre `dist/` | Enlaces y `src` internos rotos y anclas inexistentes | Sí (encadenado en `build:deploy`; añadido en H2, D15) |
| Índice de Pagefind | `npm run pagefind:check` → `tests/links/check-pagefind.mjs` sobre `dist/` | Índice y runtime presentes, `page_count` > 0, igualdad exacta entre páginas indexadas y ficheros con `data-pagefind-body`, 404 excluida | Sí (encadenado en `build:deploy`; añadido en H4, D31) |
| Compilación | `astro build` | HTML generado, rutas estáticas, compilador Rust de Astro 7 | Sí |
| Smoke post-build | `astro preview` + checklist manual | Navegación, responsive, teclado, contraste, búsqueda | Manual por hito |

### 6.2 Política de despliegue

- El comando de build en Cloudflare Pages ejecuta las comprobaciones **antes** de compilar: si cualquier comprobación falla, el build falla y **no se publica nada** (requisito de `TECH_STACK.md`).
- GitHub Actions ejecuta los mismos comandos en cada push a `main`, en cada pull request y bajo demanda (`workflow_dispatch`): paso visible de `npm run verify` + paso `npm run build:deploy` (§8.5 y D32). Que `main` **exija** CI verde depende de la protección de rama en GitHub: configurada y **verificada el 20-10-2026** en §8.5 (D33): ruleset «Comprobaciones y compilación» + prueba de fallo deliberada.
- No se afirma una funcionalidad como terminada sin haberla verificado; cada hito deja constancia de qué se comprobó y qué queda pendiente.

### 6.3 Qué queda fuera por ahora

- E2E de navegador (Playwright), regresión visual y auditoría automatizada de accesibilidad (axe): se posponen; se cubren con checklist manual mientras el sitio es pequeño.
- Pruebas de rendimiento y presupuesto de carga: medición puntual por hito, no gate automatizado.

---

## 7. Comandos de desarrollo, comprobación y compilación

Scripts en `package.json` (los de la primera fase ya implementados; los marcados «H4» se añadieron en ese hito):

| Comando | Acción |
| --- | --- |
| `npm install` | Instalación (genera/actualiza `package-lock.json`). |
| `npm run dev` | `astro dev` — servidor de desarrollo en local. |
| `npm run check` | `astro check` — tipos y diagnósticos de `.astro`. |
| `npm run lint` / `npm run lint:fix` | ESLint / con autoreparación. |
| `npm run format` / `npm run format:check` | Prettier escribiendo / verificando. |
| `npm test` | `vitest run` — unitarias y reglas de currículo. |
| `npm run test:watch` | `vitest` en modo observación. |
| `npm run verify` | `check` + `lint` + `format:check` + `test` (gate completo, sin compilar). |
| `npm run build` | `astro build && npm run pagefind` — producción completa + índice de búsqueda (paso `pagefind --site dist` añadido en H4 vía `pagefind.yml`). |
| `npm run build:deploy` | `npm run verify && npm run build && npm run links && npm run pagefind:check` — usado por Cloudflare Pages. |
| `npm run preview` | `astro preview` — sirve `dist/` en local. |
| `npm run links` | `node tests/links/check-links.mjs` — enlaces internos y anclas sobre `dist/` (añadido en H2, D15; antes estaba previsto para H4/H5). |
| `npm run pagefind` | `pagefind` — (re)genera el índice de búsqueda sobre `dist/` con `pagefind.yml` (añadido en H4). |
| `npm run pagefind:check` | `node tests/links/check-pagefind.mjs` — valida el índice generado (añadido en H4, D31). |

Requisitos de entorno: Node 24.22.0 (`.nvmrc`), npm ≥ 9.6.5 (incluido con Node 24). Ningún comando necesita credenciales.

---

## 8. Despliegue en Cloudflare Pages desde GitHub

### 8.1 Preparación del repositorio

Estado tras la auditoría del H5 y la publicación inicial (20 de octubre de 2026):

1. Repositorio en GitHub con rama por defecto `main`. — **Hecho**: `https://github.com/raulferrer-ai/harness-engineering-platform` (cuenta personal; público y vacío antes del primer push).
2. Comprometer `package-lock.json` (builds reproducibles con `npm ci`). — **Hecho** (commit `9d16d60`).
3. Comprometer `.nvmrc` y `.node-version` con `24.22.0`. — **Hecho** (commit `9d16d60`).
4. `.gitignore` mínimo: `node_modules/`, `dist/`, `.astro/`, cobertura, logs, `.env*`. — **Verificado** antes y después del commit: `dist/`, `node_modules/`, `.astro/` y `.env*` siguen ignorados; no existe ningún `.env` y no entraron en el historial.
5. Workflow `.github/workflows/ci.yml`: `actions/checkout@v7` → `actions/setup-node@v7` con `node-version-file: .nvmrc` y caché npm → `npm ci` → `npm run verify` → `npm run build:deploy` (+ `workflow_dispatch` y `concurrency`), actualizado en H5 (D32). — **Ejecutado en GitHub**: CI #1 sobre `9d16d60` → **verde** (20-10-2026, 47 s); antes, validado en local (sintaxis YAML y Prettier).
6. Proteger `main` exigiendo el check de CI. — ✅ **Hecho y verificado** (20-10-2026, §8.5 y D33): ruleset activa sobre `main`; PR #1 con check rojo y fusión bloqueada.

### 8.2 Conexión en el panel de Cloudflare

> **Realidad desplegada (20-10-2026)**: el proyecto creado por el usuario es de tipo **Workers con assets estáticos** (no un proyecto Pages clásico): repositorio conectado por Git (`raulferrer-ai/harness-engineering-platform`, rama de producción `main`), build command **`npm run build:deploy`** (corregido el 20-10-2026; antes `npm run build`), deploy command `npx wrangler deploy` y URL `https://harness-engineering-platform.raul-ferrer-caio.workers.dev`. La configuración de assets vive **en el repo** (`wrangler.jsonc`, D34): `assets.directory: ./dist` y `not_found_handling: "404-page"`. Los valores de la tabla siguiente siguen siendo los correctos del build; la diferencia es quién ejecuta el despliegue (Wrangler, en lugar del integrado de Pages).

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
2. Instalar la aplicación de GitHub de Cloudflare concediendo acceso **solo** a este repositorio.
3. Seleccionar el repositorio y confirmar la configuración de build (valores comprobados el 19 de octubre de 2026 contra la documentación pública de Cloudflare: «Build configuration», «Build image» —actualizada 16-10-2026— y «Git integration»):

| Campo | Valor |
| --- | --- |
| Framework preset | Astro (el preset trae `npm run build` + `dist`; el proyecto lo **sobrescribe** con `npm run build:deploy`) |
| Install command | `npm ci` si el panel expone el campo; si no está expuesto, Pages instala las dependencias automáticamente (comportamiento documentado: *automatic dependency installation*, desactivable con `SKIP_DEPENDENCY_INSTALL=1` para mandar un comando propio). `package-lock.json` está comprometido; **el comando exacto que ejecute se confirma en el log del primer build** (§8.4). |
| Build command | `npm run build:deploy` |
| Build output directory | `dist` |
| Root directory | `/` (raíz del repo) |
| Node version | `24.22.0`, resuelto por los ficheros `.nvmrc`/`.node-version` del repositorio (mecanismo admitido: la variable `NODE_VERSION` **o** `.nvmrc`/`.node-version`, con cualquier versión). Refuerzo opcional: `NODE_VERSION = 24.22.0` en Settings > Environment variables. |
| Build system | imagen **v3** (por defecto en proyectos nuevos): trae Node 22.16.0, **por debajo del `>=22.22.0` que exige Astro 7**, y **no** lee `engines` de `package.json`; por eso la fijación anterior es obligatoria, no cosmética. |
| Variables de entorno | `SITE_URL` (opcional, pública). **Ningún secreto**: el proyecto no necesita credenciales. Pages inyecta además `CI`, `CF_PAGES`, `CF_PAGES_BRANCH`, `CF_PAGES_COMMIT_SHA` y `CF_PAGES_URL`. |
| Funciones / Pages Functions | No habilitadas (salida puramente estática) |

4. Guardar y ejecutar el primer despliegue; revisar el log completo del build (instalación de dependencias, versión de Node anunciada, comprobaciones, índice de Pagefind y subida de `dist/`).

### 8.3 Comportamiento de los despliegues

- Push a `main` → despliegue de **producción** en `*.pages.dev`.
- Cualquier otra rama → **preview deployment** con URL propia (útil para revisar el contenido antes de fusionar).
- Si `npm run build:deploy` falla (tipos, lint, tests, enlaces o build), **no se publica** esa versión: el despliegue anterior sigue vivo.
- Rollback: panel de Pages → Deployments → seleccionar una versión anterior → **Rollback**.

### 8.4 Verificación tras el primer despliegue

> Ninguno de estos puntos se da por ejecutado hasta realizarlo sobre la URL pública real.

1. La URL `*.pages.dev` responde 200 y sirve HTML estático.
2. `/curriculo/` muestra el mapa completo; navegación nivel → módulo → lección funcional (home incluida).
3. Búsqueda operativa: `https://<proyecto>.pages.dev/pagefind/pagefind.js` y un fragmento de índice responden 200, y en `/buscar/` una consulta devuelve resultados reales.
4. Una ruta inexistente devuelve la página `404` (y queda fuera del índice de Pagefind).
5. Prueba de regresión del gate: romper a propósito un tipo o un enlace en una rama y comprobar que el build de despliegue **falla** (y que el check de GitHub queda rojo si procede).
6. `/robots.txt` accesible (`Allow: /`) y `<title>` correctos en home, mapa, módulo y lección.
7. Recursos estáticos (CSS, JS, favicon) cargan sin 404 y sin errores de consola relevantes.
8. Progreso local: en un navegador con `localStorage` disponible, marcar una lección, recargar y verificar que persiste **solo en ese navegador**. ✔ **Verificado el 21-10-2026** (navegador adjunto vía app de escritorio): marcar `l01` → `localStorage["hep.progreso.v1"] = {"n0/m1/l01-que-es-programar":true}` → recarga → **sigue marcada** → resumen «1 de 7 lecciones · 14 %» en la lección y en el módulo; el dato de prueba se borró al terminar.
9. Contenido no publicable: los esquemas de colección no tienen campo de estado/privacidad, así que **todo lo de `src/content` es público por diseño**; comprobar que no se han añadido ficheros marcados como privados/borrador en rutas publicadas.
10. Confirmar en el log del build el comando de instalación de dependencias y la versión de Node usada (§8.2).

**Resultado de la primera verificación pública (20-10-2026)** — verificado de forma anónima contra la URL real (`https://harness-engineering-platform.raul-ferrer-caio.workers.dev`):

| # | Punto | Resultado |
| --- | --- | --- |
| 1 | URL pública 200 + HTML estático | ✔ 200, `text/html`, `cf-cache-status: HIT`, `cache-control: public, max-age=0, must-revalidate` |
| 2 | Mapa y navegación | ✔ `/`, `/curriculo/`, `/curriculo/n0/`, `/curriculo/n0/m1/`, lección `l01`, `/buscar/`, `n0/m2` y `n8/m6` → 200 con títulos correctos; `/curriculo` sin barra → 307 a la variante con barra |
| 3 | Pagefind público | ✔ **Tras el redespliegue con `wrangler.jsonc`** (20-10-2026): `pagefind.js` → 200 (`text/javascript`), `pagefind-entry.json` → JSON válido (idioma `es`) y fragmentos del índice → 200 |
| 4 | 404 en ruta inexistente | ✔ Tras el redespliegue: status **404 con la página del sitio** (`<title>Página no encontrada · …`, cuerpo con contenido); la exclusión de la 404 del índice está verificada en local (gate `pagefind:check`) |
| 5 | Fallo deliberado del gate | ✔ **Verificado (20-10-2026)**: rama `prueba/fallo-deliberado` con test rojo (`npm run verify` → exit 1) → **PR #1** → check «Comprobaciones y compilación (pull_request)» en **failure** con etiqueta **`Required`** y **botón «Merge pull request» deshabilitado** («All checks have failed»); API: `state: closed`, `merged: False` (el commit `56fc6a9` nunca llegó a `main`). `mergeable_state: unstable` = «mergeable with non-passing commit status» (enum `MergeStateStatus`): ese campo REST no refleja la ruleset; el bloqueo se ejerce al fusionar. Rama borrada en local y remoto |
| 6 | `robots.txt` + títulos | ✔ `User-agent: * / Allow: /` (`text/plain`); títulos correctos en home, mapa, nivel, módulo, lección y buscar |
| 7 | Recursos estáticos | ✔ CSS (`text/css`), JS (`text/javascript`) y favicon (`image/svg+xml`) → 200 desde `/_astro/` |
| 8 | Progreso local en navegador | ✔ **Verificado en navegador (21-10-2026)**: home 200 con **0 errores de consola**; buscador con **resultados en vivo** («5 resultados para «Git»», `/pagefind/pagefind.js` y `pagefind-worker.js` → 200); `checkbox#progreso-leccion` marcado con teclado (el árbol de accesibilidad se trunca en páginas largas, sin ref para clic) → `checked: true`, `localStorage["hep.progreso.v1"]` con la lección, **«1 de 7 lecciones · 14 %»** en lección y módulo (l01 «✓ completada») y **persistencia tras recarga**; 404 con «Esta página no existe» y enlace a inicio; atrás/adelante correctos; **0 errores de consola** en toda la ruta |
| 9 | Contenido no publicable | ✔ esquemas sin campo de estado; los commits posteriores a la auditoría solo tocan documentación |
| 10 | Log del build (instalación + Node) | ✔ Log aportado por el usuario: instalación `npm clean-install --progress=false` (= `npm ci`; 402 paquetes en 9 s con caché), **Node 24.22.0 detectado del entorno (`.nvmrc`)**, gate completo en verde antes del despliegue y `wrangler@4.151.2` subiendo **162 assets** (155 nuevos + 7); versión desplegada `cef5718d` |

Integridad del contenido: home, mapa, módulo, lección y buscar son **idénticas al build local** normalizando el hash del CSS (`ByQnelms` local / `CPseglJG` remoto: diferencia esperada del rebuild en la imagen Linux de Cloudflare). Recuento local: **162 ficheros en `dist/`, 78 de ellos en `pagefind/`**; el recuento de ficheros del despliegue (visible en el panel) distingue «no subidos» de «subidos y no enrutados».

### 8.5 Gate de publicación (H5): cinco capas y cómo activarlo

| Capa | Dónde | Qué ejecuta | Si falla | Estado (20-10-2026) |
| --- | --- | --- | --- | --- |
| Validación local | Máquina del desarrollador | `npm run verify` / `npm run build:deploy` | No se genera un `dist/` nuevo | ✔ Activa (usada en H0–H4) |
| CI en GitHub | GitHub Actions (`.github/workflows/ci.yml`) | `npm ci` → `npm run verify` → `npm run build:deploy` en push a `main`, pull request y `workflow_dispatch` | El check del commit/PR queda rojo | ✅ **Ejecutada en GitHub**: **4/4 verdes en `main`** (`9d16d60`, `68d2d4e`, `7acd50b`, `e71d010`) y **rojo a propósito en el PR #1** (prueba de fallo deliberada); validada en local antes (YAML + Prettier) |
| Build de producción | Cloudflare (rama `main`; build command del panel) | Instalación de dependencias (`npm ci`) + **`npm run build:deploy`** (gate completo: `verify` → `build` → `links` → `pagefind:check`) | Exit ≠ 0 → build **fallido** → no se publica; la versión anterior sigue publicada | ✅ **Activa y verificada en el log** (20-10-2026): gate completo en verde antes de cada despliegue |
| Despliegue de preview | Cloudflare (ramas ≠ `main`) | El mismo build (el bot de Cloudflare anunció «Deploying Preview» en el PR #1) | Build fallido → sin URL de preview; producción intacta | ✅ **Intentado y cortado por el gate** (20-10-2026): los previews de rama **sí están activos** en la integración Git y su build también corre `build:deploy` |
| Despliegue de producción | Cloudflare (`main` con build correcto) | `npx wrangler deploy` sube `dist/` como assets (gobernado por `wrangler.jsonc`) | Solo llega a producción lo que superó las capas anteriores | ✅ **Publicada y verificada** (20-10-2026) en `harness-engineering-platform.raul-ferrer-caio.workers.dev` (versión `cef5718d`, 162 assets incluido `pagefind/`, 404 servida con contenido) |

**Cómo se exige CI verde antes de publicar** (**activo y verificado el 20-10-2026**; D33):

1. **GitHub — donde vive el gate de fusión**: Settings → Branches (o Settings → Rules) → regla para `main` → activar **Require status checks to pass before merging** y añadir el check **«Comprobaciones y compilación»** (el `name` del job del workflow). Recomendables: **Require branches to be up to date before merging** (strict), **Include administrators** y restringir los pushes directos a `main`. Con eso ningún PR se fusiona sin CI verde; como Pages despliega producción desde `main`, nada no verificado puede publicarse. **Estado (20-10-2026)**: configurado por el usuario en *Settings → Rules → Rulesets* — ruleset «Comprobaciones y compilación» con `enforcement: active`, condición `refs/heads/main`, `required_status_checks.context: «Comprobaciones y compilación»` (`integration_id` de GitHub Actions) y reglas extra `deletion` + `non_fast_forward`; **verificado con la prueba de fallo deliberada** (fila 5 del §8.4). Sin `strict`, pero **los pushes directos a `main` quedan rechazados** (GH013: «Required status check "Comprobaciones y compilación" is expected»): el check requerido debe reportar con éxito y un commit local aún no tiene ejecución → **flujo de cambios obligatorio por PR con CI verde** (verificado con el propio push de este commit).
2. **Cloudflare no ofrece un ajuste «exigir los checks de GitHub»**: su gate propio es el código de salida de `npm run build:deploy` (capa 3 de la tabla). Además, el Git integration de Pages publica sus propios **build and deployment status checks** en el repositorio, que pueden sumarse a la lista de checks requeridos.
3. **Restricciones de plan (documentación oficial consultada el 19-10-2026)**:
   - *Protección de rama/rulesets* (GitHub): gratis en **repositorios públicos** con GitHub Free; en privados exige GitHub Pro/Team/Enterprise.
   - *GitHub Actions* (GitHub): gratis e **ilimitado en repos públicos**; en privados, 2.000 min/mes (Free) y 500 MB de artefactos — con ejecuciones de pocos minutos el margen es amplio.
   - *Cloudflare Pages Free* (doc. «Limits», 05-09-2026): **500 builds/mes**, 1 build concurrente, timeout de 20 min y máximo 20.000 ficheros por sitio (este sitio tiene 76 páginas y cientos de ficheros); previews ilimitados.
4. **Regla de honestidad**: el gate **no se da por activo** hasta verificar en GitHub que un PR con el check rojo no puede fusionarse (prueba de fallo deliberado, §8.4.5). **Cumplido (20-10-2026)**: PR #1 con check en `failure`, etiqueta `Required` y botón de fusión deshabilitado (fila 5 del §8.4).

Nota de ramas: el workflow cubre push a `main` + `pull_request` (todas las ramas) + disparo manual; una rama sin PR no ejecuta CI hasta que se abra el PR.

---

## 9. Publicación posterior con dominio propio

> Ningún paso de esta sección se ejecuta sin autorización explícita: comprar un dominio implica un pago y `AGENTS.md`/`TECH_STACK.md` lo prohíben hasta entonces.

1. **Autorización y compra del dominio** (registrador de elección; coste anual asumido por el proyecto).
2. **Añadir el dominio en Pages**: proyecto → **Custom domains** → **Add custom domain** → seguir el asistente.
3. **DNS**:
   - Si la zona se gestiona en Cloudflare: añadir automáticamente el registro (apex `A 192.0.2.1`/registro sugerido o `CNAME` según el asistente).
   - Fuera de Cloudflare: apuntar los nameservers al DNS de Cloudflare o añadir un `CNAME` al dominio `*.pages.dev`.
4. **HTTPS**: certificado emitido automáticamente por Cloudflare; esperar a que esté activo antes de dar por buena la migración.
5. **Actualizar `site`** en `astro.config.mjs` (o `SITE_URL`) con el dominio definitivo y relanzar el build: afecta a canonical, sitemap, OG/Twitter cards y enlaces absolutos.
6. **Redirecciones**: si se decide servir `www` → apex (o al revés), añadir `public/_redirects`.
7. **Pruebas de publicación**: HTTPS en el apex y en `www`, canonical correcto, `/sitemap-index.xml`, `/robots.txt`, 404, ausencia de enlaces a `*.pages.dev` en el HTML, `Cache-Control` razonable.
8. **Documentar** en `README.md` el dominio, cómo se renueva y cómo se cambia `site`.

---

## 10. Hitos de implementación

Cada hito es pequeño, verificable y deja el proyecto en un estado compilable.

| Hit. | Entregable | Verificación | Estado |
| --- | --- | --- | --- |
| H0 | Scaffolding Astro 7 + Tailwind 4 + TS 6 + ESLint/Prettier/Vitest, `.nvmrc`, scripts de `package.json` | `npm run verify` y `npm run build` en local | ✔ Completado (2026-10-19) |
| H1 | Sistema de diseño: tokens, `BaseLayout`, componentes `ui/`, home | Checklist de accesibilidad y responsive | ✔ Completado (2026-10-19) |
| H2 | Colecciones, esquemas y rutas de currículo (mapa completo, nivel, módulo, lección, 404) + breadcrumb y prev/next | Tests de reglas de currículo + `build:deploy` (incluye `npm run links`) | ✔ Completado (2026-10-19) |
| H3 | Plantilla de lección + primer módulo completo (`n0/m1`) con ejemplos y ejercicios | Revisión editorial + verificación de cada ejercicio | ✔ Completado (2026-10-19) |
| H4 | Navegación fina (sidebar por módulo, prefetch) + búsqueda Pagefind + progreso local | Búsqueda funcional, enlaces internos sin errores, índice verificado | ✔ Completado (2026-10-19) |
| H5 | CI en GitHub + conexión Cloudflare Pages + gate de despliegue | Despliegue verde y prueba de fallo deliberado | ✅ **Completado (21-10-2026)**: CI verde en los 5 pushes a `main`, sitio desplegado y verificado en Workers con Pagefind y 404 correctos (§8.2–§8.4), **gate de rama activo** (fallo deliberado bloqueado + GH013, §8.5/D33) y **verificación en navegador** (§8.4, puntos 1–10) |
| H6 | Documentación de ejecución y mantenimiento, auditoría manual a11y | Checklist firmada en el PR correspondiente | ✅ **Completado (21-10-2026)**: `docs/MANTENIMIENTO.md` + `docs/AUDITORIA_A11Y.md` (checklist firmada); Lighthouse accessibility **1.0 en 11 rutas**, 0 fallos de axe y 0 errores de consola tras corregir 4 hallazgos reales (§10.6). **Pendiente honesto**: verificación visual en viewport móvil de 320 px (la herramienta solo ofrece modo desktop) |
| H7 | Contenido: `n0/m2` completo («Tipos, variables y funciones»): 7 lecciones con ejemplos ejecutables y pruebas | Revisión editorial + verificación de cada ejercicio + gate `npm run build:deploy` | ✅ **Completado (21-10-2026)**: 7 lecciones con la plantilla de §6, 15 ficheros de ejemplo ejecutados (20 pruebas `node --test` en verde y 3 rojos deliberados con su clase de error verificada), ejercicios resueltos y ejecutados antes de documentarlos, `tests/content/ejemplos.test.ts` ampliado a m2 (§10.7) |
| H8 | Contenido: `n0/m3` completo («Control de flujo y estructuras de datos»): 7 lecciones con ejemplos ejecutables, pruebas y el script que procesa un fichero real | Revisión editorial + verificación de cada ejemplo y ejercicio + gate `npm run build:deploy` | ✅ **Completado (21-10-2026)**: 7 lecciones con la plantilla de §6, 17 ficheros de ejemplo ejecutados (28 pruebas `node --test` en verde, CSV real de 8 gastos, 1 `TypeError` con código 1 y 2 rojos registrados en los tests de cobertura), las 7 soluciones de ejercicio ejecutadas antes de documentarlas, `tests/content/ejemplos.test.ts` ampliado a m3 (§10.8) |
| H9 | Contenido: `n0/m4` completo («Estructura de proyectos y dependencias»): 7 lecciones con ejemplos ejecutables, pruebas y el proyecto con 3 módulos y README | Revisión editorial + verificación de cada ejemplo y ejercicio + gate `npm run build:deploy` | ✅ **Completado (21-10-2026)**: 7 lecciones con la plantilla de §6, 21 ficheros de ejemplo ejecutados (24 pruebas `node --test` en verde: 18 en módulos sueltos y 6 en el mini-proyecto `proyecto/`; 2 rojos con `ERR_MODULE_NOT_FOUND` y 3 casos rojos registrados), lockfile generado con `npm install` real, las 7 soluciones de ejercicio ejecutadas antes de documentarlas, `tests/content/ejemplos.test.ts` ampliado a m4 (§10.9) |
| H10 | Contenido: `n0/m5` completo («Control de versiones con Git»): 7 lecciones con ejemplos ejecutables y la suite del flujo completo | Revisión editorial + verificación de cada ejemplo y ejercicio + gate `npm run build:deploy` | ✅ **Completado (21-10-2026)**: 7 lecciones con la plantilla de §6, 9 ficheros de ejemplo ejecutados (suite `flujo-completo.test.js` con 7 pruebas `node --test` en verde contra Git real; 2 rojos deliberados —conflicto de fusión `CONFLICT` en `1` y push rechazado `fetch first` en `1`—; el helper `archivosVerificables` extendido a `.sh` en `errores/`), las 7 soluciones de ejercicio ejecutadas en temporales antes de documentarlas, `tests/content/ejemplos.test.ts` ampliado a m5 (§10.10) |
| H11 | Contenido: `n1/m1` completo («Cómo funcionan los modelos de código»): 6 lecciones con ejemplos ejecutables y el entregable de nota técnica con fuentes | Revisión editorial + verificación de cada ejemplo, ejercicio y fuente + gate `npm run build:deploy` | ✅ **Completado (21-10-2026)**: 6 lecciones con la plantilla de §6, 10 scripts ejecutados con solo librería estándar (7 verdes y 3 rojos deliberados con `TypeError` y mensajes reales, todos en `1`) más `nota-ejemplo.md`, los 6 bloques de ejercicio extraídos del MDX y ejecutados literalmente, `comprobar-nota.js` validando el entregable (válida → `0`, sin fechas → `1`), 12 fuentes verificadas con HTTP 200, `tests/content/ejemplos.test.ts` ampliado a n1/m1 y corrección del test de orden de secciones para que ignore bloques de código (§10.11) |
| H12 | Contenido: `n0/m6` completo («Pruebas y depuración»): lecciones con la plantilla de §6, ejemplos ejecutables y la suite que falla a propósito y luego pasa | Revisión editorial + verificación de cada ejemplo y ejercicio + gate `npm run build:deploy` | ✅ **Completado el 21-10-2026**: penúltimo módulo de `n0` (corrección de alcance de H11, §10.11); entregable de CURRICULUM §3: «Suite de tests que falla a propósito y luego pasa»; registro en §10.12 |
| H13 | Contenido: `n0/m7` completo («Fundamentos web: HTML, CSS y HTTP»): lecciones con la plantilla de §6, ejemplos ejecutables y la página estática validada | Revisión editorial + verificación de cada ejemplo y ejercicio + gate `npm run build:deploy` | ✅ **Completado el 21-10-2026**: último módulo de `n0`; cierra el nivel `n0` y con él la fase `f1`; entregable de CURRICULUM §3: «Página estática validada y publicada en local»; registro en §10.13 |
| H14 | Contenido: `n1/m2` completo («Tareas pequeñas: instrucciones y contexto mínimo»): 6 lecciones con la plantilla de §6, ejemplos ejecutables y la serie de tareas validada y medida | Revisión editorial + verificación de cada ejemplo y ejercicio + gate `npm run build:deploy` | ✅ **Completado el 22-10-2026**: primer módulo de formulación de tareas del nivel `n1`; entregable de CURRICULUM §3: «Serie de tareas de 10 minutos con pruebas»; registro en §10.14 |

### 10.1 Registro de ejecución de H1 (2026-10-19)

Entregado:

- **Tokens y base** en `src/styles/global.css`: paleta en OKLCH (papel/tinta/acento/oscuro para código), tipografías del sistema (sin fuentes externas), escala de lectura (base 17 px / 1.7), foco visible global, `prefers-reduced-motion`, enlace de salto, etiqueta monoespaciada (`.label-mono`) y estilos `.prose` propios para el Markdown/MDX futuro (sin plugin de tipografía).
- **Layout y componentes**: `BaseLayout.astro` (head, skip-link, `main#contenido`), `SiteHeader` (sticky, `aria-current`, enlaces solo a rutas/anclas existentes), `SiteFooter`, `PageContainer` (prose/wide), `SectionHeading`, `Card`, `ButtonLink` y `Progression` (los nueve niveles como información visual, sin enlaces hasta H2).
- **Home** (`src/pages/index.astro`): propuesta de valor, qué se aprende, itinerario, proyecto longitudinal (`src/lib/curriculum.ts`, datos temporales de `CURRICULUM.md`), enfoque práctico con ejemplo de ejercicio verificable y CTA. Sin cifras, testimonios ni resultados comerciales inventados.
- **Tests**: `tests/unit/curriculum.test.ts` (coherencia de niveles `n0`–`n8` y fases `f1`–`f6`); total del gate: 7 tests.
- **Validación realizada**: `npm run verify` (0 errores), `npm run build:deploy` (exit 0), inspección estática del `dist/` (anclas, rutas, landmarks, un solo `h1`, tokens en CSS, sin enlaces rotos) y prueba del tramo de espacios eliminado por `compressHTML: 'jsx'` (corregido con `{" "}`). No hubo navegador de escritorio conectado: **no** se hicieron pruebas visuales ni de teclado en navegador; quedan para la auditoría manual de H6.
- **Dependencia añadida en H1** (peer opcional declarado de `eslint-plugin-astro`): `@typescript-eslint/parser@8.71.2`, necesaria para que ESLint parsee el frontmatter TypeScript de los `.astro` (verificado: admite `typescript >=4.8.4 <6.1.0`, compatible con nuestro TS 6.0.3).

### 10.2 Registro de ejecución de H2 (2026-10-19)

Entregado:

- **Colecciones** (`src/content.config.ts`): las seis del §3.1 (`niveles`, `modulos`, `lecciones`, `glosario`, `referencias`, `proyecto`), cada una con `base` en su propia carpeta (D20) y loader `glob`. `glosario`, `referencias` y `proyecto` quedan declaradas sin ficheros aún (D16).
- **Esquemas** (`src/lib/schemas.ts`, zod v4 vía `astro/zod`): `schemaNivel`, `schemaModulo`, `schemaLeccion`, `schemaGlosario`, `schemaReferencia`, `schemaFase`; enums `NIVELES` (`n0`…`n8`), `DIFICULTADES`, `TIPOS_LECCION`, `TIPOS_REFERENCIA`, `FASES_PROYECTO`. Los esquemas se validan también en Vitest sin aliases (D19).
- **Contenido inicial** (65 fichas + ejemplos): 9 fichas de nivel transcritas de CURRICULUM.md §2 y **56** fichas de módulo transcritas de §3 mediante script de un solo uso con verificación de recuentos (9/56; si el documento no casa, el script aborta). Cuerpo editorial real solo en `n0/m1` (público, duración y cierre del módulo, según §10.2 de CURRICULUM.md). Una lección completa: `l01-que-es-programar.mdx` (plantilla de §6, secciones 3–9 en el cuerpo; salida del ejemplo y trazas de error **ejecutadas y verificadas** el 2026-10-19 con Node v24.22.0; fuente citada verificada con HTTP 200: `nodejs.org/docs/latest-v24.x/api/cli.html`). Ejecutable en `src/content/modulos/n0/m1/ejemplos/saludo.js` (10 líneas, ejecutado: `node saludo.js`, doble ejecución + `diff` → «OK: salidas idénticas», error `MODULE_NOT_FOUND` real y `ReferenceError` real).
- **Rutas reales** (69 páginas HTML): `/curriculo/` (mapa con los 9 niveles y los 56 módulos enlazados), `/curriculo/[nivel]/` (pregunta, misión, prerrequisitos enlazados, lista de módulos con entregable, criterio), `/curriculo/[nivel]/[modulo]/` (objetivos, entregable, lecciones o estado vacío honesto), `/curriculo/[nivel]/[modulo]/[leccion]/` (meta, objetivos, cuerpo `.prose`, prev/next) y `404.html` (`noindex`, enlaces al mapa). Todas generadas con `getStaticPaths()` desde las colecciones.
- **Componentes**: nuevos `nav/Breadcrumb.astro`, `nav/PrevNext.astro`, `nav/CurriculumMap.astro` y `ui/Notice.astro` (estados vacíos); `ui/Progression.astro` **movido** a `nav/` y ahora con datos de colecciones (recuento real de módulos) y enlaces a `/curriculo/nN/`; `SectionHeading` admite `nivel="h1"` para las páginas de contenido; `SiteHeader`/`SiteFooter` enlazan `/curriculo/` con `aria-current` por prefijo de ruta; `BaseLayout` acepta `noindex`. Home actualizada: CTAs a `/curriculo/` y `/curriculo/n0/`, ejemplo con la salida real del script.
- **Lógica** (`src/lib/curriculum.ts`): reescrito — funciones puras `rutaNivel`/`rutaModulo`/`rutaLeccion`/`rutaDeUnidad`, `ordenDeNivel`/`ordenDeModulo`, `ordenarPorOrden` y `paresDeNavegacion` (prev/next desde `orden`); los `niveles` estáticos de H1 se eliminaron (ahora son colección); `fasesProyecto` queda temporal hasta que la colección `proyecto` tenga ficheros.
- **Tests**: 4 ficheros y **47 tests** en el gate: `tests/content/esquemas.test.ts` (rechazo de metadatos inválidos en las 6 colecciones), `tests/content/curriculo.test.ts` (lectura directa de frontmatter con `yaml`: ids únicos `n0`…`n8`, ruta↔frontmatter, prerrequisitos existentes y anteriores, `orden` único = prefijo `lNN`, sin módulos huérfanos, regla de ejercicio, orden de secciones, rutas únicas con patrón del plan, prev/next simétrico), `tests/unit/curriculo.test.ts` (rutas, orden y navegación con fixtures) y `tests/unit/versions.test.ts` (ampliado con el script `links`).
- **Validación realizada**: `npm run verify` exit 0 (`astro check` 0 errores/0 avisos, ESLint limpio, Prettier OK, 47/47 tests); `npm run build:deploy` exit 0 (verify + build + links): 68 `index.html` + `404.html` = **69 páginas**, `npm run links` → «Enlaces internos OK: 1221 comprobados en 69 páginas HTML (1 externos omitidos)». Inspección estática del `dist/`: un solo `h1` por página en 7 rutas clave, `lang="es"`, skip-link y `main#contenido`, `aria-current` del menú en páginas anidadas, miga de pan con `aria-current` y 4 separadores `aria-hidden`, 9 secciones de nivel y 56 enlaces de módulo en el mapa, 8 `h2` de secciones + 6 bloques Shiki renderizados en `l01`, estado vacío visible en los módulos sin lecciones, `noindex` en la 404, prerrequisitos de `n8` enlazados. `astro preview`: 200 en `/`, `/curriculo/`, nivel, módulo, lección y `n8/m6`; ruta desconocida → 404 con la página propia. Corregidos en el camino dos defectos reales: `base` de colecciones que hacía ids `niveles/n0` (D20) y una interpretación errónea de la nota de prerrequisito de `n7` (D21).
- **Dependencia añadida en H2**: `yaml@2.9.1` en `devDependencies` (ya estaba en el árbol como transitive de `@astrojs/check`; se declara explícita porque los tests de contenido leen frontmatter sin compilar el sitio).
- **Ajustes de calidad**: ESLint ignora `src/content/**/*.js` (ejemplos educativos: se validarán **ejecutándolos** en H3, no con el linter); nodos de globals de Node (`console`, `process`) para `tests/**/*.mjs`.
- **Límites de H2** (no hecho a propósito): sin Pagefind, sin progreso persistente, sin autenticación ni backend, sin resto de lecciones (`l02`…`l07` quedan para H3), sin componentes MDX de plantilla (Exercise/Solution/Callout…), sin rutas `/glosario/`, `/referencias/` ni `/proyecto/`, y **sin pruebas visuales ni de teclado en navegador** (navegador de escritorio no conectado; quedan para H6).

#### Decisiones de diseño de H2 (D1–D21)

1. **Estructura de ficheros** (D1): `modulos/<nivel>/<modulo>/index.mdx` + `…/lecciones/lNN-*.mdx` según §2.2/§3.1 del plan. La referencia abreviada de CURRICULUM.md §5 (`…/mK/lNN-titulo.mdx`) se interpreta con la subcarpeta `lecciones/`.
2. **`tipo` solo en lecciones** (D2): enum ASCII `leccion|laboratorio|ejercicio`, por defecto `leccion`; los módulos no declaran `tipo` (desvío respecto de §3.2, que lo listaba como común).
3. **`dificultad` y `tiempoEstimado` solo en lecciones** (D3): CURRICULUM.md no los define por módulo ni por nivel; forzarlos habría obligado a inventar datos.
4. **`resumen` solo en lecciones** (D4): la página de nivel usa `pregunta` y la de módulo `objetivos[0]` como entradilla, sin duplicar información en dos campos.
5. **`orden`** (D5): frontmatter en lecciones (base de prev/next); en módulos se deriva de `mK` y en niveles de `nN`. Test adicional: el prefijo `lNN` del fichero debe coincidir con `orden`.
6. **`prerrequisitos` opcional** (D6): por defecto `[]` en las tres colecciones; el currículo no declara dependencias por módulo. Lo que sí se declare debe existir como unidad.
7. **«Cada módulo ≥1 lección»** (D7): en H2 se exige solo sobre los módulos **con** lecciones; la regla completa se endurece en las fases de producción 2–6 (CURRICULUM.md §12). Los módulos sin lecciones muestran estado vacío honesto.
8. **«Cada lección ≥1 ejercicio»** (D8): se comprueba sobre el cuerpo MDX (sección `## Ejercicio`) o `tipo: laboratorio`; sin campo de frontmatter nuevo.
9. **Identidad de la unidad** (D9): `nN` / `nN/mK` / `nN/mK/lNN-slug` (la ruta bajo `/curriculo/`), independiente de la carpeta física `lecciones/`; es lo que admite `prerrequisitos`.
10. **Reparto de la plantilla de lección** (D10): H1, resumen y objetivos los aporta la página desde el frontmatter; el MDX empieza en «Respuesta corta» (sin H1 duplicado ni secciones repetidas).
11. **`actualizado`** (D11): obligatorio en niveles, módulos y lecciones; su valor es la fecha real de creación/verificación de la ficha (2026-10-19).
12. **`fuentes`** (D12): opcional en lecciones; si existe, exige `titulo`, `url` y `fecha` de consulta (CURRICULUM.md §9).
13. **Estado de módulo** (D13): derivado (¿tiene lecciones?); sin campo `estado` en el frontmatter.
14. **Breadcrumb y prev/next adelantados a H2** (D14): el enunciado de H2 los exige; H4 queda con barra lateral, prefetch, búsqueda y progreso.
15. **`npm run links` adelantado a H2** (D15): script propio `tests/links/check-links.mjs` sobre `dist/`, encadenado en `build:deploy` y como paso en CI.
16. **Glosario, referencias y proyecto** (D16): colecciones y esquemas en H2, sin ficheros ni rutas (las rutas §2.3 quedan para H3+); sus esquemas se prueban con fixtures.
17. **Sin layouts intermedios en H2** (D17): las páginas de currículo componen `BaseLayout` + `Breadcrumb` + `PageContainer` + `SectionHeading`; `LevelLayout`/`ModuleLayout`/`LessonLayout` llegan con H3.
18. **Menú del sitio** (D18): solo rutas existentes (Inicio, Currículo, Proyecto y Enfoque como anclas de home); el menú definitivo del §5.2 llega cuando existan sus páginas. `aria-current` por prefijo para páginas y por igualdad para anclas.
19. **`z` desde `astro/zod`** (D19): esquemas en `src/lib/schemas.ts` importando el mismo módulo que reexporta `astro:content`, validables en Vitest sin aliases de configuración.
20. **`base` por colección** (D20): cada colección apunta con `base` a su propia carpeta; con `base = src/content` los `id` salían `niveles/n0` y `getStaticPaths()` falló en la primera compilación («Missing parameter: nivel»), corregido antes de dar por bueno el hito.
21. **Prerrequisito de `n7`** (D21): es `n5` únicamente; la nota «(puede paralelizarse con `n6`)» de CURRICULUM.md §2 no es un requisito y no se modela como tal.

### 10.3 Registro de ejecución de H3 (2026-10-19)

Entregado:

- **Módulo `n0/m1` completo**: 7 lecciones (`l01`–`l07`) siguiendo la plantilla de CURRICULUM.md §6 (secciones 3–9 en el cuerpo; `## Ejercicio` en todas). Nuevas: `l02` Instalar el entorno sin sorpresas, `l03` Terminal, rutas y archivos, `l04` Tu primer programa y sus pruebas, `l05` Leer errores y depurar, `l06` Cómo verificar lo que genera una IA, `l07` Primeros pasos con Git. Duraciones 30/45/45/60/45/60/60 = 345 min (dentro de las 4–6 h de CURRICULUM.md §10.2). `prerrequisitos` encadenados reales (`l02→l01`, …, `l07→l06`; D25).
- **Plantilla de lección probada**: con las 7 lecciones, la página de lección de H2 (miga de 5 niveles, objetivos, `.prose`, prev/next) y la regla de secciones de `tests/content/curriculo.test.ts` cubren el módulo entero sin tocar la plantilla (D22).
- **Ejemplos ejecutados** (12 ficheros en `ejemplos/`): `comprobar-entorno.js` + `versiones-esperadas.txt`, `verificar-estructura.js`, `saludo-funcion.js` + su prueba, `celsius-a-fahrenheit.js` + su prueba, `errores/{sintaxis,roto,tipos}.js`, `demo-git.sh` y `saludo.js` (l01). Todas las salidas incrustadas en las lecciones son ejecuciones reales del 2026-10-19 con Node v24.22.0 y Git 2.50.1: verdes (comprobador `OK`, `pass 3`), rojos reales (diff de aserción `actual`/`expected`, `pass 1`/`fail 2` con `87.5555` en el caso `100 °C`, `SyntaxError`/`ReferenceError`/`TypeError` con código 1) y el recorrido completo de Git (log, diff, `revert` con commit nuevo, rama y fusión).
- **Test de ejecución de ejemplos**: `tests/content/ejemplos.test.ts` (**15 tests**): casos directos con código de salida esperado, desajuste de versión (exit 1), estructura completa/incompleta, `node --test` en verde para los dos suites, reproducción del rojo registrado de l06 (`pass 1`, `fail 2`, `87.5555`), demo de Git (con omisión explícita si la máquina no tiene `git`) y un test de **cobertura** que falla si aparece un fichero de ejemplo que no esté en el manifiesto de verificación. Total del gate: **62 tests**.
- **Fuentes verificadas (HTTP 200, consultadas 2026-10-19)**: `nodejs.org/docs/latest-v24.x/api/test.html`, `/assert.html`, `/errors.html`, `nodejs.org/en/download`, `github.com/nvm-sh/nvm`, `git-scm.com/docs/git-revert` y `git-scm.com/book/en/v2`.
- **Coherencia de `l01`**: su traza de `ReferenceError` actualizada a la salida ESM real del fichero `ejemplos/errores/roto.js` (que ahora existe) y sus «Siguientes pasos» enlazan a `l02`, ya publicada.
- **Validación realizada**: `npm run format` exit 0; `npm run verify` exit 0 (`astro check` 0 errores/0 avisos/0 hints, ESLint limpio, Prettier OK, **62/62 tests**); `npm run build:deploy` exit 0: 74 `index.html` + `404.html` = **75 páginas**, `npm run links` → «Enlaces internos OK: 1343 comprobados en 75 páginas HTML (8 externos omitidos)». Inspección estática del `dist/`: un `h1` por lección, cadena prev/next completa `l01→l07` (`l01` sin prev, `l07` sin next, todo dentro del módulo), miga con `aria-current`, los `h2` de plantilla en las lecciones y los 7 enlaces de lección en la página del módulo. Dos defectos detectados y corregidos en la primera pasada de `verify`: el `SyntaxError` intencionado del ejemplo rompía `astro check` y `prettier --check` (D24) y el manifiesto de cobertura no incluía los dos módulos importados.
- **Límites de H3** (no hecho a propósito): sin componentes MDX (D22), sin layouts `LevelLayout`/`ModuleLayout`/`LessonLayout` (la composición de H2 basta; D17 se revisa en H4), sin módulos posteriores (`n0/m2` y demás siguen con estado vacío honesto), sin Pagefind/progreso/búsqueda (H4) y **sin pruebas visuales de navegador** (quedan para H6).

#### Decisiones de diseño de H3 (D22–D25)

22. **Sin componentes MDX en H3** (D22): el plan (§4.4) exige crear componentes MDX solo cuando una lección los necesita; las 7 lecciones de `n0/m1` se resuelven con MDX puro (encabezados de la plantilla §6, listas y bloques de código) y los tests de secciones garantizan su estructura. `Exercise`/`Solution`/`Callout` llegarán con el primer módulo que los necesite, no antes.
23. **Convención verde/rojo de los ejemplos** (D23): `ejemplos/*.js` debe terminar con código 0; `ejemplos/errores/*.js` falla a propósito y debe terminar con código 1 y su clase de error (cada uno documentado en su lección); los ficheros `.test.js` se ejecutan con `node --test`, que es exactamente lo que enseñan las lecciones. El test de cobertura exige que todo fichero de `ejemplos/` esté en el manifiesto: no puede haber un ejemplo sin verificar.
24. **Ejemplos fuera de tsc y Prettier, dentro de la ejecución** (D24): `tsconfig.json` excluye `src/content/**/ejemplos` y `.prettierignore` `src/content/**/*.js` (misma filosofía que la exclusión de ESLint de H2); la validación de esos ficheros es `tests/content/ejemplos.test.ts`, que los ejecuta. Es necesario: un ejemplo contiene a propósito un `SyntaxError` que ni `astro check` ni Prettier pueden parsear.
25. **Prerrequisitos encadenados** (D25): las lecciones declaran como prerrequisito a la anterior (`l02→l01`, …, `l07→l06`): primera validación real de la regla D6 (prerrequisito existente y con orden anterior) del test de currículo, que pasa en verde con el módulo completo.

### 10.4 Registro de ejecución de H4 (2026-10-19)

Referencia de partida (medida antes de tocar nada): `npm run verify` → 62/62 tests; `npm run build:deploy` → 75 páginas y 1343 enlaces; 0 commits en `main`.

Entregado:

- **Barra lateral por módulo** (`src/components/nav/ModuleSidebar.astro`): en escritorio, árbol «nivel → módulo → lecciones» con el módulo actual expandido, lección activa con `aria-current="page"` y enlace al nivel; en móvil, lista compacta de las lecciones del módulo actual. Las dos variantes comparten marcado y una de ellas está siempre con `display:none` (ni teclado ni lectores de pantalla ven duplicados). Solo se enlazan rutas que existen; los módulos sin lecciones del nivel se declaran «Sin lecciones publicadas» y los demás muestran su número de lecciones. La página de lección pasó a retícula `lg:grid-cols-[16rem_minmax(0,1fr)]` con la barra lateral pegajosa (`sticky`), y `data-pagefind-body` subió del `.prose` al `<article>` completo (título, resumen, objetivos y contenido quedan indexables).
- **Búsqueda con Pagefind** (§5.1): `pagefind.yml` (`site: dist`) + scripts `pagefind` y `pagefind:check` en `package.json`, con `npm run build` = `astro build && npm run pagefind` y `build:deploy` = `verify && build && links && pagefind:check`. Marcado `data-pagefind-body` en las 7 lecciones y los 56 módulos (63 páginas) y `data-pagefind-ignore` en la barra lateral, prev/next, bloque de progreso, cabecera, pie y miga. Nueva página `/buscar/` con capa propia sobre la API de Pagefind (`src/lib/busqueda.ts` + `src/scripts/busqueda.ts`): buscador accesible (`role="search"`, `label`, estado `role="status" aria-live="polite"`), resultados con título, extracto con `<mark>` (HTML saneado: solo esa etiqueta sobrevive) y enlace, y los cinco estados exigidos —ocioso, cargando, resultados, sin resultados y error (p. ej. `astro dev` sin índice)—, con «Enter» que no navega y `noscript` que enlaza el mapa. «Buscar» se añadió al menú principal (ruta real, D18 respetado). El script de Pagefind se importa dinámicamente al primer-buscar: el HTML estático no precarga nada.
- **Progreso local** (§5.3): `src/lib/progreso.ts` (lógica pura: lectura con estados `disponible`/`no-disponible`, alternancia sin escrituras optimistas, resumen con porcentaje y regla «completado solo con todas las unidades») + `src/scripts/progreso.ts` (cliente). Almacén `localStorage`, clave `hep.progreso.v1`, valor = ids de unidades → `true` (nada más; ningún dato personal). Widgets: casilla «Marcar esta lección como completada» con nota de que se guarda solo en ese navegador y restauración inline antes del primer pintado; resumen y marcas en la barra lateral, en la página del módulo y junto a cada módulo con lecciones del mapa. El HTML estático no afirma nada: resumen «—», marcas ocultas y casilla desmarcada; si el almacenamiento falla, los resúmenes dicen «No disponible en este navegador» y una escritura fallida revierte la casilla y muestra el aviso.
- **Prefetch evaluado y adoptado** (D29): `prefetch: true` en `astro.config.mjs` y `data-astro-prefetch` solo en enlaces de lección (prev/next, barra lateral y lista del módulo). La estrategia por defecto es «hover» (descarga al enfocar/apuntar), sin `prefetchAll`; en conexiones lentas o con ahorro de datos Astro cae a «tap». Verificado en el HTML: **0** `<link rel="prefetch">` estáticos (nada se descarga sin intención) y el runtime de Astro (chunk de 2478 B) se referencia en todas las páginas.
- **Tests nuevos** (25): `tests/unit/progreso.test.ts` (15: almacén disponible, no disponible, `getItem`/`setItem` fallidos, JSON corrupto, alternancia, resumen parcial/completo/vacío) y `tests/unit/busqueda.test.ts` (10: estados, saneado de extractos, mapeo de vistas). Total del gate: **87 tests**.
- **Gate del índice** (D31): `tests/links/check-pagefind.mjs` comprueba presencia del índice y del runtime, `page_count` > 0, igualdad exacta entre páginas indexadas y ficheros con `data-pagefind-body`, y que la 404 no lleva marcado; se encadena en `build:deploy` y como paso en `ci.yml` (misma paridad de comandos; su ejecución real llega con H5).

Validación realizada (todos los comandos ejecutados hoy):

- `npm run format` exit 0; `npm run verify` exit 0 (`astro check` 0 errores/0 avisos/0 hints en 40 ficheros, ESLint limpio, Prettier OK, **87/87 tests** en 7 ficheros).
- `npm run build:deploy` exit 0: 75 `index.html` + `404.html` = **76 páginas**; «Enlaces internos OK: 1727 comprobados en 76 páginas HTML (8 externos omitidos)»; Pagefind «Indexed 63 pages / 1547 words / idioma es»; «Pagefind OK: 63 páginas indexadas (idioma: es) = 63 ficheros con data-pagefind-body de 76 HTML; 404 excluida».
- **Sonda de usabilidad del índice** (Astro preview + `pagefind.js` con `basePath` local): «programar» → 7 resultados (1º `l01`, título limpio, extracto con `<mark>`), «entorno instalación» → 4, «git revert» → 1 (`l07`), «pruebas cobertura» → 2 con 1º = **`/curriculo/n0/m2/`** (prueba directa de que los módulos, páginas nuevas en el índice, se encuentran), consulta sin coincidencias → 0.
- `astro preview` + `curl`: 200 en `/`, `/curriculo/`, `/curriculo/n0/`, `/curriculo/n0/m1/`, **las 7 lecciones**, `/curriculo/n0/m2/` y `/buscar/`; 404 en `/curriculo/n0/m1/l99-no-existe/` y `/pagina-que-no-existe/`; títulos correctos («Buscar · Harness Engineering Platform», «Qué es programar y cómo se ejecuta un programa · …»).
- Inspección estática del `dist/`: 4×`aria-current="page"` en una lección (miga y cabecera de H2 + las dos variantes de barra lateral), 14 marcas con `hidden` (2 variantes × 7 lecciones) y 2 resúmenes «—», 16 `data-astro-prefetch` y 0 `<link rel="prefetch">`, 7 `data-pagefind-ignore`, 6 rótulos «Sin lecciones publicadas» (los módulos vacíos de `n0`), un resumen en el mapa (solo `n0/m1` tiene lecciones) y `/buscar/` con `role="status"`, `data-estado`, `data-resultados` y `noscript`.

Límites de H4 (no hecho a propósito o pendiente):

- **Sin pruebas visuales ni de teclado en navegador** (el navegador de escritorio no está conectado): todo lo anterior es verificación por comandos, HTML generado y sondas; la revisión visual queda para H6.
- En `astro dev` no existe el índice (se genera post-compilación): la interfaz muestra su estado de error documentado; la búsqueda se prueba con `npm run build` + `npm run preview`.
- La efectividad del prefetch en Firefox/Safari depende de las cabeceras de caché del hosting: comprobable tras el primer despliegue (H5).
- Progreso limitado a completadas + resumen (sin punto de lectura ni notas); en el cierre de H4 aún no había commits, CI ni despliegue externo: los dos primeros se hicieron en H5 (commit `9d16d60` + CI #1 verde), el despliegue sigue pendiente.

#### Decisiones de diseño de H4 (D26–D31)

26. **Dos variantes de barra lateral, una sola visible** (D26): en vez de un `<details>` (cuyo estado abierto/cerrado no se puede gobernar por CSS sin JS) o de una lista única larga en móvil, el componente renderiza el árbol del nivel (escritorio) y la lista compacta del módulo (móvil) y oculta la otra con `display:none` según `lg:`: una sola variante vive en el árbol de accesibilidad y en el orden de tabulación, sin JavaScript de por medio. El resumen se pinta por identificadores en todo el documento, así que resumen y marcas pueden vivir en contenedores distintos.
27. **Capa propia de búsqueda en vez de `@pagefind/default-ui`** (D27): la UI embebida añadiría una dependencia y sus estilos, y no cubre de serie los estados en español exigidos (cargando/sin resultados/error). Se implementa una capa mínima (~120 líneas, JavaScript nativo) sobre `pagefind.search()`/`result.data()` que sí los cubre, con el diseño del sistema; el único dependencia nueva es `pagefind` (CLI de build, sin `engines` ni `dependencies`, binarios por plataforma vía `optionalDependencies`: `darwin-arm64` en local y `linux-x64` en la imagen de Pages).
28. **Alcance del progreso: completadas + resumen** (D28): de las tres piezas que enumera §5.3, solo «lecciones completadas por id» y el resumen por módulo entran en H4 (lo pedido en el alcance del hito); «último punto de lectura» y «notas privadas» quedan pospuestos para no ampliar superficie sin necesidad. El almacenamiento guarda únicamente `{"n0/m1/l01-…": true}`.
29. **Prefetch con marcado explícito, no general** (D29): se evaluó antes de instalar nada (ya viene con Astro 7): solo los enlaces de navegación entre lecciones llevan `data-astro-prefetch`, la estrategia «hover» descarga únicamente bajo intención del usuario y el HTML inicial no contiene precargas, con lo que no aumentan las descargas iniciales ni las de móvil en reposo; el beneficio es la navegación prev/next y barra lateral (el flujo principal) más rápida.
30. **Globals de navegador en ESLint, `src/scripts` vía `astro check`** (D30): los `<script>` de los `.astro` (incluido el inline de restauración del progreso) se lintian con `globals.browser` declarado explícitamente en `devDependencies`; los módulos `src/scripts/*.ts` no pasan por ESLint (igual que el resto de `.ts`, coherente con H0) y se validan con `astro check` + Vitest.
31. **El índice tiene gate propio** (D31): en lugar de confiar en el exit 0 de la CLI, `pagefind:check` verifica la utilidad estructural del índice (presente, no vacío, coincidencia exacta con el contenido marcado, 404 fuera) dentro de `build:deploy`; la usabilidad real (búsquedas con resultados) se comprobó con la sonda de §10.4 sobre `astro preview`, que no es un gate automático porque Pagefind usa `fetch` de origen del navegador.

### 10.5 Registro de H5 — preparación y ejecución (19–20 de octubre de 2026)

Hito **en curso**: todas las fases de preparación completadas en local el **19-10-2026**; el **20-10-2026** se creó y publicó el commit inicial y el CI de GitHub se ejecutó en verde. Hito **cerrado el 21-10-2026**: Cloudflare y gate de rama se cerraron el 20-10-2026 y la **verificación en navegador** completó el último punto del §8.4 (punto 8) — ver las «Actualizaciones» más abajo.

**Fase 1 — Auditoría previa (hallazgos reales)**

- Git (instantánea del **19-10-2026**, antes del commit): rama `main`, **0 commits**, 24 entradas sin seguimiento (todo el proyecto H0–H4), **sin remoto** (`git remote -v` vacío). Identidad global de Git configurada en `~/.gitconfig` (nombre y correo de autoría; no se reproducen aquí): su uso daría esa autoría a los commits y haría visibles esos datos en el historial público (decisión del usuario); **en el commit real se usó identidad local propia** (`git config --local`), sin tocar la global — ver «Actualización (20-10-2026)» más abajo.
- Sin configuración de despliegue previa: no existen `wrangler.toml`, `.wrangler/`, `CNAME` ni ficheros `.env`; ninguna variable `CLOUDFLARE_*`/`GH_*`/`GITHUB_*` en el entorno. `gh` CLI instalado con la cuenta `raulferrer-ai` pero **token inválido** (sesión caducada): no puedo crear el repositorio hasta `gh auth login` o hasta que el usuario lo haga en la interfaz.
- Seguridad: `.gitignore` cubre `dist/`, `node_modules/`, `.astro/`, `coverage/`, logs y `.env*`; `.npmrc` solo contiene `engine-strict=true` (sin tokens); escaneo de patrones de secretos (`ghp_`, `github_pat_`, `AKIA…`, claves privadas, `Bearer…`, etc.) sobre los 24 ficheros a publicar: **0 coincidencias**; escaneo de correos en el contenido: **0** (ningún dato personal en ficheros). Los esquemas de colección **no tienen campo de estado/privacidad**: todo lo de `src/content` es público por diseño.
- Versiones reales: Node local v24.22.0, npm 11.19.1; `node_modules/astro/package.json` exige `node >=22.22.0` y `npm >=9.6.5`; `engines` del proyecto `^24.16.0`; `.nvmrc`/`.node-version` = `24.22.0`.
- Coherencia de scripts: el workflow referencia únicamente comandos existentes (`npm ci`, `npm run verify`, `npm run build:deploy`, este último = `verify && build && links && pagefind:check`).

**Fase 2 — Actualización de la documentación (19-10-2026)**

Actualizados `IMPLEMENTATION_PLAN.md` (cabecera, §6.2, §8.1, §8.2, §8.4 punto 1–10, §8.5 con el gate de cinco capas, fila H5 de la tabla de hitos y este §10.5 con las decisiones D32–D33) y `README.md` (estado, sección «Comprobaciones y CI» y tabla de despliegue): todos los estados reflejan únicamente lo verificado ese día, sin adelantar ejecuciones reales.

**Fase 3 — Workflow de GitHub Actions (D32)**

Respecto a H4, `ci.yml` pasa de (`verify`, `build`, `links`, `pagefind:check` sueltos) a: paso visible `npm run verify` + paso único `npm run build:deploy` (mismo alcance total, con la compilación de producción ejecutándose **una sola vez**, dentro del paso del gate, y paridad literal con el comando de despliegue de Cloudflare); se añaden `workflow_dispatch` (re-ejecución manual, necesaria para la prueba de fallo deliberado), `concurrency` con `cancel-in-progress` (cancela ejecuciones obsoletas del mismo push/PR) y se mantienen permisos `contents: read`, `actions/checkout@v7`, `actions/setup-node@v7` con `node-version-file: .nvmrc` y caché npm. Validación local realizada: parseo con la dependencia `yaml` (5 pasos; triggers `push`, `pull_request`, `workflow_dispatch`; `permissions: contents:read`) y `prettier --check` conforme. **Ejecutado en GitHub Actions el 20-10-2026** (CI #1 sobre `9d16d60` → «completed successfully», 47 s): la validación local y la ejecución real en GitHub son cosas distintas y ahora ya están **ambas** superadas.

**Fase 4 — Compatibilidad de Node con el build de Cloudflare (comprobada el 19-10-2026)**

Fuente: «Build image» de Cloudflare Pages (actualizada 16-10-2026). Imagen **v3**: Node.js **22.16.0** por defecto (por debajo del `>=22.22.0` de Astro 7); admite **cualquier versión** mediante la variable `NODE_VERSION` **o** los ficheros `.nvmrc`/`.node-version` (el repo trae ambos con `24.22.0`); en v3 **no** se detecta Node desde `engines` de `package.json`; npm «corresponde con la versión de Node» (11.x, y se exige `>=9.6.5`). Compatibilidad local confirmada con el propio `node -v`/`npm -v`. El sitio es puramente estático: **sin adaptador SSR**, sin Pages Functions, sin variables secretas.

**Fase 5 — Gate**: cinco capas y configuración exacta en §8.5 (D33). La capa de CI ya está verificada en un servicio real (CI #1 verde, 20-10-2026); las capas de Cloudflare Pages **todavía no se han ejecutado**.

**Completados (requerían al usuario; 20-10-2026)**: 1) Cloudflare conectado, desplegado y verificado (§8.2 y §8.4); 2) protección de `main` configurada y verificada (§8.5); 3) verificación posterior al despliegue y prueba de fallo deliberada (§8.4). **Pendiente**: ninguno — el último punto (verificación en navegador, §8.4.8) se completó el 21-10-2026 y H5 quedó **cerrado**.

**Actualización (20-10-2026) — ejecución real:**

- Commit inicial creado localmente y publicado: `9d16d601752b2b17536ee3397bdbea7f4ba0f9df` (152 ficheros, 14.828 líneas), con **identidad personal configurada solo en este repositorio** (`git config --local user.name/user.email`; `~/.gitconfig` corporativa intacta, mismo hash antes y después) y verificada con `git var GIT_AUTHOR_IDENT` antes de commitear.
- El **push lo ejecutó el usuario** con su cuenta personal (`raulferrer-ai`). Verificaciones anónimas posteriores: `remote.origin.url` sin credenciales (0 `@`), `.git/config` sin tokens ni helpers (`credential.helper` local vacío), y **solo `refs/heads/main`** en el remoto (sin tags ni otras ramas) con hash idéntico al local.
- **Primera ejecución real de GitHub Actions**: **CI #1 → «completed successfully»** sobre `9d16d60` (push a `main`, 20-10-2026, **47 s**): `npm ci` → `npm run verify` → `npm run build:deploy`. Esto valida en el servicio real lo que antes solo estaba validado en local.
- Actualizados en esta fecha: cabecera, §8.1, §8.5, esta sección y `README.md`.

**Actualización (20-10-2026, tarde) — segundo push, despliegue y verificación pública:**

- El usuario empujó `68d2d4e` (documentación; **CI #2 verde**) y conectó el repositorio a Cloudflare: proyecto **Workers + assets estáticos** (`harness-engineering-platform`, rama `main`, build command `npm run build`, deploy command `npx wrangler deploy`), publicado en `https://harness-engineering-platform.raul-ferrer-caio.workers.dev`.
- Verificación anónima completa del §8.4 sobre la URL real: contenido **correcto e íntegro** (idéntico al build local normalizando el hash del CSS que difiere por el rebuild en Linux), salvo **dos incidencias**: `dist/pagefind/` no está desplegado (la búsqueda quedará rota en el navegador) y la 404 responde con **cuerpo vacío**. Ambas apuntan a la configuración de assets del proyecto: sin `wrangler.jsonc`, Wrangler desplegó con valores por defecto (documentados: sin `not_found_handling` → 404 vacío).
- Corrección preparada en esta fecha: **`wrangler.jsonc` en la raíz del repo** (`assets.directory: ./dist` + `not_found_handling: "404-page"`, D34) y **cambio del build command del panel a `npm run build:deploy`** (el comando con gate completo); pendientes de commit/push, redespliegue y re-verificación, más el log de build (punto 10 del §8.4).

**Actualización (20-10-2026, cierre de las incidencias de despliegue):**

- El usuario **corrigió el build command** del panel a `npm run build:deploy`, **commiteó y empujó** el conjunto preparado (`7acd50b`: `wrangler.jsonc` + documentación; **CI #3 verde**, 3/3 ejecuciones en verde) y Cloudflare **redesplegó** con la configuración del repo.
- **Log del build (§8.4, punto 10)**: instalación `npm clean-install --progress=false` (= `npm ci`; 402 paquetes en 9 s con caché de dependencias), **Node 24.22.0 detectado del entorno (`.nvmrc`)** —mecanismo de la §8.2 confirmado en producción—, gate completo en verde (87/87 tests, 76 páginas, Pagefind 63, enlaces 1727 y 404 excluida) y `wrangler@4.151.2` subiendo **162 assets** (155 nuevos + 7 ya subidos): recuento idéntico al `dist/` local. Versión desplegada `cef5718d`.
- **Verificación posterior en la URL pública**: `/pagefind/pagefind.js` → 200 (`text/javascript`), `pagefind-entry.json` → JSON válido (idioma `es`), fragmentos del índice → 200 y rutas inexistentes → **404 con la página del sitio**. Cerradas las incidencias de `pagefind/` y de la 404 (puntos 3 y 4 del §8.4 en verde).
- **H5 cerrado (21-10-2026)**: la verificación en navegador completó el último punto del §8.4 — ver «Actualización (21-10-2026, verificación en navegador y cierre de H5)» más abajo.

**Actualización (20-10-2026, gate de rama y prueba de fallo deliberada):**

- El usuario **configuró la protección de `main`** (D33 → **activo**) con una *ruleset* en *Settings → Rules*: «Comprobaciones y compilación», `enforcement: active`, condición `refs/heads/main`, `required_status_checks.context` = «Comprobaciones y compilación» (`integration_id` 15368 = GitHub Actions), más `deletion` y `non_fast_forward` (sin `strict` ni exigencia de PR).
- **Prueba de fallo deliberada (§8.4.5)**: rama local `prueba/fallo-deliberado` con un test rojo (`npm run verify` → exit 1) → push de `56fc6a9` → **PR #1** → check «Comprobaciones y compilación (pull_request)» en **failure** con etiqueta **`Required`** y **botón «Merge pull request» deshabilitado** («All checks have failed»); después el usuario cerró el PR (**`merged: False`**) y borró la rama (local y remoto). **El gate bloquea la fusión de PRs con CI rojo.**
- Matiz técnico: `mergeable_state: unstable` (REST) = «mergeable with non-passing commit status» (enum `MergeStateStatus` del esquema GraphQL): ese campo no refleja la ruleset — el bloqueo se ejerce al fusionar (UI/API), no en ese campo.
- Cloudflare intentó además un **preview de rama** en el PR («Deploying Preview to Cloudflare») y su build falló con el mismo gate → sin preview publicado; producción intacta (solo despliega `main`).
- **Consecuencia verificada el mismo día**: el ruleset **también rechaza pushes directos a `main`**: el intento de publicar este commit falló con `remote: error: GH013: Repository rule violations found for refs/heads/main — Required status check "Comprobaciones y compilación" is expected` y no existe forma de que el check reporte antes de que el commit aterrice. Flujo resultante: **PR obligatorio con CI verde** para cualquier cambio en `main` (este mismo documento viajó así).
- **H5 cerrado (21-10-2026)**: la verificación en navegador (§8.4, punto 8) completó el hito.

**Actualización (21-10-2026, verificación en navegador y cierre de H5):**

- El navegador se adjuntó a la sesión mediante la **app de escritorio de OpenCode** (la herramienta `browser` no está disponible desde la CLI): pestaña única sobre la URL pública.
- **Home**: título correcto, documento/CSS/JS → 200 y **0 errores de consola**.
- **Buscador en vivo** (`/buscar/`): al escribir «Git» se cargan `/pagefind/pagefind.js` y `pagefind-worker.js` (200) y aparecen **5 resultados reales** («5 resultados para «Git»», encabezados por l07 «Primeros pasos con Git» y n0/m5).
- **Progreso**: `checkbox#progreso-leccion` marcado con teclado (el árbol de accesibilidad se trunca en páginas largas: sin ref para clic) → `checked: true` y `localStorage["hep.progreso.v1"] = {"n0/m1/l01-que-es-programar":true}`; resumen **«1 de 7 lecciones · 14 %»** en la lección y en `/curriculo/n0/m1/` (l01 «✓ completada»); **persiste tras recarga**; el dato de prueba se borró al terminar.
- **404 y navegación**: ruta inexistente → «Página no encontrada…» con `h1` «Esta página no existe» y enlace a inicio; atrás/adelante navegan bien (módulo ↔ lección); **0 errores de consola** en toda la ruta.
- Observación: el CSS del despliegue actual tiene hash `ByQnelms`, **idéntico al build local**; la diferencia `CPseglJG` del 20-10 correspondía al rebuild anterior.
- **H5 queda COMPLETO** (puntos 1–10 del §8.4 en verde). **Siguiente hito: H6** (documentación de ejecución y mantenimiento + auditoría manual a11y).

#### Decisiones de diseño de H5 (D32–D34)

32. **CI: paso `verify` visible + paso `build:deploy`** (D32): el pipeline ejecuta `npm run verify` como paso propio (fallo rápido y visible en la interfaz de GitHub) y después `npm run build:deploy`, que es literalmente el comando de despliegue de Cloudflare (vuelve a incluir `verify`, por lo que la comprobación completa se ejecuta dos veces), mientras que **la compilación de producción corre una sola vez**, dentro del paso del gate. Se añaden `workflow_dispatch` y `concurrency: cancel-in-progress`, con permisos `contents: read` y acciones `checkout@v7`/`setup-node@v7`.
33. **Exigir CI verde = protección de rama en GitHub, no un ajuste de Cloudflare** (D33): Pages no ofrece «no desplegar producción si falla el CI de GitHub»; sí ofrece (a) que su propio build falle y no publique nada, y (b) publicar status checks en el repositorio. El gate de fusión se configura en GitHub (required status check «Comprobaciones y compilación» sobre `main`; gratuito en repos públicos) y, como Pages despliega producción desde `main`, eso encadena CI verde → publicación. Estado: **ACTIVO y VERIFICADO (20-10-2026)** — ruleset «Comprobaciones y compilación» sobre `main` + PR #1 con check rojo no fusionable (§8.4, fila 5, y §8.5).
34. **Configuración de despliegue en el repo (`wrangler.jsonc`), no solo en el panel** (D34): el proyecto real es tipo **Workers con assets estáticos**, y su comportamiento de assets (qué directorio servir y qué hacer con las rutas inexistentes) se gobierna por el fichero de configuración de Wrangler. Al comprometerlo, el repositorio vuelve a ser la única fuente de verdad del despliegue (auditable, versionada y reproducible): `assets.directory: ./dist`, `not_found_handling: "404-page"` (la 404 del sitio, con status 404, como en Pages) y `compatibility_date` fijado. Sin `main`: despliegue de **assets puro**, sin funciones ni SSR, coherente con `VISION.md`. Sintaxis verificada en la documentación oficial («Static Assets», actualizada 12-10-2026): sin esa configuración, las rutas sin asset devuelven un 404 vacío —comportamiento observado el 20-10-2026—.

### 10.6 Registro de H6 — documentación y auditoría a11y (21 de octubre de 2026)

Hito ejecutado en la rama `docs/h6-mantenimiento-a11y`, partiendo de `main` = `3133403` (merge del PR #3 que cerró H5). Dos entregables:

**1. Documentación de ejecución y mantenimiento (`docs/MANTENIMIENTO.md`)**

Nueve secciones: requisitos (Node 24.22.0 desde `.nvmrc`; sin secretos ni variables), desarrollo local, el gate (`build:deploy` y su desglose de comandos), **flujo de cambios obligatorio** (rama → PR → CI verde → merge, con la convención de commits y la identidad local de Git), despliegue y checklist de verificación posterior en producción, cómo añadir contenido (colecciones de `src/content.config.ts` y pasos de una lección nueva), mantenimiento rutinario (dependencias, Node, a11y, contraste de la paleta), tabla de solución de problemas (basada en las incidencias reales de H5: `pagefind:check`, GH013, 404 vacía sin `wrangler.jsonc`) y el alcance explícito de lo que el proyecto NO tiene.

**2. Auditoría de accesibilidad (`docs/AUDITORIA_A11Y.md`, checklist firmada)**

- **Método**: Lighthouse (categorías accessibility/best-practices/SEO) vía el navegador adjunto a la sesión, en modo **desktop** (así lo reporta `configSettings.formFactor` del informe); recorridos manuales de teclado; inspección del DOM y del CSS compilado; ratios WCAG calculados con la fórmula de luminancia relativa sobre OKLCH→sRGB (la conversión se validó reproduciendo el #7C808A que axe reportó).
- **Primera pasada (producción)**: home con **accessibility 0.9** y dos reglas de axe en rojo: `color-contrast` (15 nodos) y `list` (1 nodo).
- **Hallazgos corregidos en la misma rama** (4 ficheros):
  1. `--color-ink-faint` (`oklch(0.6 …)` = #7C808A) como texto auxiliar real daba 3.69:1 sobre paper → token a `oklch(0.53 0.015 265)`: **4.93:1 paper / 5.28:1 surface / 4.59:1 accent-soft** (`src/styles/global.css`).
  2. Comentarios de Shiki (`#6A737D` sobre `#24292e` = 3.05:1) → override CSS a `#8B949E` (**4.77:1**). `markdown.shikiConfig.colorReplacements` **no surtió efecto** con `@astrojs/mdx@8.1.0` + `shiki@4.5.0` (probado contra la API con claves en ambas capitalizaciones); el resto de tokens del tema se auditaron uno a uno (mínimo 5.52:1) (`src/styles/global.css`).
  3. El skip link movía el hash pero **no el foco** (el `<main>` no era enfocable) → `tabindex="-1"` en `main#contenido` (`src/layouts/BaseLayout.astro`); verificado: Enter → foco en `MAIN#contenido` → siguiente Tab dentro del contenido.
  4. La `ol` de fases de la home renderizaba `<div>` como hijos directos → `Card` acepta la prop `como` (por defecto `div`, retrocompatible) y la home usa `<Card como="li">` (`src/components/ui/Card.astro`, `src/pages/index.astro`).
- **Verificación final**: **accessibility 1.0 en 11 rutas** (home, currículo, módulo, 3 lecciones —una con bloques de código—, buscar, proyecto, enfoque, glosario y 404) con **0 fallos de axe y 0 errores de consola**; superadas además la checklist manual: skip link con foco real, búsqueda **solo con teclado** (Tab×9 → «git» → «5 resultados para «git»» → Enter → l07), marcar lección con teclado, `aria-current="page"` (4 ocurrencias), landmarks, jerarquía de encabezados (1 `h1` por página) y `prefers-reduced-motion` presente.
- **Responsive (§4.4 y §5.1)**: verificado lo medible sin emulador — `meta viewport` correcto, **0 anchos fijos ≥321 px** en el CSS compilado, breakpoints `40rem`/`64rem` mobile-first. **Pendiente honesto**: la verificación visual en viewport móvil de 320 px y en dispositivo real; la herramienta Lighthouse de esta sesión solo corre en modo desktop y no se afirma lo no medido.
- **Ratio de contraste del token `--color-ink-soft`** sobre paper: 7.23:1 (medido; el comentario del token en el CSS decía «≥4.5:1» antes de que la auditoría lo verificara con precisión).

**Nota de proceso**: tras la activación del gate de rama (D33), H6 viajará —al igual que el cierre de H5— por **rama → PR → CI verde → merge**; esta sección se documenta antes del PR y el checklist de `docs/AUDITORIA_A11Y.md` queda como prueba firmada en el historial.

---

### 10.7 Registro de H7 — contenido `n0/m2` (21 de octubre de 2026)

Hito ejecutado en la rama `feat/n0-m2-tipos-variables-funciones`, partiendo de `main` = `51af949` (merge del PR #4 que cerró H6). Es el primero de la fase de ampliación de contenido aprobada («un módulo por hito»).

**Contenido publicado** (`src/content/modulos/n0/m2/`)

- **7 lecciones** con la plantilla obligatoria de CURRICULUM.md §6 (secciones en el orden exacto validado por `tests/content/curriculo.test.ts`) y prerrequisito en cadena desde `n0/m1/l07-primeros-pasos-con-git`: `l01-valores-tipos-y-variables`, `l02-const-let-y-ambito`, `l03-textos-y-plantillas`, `l04-numeros-precision-y-conversion`, `l05-funciones-contrato-y-entrada`, `l06-objetos-como-modelos` y `l07-componer-funciones-pequenas`. Cuerpo editorial añadido al `index.mdx` del módulo (público y cierre).
- **15 ficheros de ejemplo ejecutables** en `ejemplos/` (`src/content/modulos/n0/m2/ejemplos/`): 5 módulos con sus pruebas (`normalizar` 4, `dinero` 4, `dividir` 4, `articulo` 5, `descripcion-articulo` 3 = **20 pruebas `node --test` en verde, 0 en rojo**), 2 scripts verdes (`tipos.js`, `variables.js`) y **3 rojos deliberados** con su clase verificada ejecutando: `errores/acceso-undefined.js` (`TypeError`), `errores/const-reasignada.js` (`TypeError: Assignment to constant variable.`) y `errores/tdz.js` (`ReferenceError: Cannot access 'total' before initialization`), los tres con código 1.
- **Toda salida documentada en las lecciones es real**: ejemplos, rojos deliberados y soluciones de los ejercicios se ejecutaron el 2026-10-21 con Node v24.22.0 antes de escribirse (incluidos los rojos registrados: `dinero` sin `Math.round` → `+ 30.000000000000004 / - 30`; `articulo` sin `Object.freeze` → «Missing expected exception (TypeError).»; `descripcion-articulo` sin `normalizar` → diff de mayúsculas). Las cinco soluciones de ejercicio (`capitalizar` 2/2, prueba `19.99` + rojo `Math.trunc` con `1998 !== 1999`, `factorial` 4/4, `crearCliente` 2/2, `aplicarDescuento` 3/3) también se ejecutaron y pasan a documentarse.
- **Fuentes**: MDN y Node.js v24.x, todas verificadas con HTTP 200 el 2026-10-21 antes de citarse (se descartaron dos rutas 404 de MDN: `Guide/Using_objects` y `Guide/Detailed_object_guide`).

**Tests** (`tests/content/ejemplos.test.ts` ampliado, +16)

- `describe` nuevo «ejemplos del módulo n0/m2: ejecución real»: 5 casos directos (con código de salida y clase de error), salida exacta documentada de `tipos.js` y `variables.js`, las 5 suites con su recuento de pruebas, la suite completa (`node --test` → `tests 20 / pass 20 / fail 0`) y 2 rojos registrados en carpetas temporales (dinero sin `Math.round`, articulo sin `Object.freeze`).
- Cobertura sin huérfanos **por módulo**: los manifiestos de `m1` y `m2` se comparan con el disco por separado (helper `archivosVerificables`).

**Coherencia**: m1/l07 dejó de decir que las lecciones de m2 «se publican en la siguiente fase» y ahora enlaza su `l01`; `README.md` actualizado con el estado y las métricas reales.

**Validación realizada**: `npm run format` (sin cambios pendientes tras aplicarse), `npm run build:deploy` exit 0 — `astro check` 0 errores/0 avisos, ESLint limpio, **103/103 tests** (87 de H6 + 16 nuevos), build con **83 páginas** (76 + 7 lecciones), `npm run links` → «Enlaces internos OK: 2042 comprobados en 83 páginas HTML (31 externos omitidos)» y Pagefind → «70 páginas indexadas = 70 ficheros con data-pagefind-body de 83 HTML». Corregido en el camino un enlace rojo real detectado por el gate: m2/l07 apuntaba a `/proyecto/`, ruta inexistente (la fase `f1` vive en la home, como en m1/l07).

**Nota de proceso**: al igual que H6, H7 viajará por **rama → PR → CI verde → merge** (gate de rama activo desde D33); esta sección se documenta antes del PR.

**Pendiente siguiente** (no forma parte de H7): `n0/m3` «Control de flujo y estructuras de datos», entregable «Script que procesa un fichero real».

---

### 10.8 Registro de H8 — contenido `n0/m3` (21 de octubre de 2026)

Hito ejecutado en la rama `feat/n0-m3-control-flujo-estructuras`, partiendo de `main` = `a349c56` (merge del PR #5 que cerró H7). Segundo hito de la fase de ampliación de contenido aprobada («un módulo por hito»).

**Contenido publicado** (`src/content/modulos/n0/m3/`)

- **7 lecciones** con la plantilla obligatoria de CURRICULUM.md §6 (orden de secciones validado por `tests/content/curriculo.test.ts`) y prerrequisito en cadena desde `n0/m2/l07-componer-funciones-pequenas`: `l01-decisiones-if-else-y-switch`, `l02-bucles-for-while-y-control`, `l03-arrays-listas-de-datos`, `l04-transformar-listas-map-filter-reduce`, `l05-diccionarios-map-y-set`, `l06-leer-un-fichero-real` y `l07-informe-de-gastos-entregable`. Cuerpo editorial añadido al `index.mdx` del módulo (público y cierre).
- **17 ficheros en `ejemplos/`**: 7 módulos con sus pruebas (`clasificar` 4, `acumular` 4, `gastos` 4, `estadisticas` 4, `resumen-categorias` 3, `leer-gastos` 6, `informe` 3 = **28 pruebas `node --test` en verde, 0 en rojo**), el script entregable `demo-informe.js`, el fichero real `datos/gastos.csv` (cabecera + 8 gastos con acentos y campos con espacio) y **1 rojo deliberado**: `errores/fuera-de-rango.js` (`TypeError: Cannot read properties of undefined (reading 'importe')`, código 1).
- **Toda salida documentada en las lecciones es real**: ejemplos, rojos y ejercicios se ejecutaron el 2026-10-21 con Node v24.22.0 antes de escribirse. Informe capturado (`gastos: 8 / total: 83.69 EUR / media: 10.46 EUR / máximo: 42.30 EUR` y categorías `comida 8.00`, `hogar 42.30`, `ocio 27.99`, `transporte 5.40`); **2 rojos registrados** en los tests de cobertura (`agregarGasto` con `push` → `pass 3 / fail 1` con `2 !== 1`; `parseGastos` sin `.slice(1)` de la cabecera → `pass 2 / fail 4`); **7 soluciones de ejercicio ejecutadas** (recargo 3/3, contar 2/2, insertar 2/2, mayoria 2/2, principal 3/3, fixture 2/2, top 3/3). Dos fallos de las propias pruebas de ejercicio se detectaron y corrigieron antes de documentar (umbral `2` que dejaba pasar el gasto de `2.5`, y `19` donde el CSV real indica `18.99`).
- **Fuentes**: las 22 URLs citadas (MDN y Node.js v24.x) verificadas con HTTP 200 el 2026-10-21 antes de citarse.

**Tests** (`tests/content/ejemplos.test.ts` ampliado, +14)

- `describe` nuevo «ejemplos del módulo n0/m3: ejecución real»: 2 casos directos (`demo-informe.js` → código 0 con «Informe de gastos»; `errores/fuera-de-rango.js` → `TypeError` con código 1), la salida **exacta** de `demo-informe.js` (10 líneas), las 7 suites con su recuento de pruebas, la suite completa (`node --test` → `tests 28 / pass 28 / fail 0`) y los 2 rojos registrados en carpetas temporales (mutación con `push`, cabecera sin saltar).
- Cobertura sin huérfanos **por módulo**: el manifiesto de `m3` se compara con el disco junto a los de `m1` y `m2` (helper `archivosVerificables`).

**Coherencia**: `n0/m2/l07` dejó de decir que las lecciones de m3 «se publican en la siguiente fase» y ahora enlaza su `l01`; `README.md` actualizado con el estado y las métricas reales.

**Validación realizada**: `npm run format` (sin cambios pendientes tras aplicarse), `npm run build:deploy` exit 0 — `astro check` 0 errores/0 avisos, ESLint limpio, **117/117 tests** (103 de H7 + 14 nuevos), build con **90 páginas** (83 + 7 lecciones), `npm run links` → «Enlaces internos OK: 2368 comprobados en 90 páginas HTML (53 externos omitidos)» y Pagefind → «77 páginas indexadas = 77 ficheros con data-pagefind-body de 90 HTML; 404 excluida».

**Nota de proceso**: al igual que H6 y H7, H8 viajará por **rama → PR → CI verde → merge** (gate de rama activo desde D33); esta sección se documenta antes del PR.

**Pendiente siguiente** (no forma parte de H8): `n0/m4` «Estructura de proyectos y dependencias», entregable «Proyecto con 3 módulos y README».

---

### 10.9 Registro de H9 — contenido `n0/m4` (21 de octubre de 2026)

Hito ejecutado en la rama `feat/n0-m4-estructura-proyectos-dependencias`, partiendo de `main` = `2145c7f` (merge del PR #6 que cerró H8). Tercero de la fase de ampliación de contenido aprobada («un módulo por hito»).

**Contenido publicado** (`src/content/modulos/n0/m4/`)

- **7 lecciones** con la plantilla obligatoria de CURRICULUM.md §6 (orden de secciones validado por `tests/content/curriculo.test.ts`) y prerrequisito en cadena desde `n0/m3/l07-informe-de-gastos-entregable`: `l01-import-export-partir-el-codigo`, `l02-estructura-carpetas-y-package-json`, `l03-pruebas-que-cruzan-modulos`, `l04-dependencias-instalar-poco-fijar-todo`, `l05-elegir-una-dependencia-con-criterio`, `l06-readme-documentar-lo-verificado` y `l07-proyecto-con-3-modulos-y-readme`. Cuerpo editorial añadido al `index.mdx` del módulo (público y cierre).
- **21 ficheros en `ejemplos/`**: 5 módulos utilitarios con sus pruebas (`convertir` 3, `revisar-manifiesto` 4, `dependencias` 4, `candidato` 4, `revisar-readme` 3 = **18 pruebas**), el mini-proyecto `proyecto/` (los 3 módulos `src/` —`gastos`, `informe`, `main`— con `test/proyecto.test.js`: **6 pruebas**, **24 en total**), `package.json` con sus scripts, `package-lock.json` **generado con `npm install` real** (lockfileVersion 3; con 0 dependencias npm no crea `node_modules/`), `README.md` con las cinco secciones mínimas y el CSV real copiado de m3, y **2 rojos deliberados**: `errores/import-inesistente.js` y `errores/dependencia-ausente.js`, ambos `ERR_MODULE_NOT_FOUND` con código 1.
- **Tres hallazgos reales verificados y documentados** (no inventados): (1) `nanoid` no sirvió como rojo porque el resolvedor de Node **sube por las carpetas madre** y lo encontró instalado en el árbol de la academia (dependencia transitiva): el rojo se cambió a `left-pad` y el hallazgo se documenta en l04 como advertencia; (2) `node --test test/` (carpeta como argumento) **no funciona** en Node v24.22.0 (`MODULE_NOT_FOUND` sobre la carpeta): el script del proyecto usa `node --test` con descubrimiento automático; (3) la detección automática de sintaxis de módulos hace que la suite del proyecto pase **incluso sin** `"type": "module"` (6/6 en copia temporal): el rojo previsto para l02 se sustituyó por un manifiesto con JSON roto y la matización consta en «Errores comunes».
- **Toda salida documentada es real** (ejecutada el 2026-10-21 con Node v24.22.0 antes de escribirse): el informe del entregable (idéntico al de m3: `total: 83.69 EUR`, `media: 10.46 EUR`, `máximo: 42.30 EUR`, 4 categorías), las salidas de los 6 casos directos verdes, las 6 suites con sus `✔`, la suite completa (`tests 24 / pass 24 / fail 0`), los **3 casos rojos registrados** (manifiesto JSON roto → `TypeError` con código 1; README sin «## Cómo verificar» → `- falta ## Cómo verificar` con código 1; CSV ausente → `error: no existe el fichero` con código 1) y las **7 soluciones de ejercicio ejecutadas** en carpetas temporales (etiqueta 2/2, manifiesto 2/2, integración 2/2, lock 2/2, veredictos 3/3, readme 2/2 y la secuencia de entrega de l07 completa).
- **Fuentes**: las 12 URLs citadas (Node.js v24.x, npm Docs y MDN) verificadas con HTTP 200 el 2026-10-21; `using-npm/semver` y `using-npm/dependencies` daban 404 y se sustituyeron por `about-semantic-versioning` y el ancla `#dependencies` de `package-json`, ambos verificados.

**Tests** (`tests/content/ejemplos.test.ts` ampliado, +21)

- `describe` nuevo «ejemplos del módulo n0/m4: ejecución real»: 10 casos directos (los 6 verdes, `main.js` con CSV → 0 y sin argumento → 1, y los 2 rojos), las 6 suites con su recuento, la suite completa (`tests 24 / pass 24 / fail 0`) y 3 casos rojos registrados (2 en carpetas temporales, 1 directo).
- `CasoDirecto` gana el campo opcional `argumentos` (para el CLI del proyecto) y `archivosVerificables` gana subcarpetas y datos adicionales: el manifiesto de m4 cubre sus **21 ficheros** (JS, datos incluidos) sin huérfanos.
- La primera ejecución del gate detectó dos fallos propios, corregidos antes de documentar: `dificultad: "basico"` no pertenece al enum (`inicial|intermedio|avanzado|experto`; corregido a `inicial` en l06) y los 4 ficheros de datos faltaban en la lista esperada del manifiesto.

**Coherencia**: `n0/m3/l07` dejó de apuntar solo a la ficha de m4 y ahora enlaza su `l01`; `README.md` actualizado con el estado y las métricas reales.

**Validación realizada**: `npm run format` y `npm run build:deploy` exit 0 — `astro check` 0 errores/0 avisos, ESLint limpio, **138/138 tests** (117 de H8 + 21 nuevos), build con **97 páginas** (90 + 7 lecciones), `npm run links` → «Enlaces internos OK: 2687 comprobados en 97 páginas HTML (73 externos omitidos)» y Pagefind → «84 páginas indexadas = 84 ficheros con data-pagefind-body de 97 HTML; 404 excluida».

**Nota de proceso**: H9 viajó por **rama → PR → CI verde → merge** (gate de rama activo desde D33): rama `feat/n0-m4-estructura-proyectos-dependencias`, **PR #7**, CI `completed/success` y merge a `main` en `085bf31` (verificado el 21-10-2026 vía API pública de GitHub).

**Pendiente siguiente** (ya completado como H10): `n0/m5` «Control de versiones con Git», entregable «Flujo completo rama → revisión → fusión», que cierra la fase `f1` del proyecto longitudinal («Git limpio y CI mínimo»). *(Corrección 21-10-2026, detectada en H11: `m5` cierra la **parte «Git limpio»** de `f1`, no la fase entera; `f1` se cierra con el nivel `n0` completo — faltan `n0/m6` y `n0/m7`.)*

### 10.10 Registro de H10 — contenido `n0/m5` (21 de octubre de 2026)

**Rama**: `feat/n0-m5-control-versiones-git` (desde `085bf31`, el merge del PR #7 de H9). Se documenta antes del PR.

**Entregado**: el quinto módulo del nivel `n0`, `n0/m5` «Control de versiones con Git» (7 lecciones + 9 ficheros de ejemplo), que construye sobre lo cubierto en `n0/m1/l07` (init, commit, diff, revert y rama básica) sin duplicarlo.

**Las 7 lecciones** (plantilla de CURRICULUM.md §6, orden de secciones verificado por `tests/content/curriculo.test.ts`):

| # | Slug | Dificultad | Tiempo |
|---|------|-----------|--------|
| l01 | `l01-el-historial-como-contrato` | intermedio | 45 min |
| l02 | `l02-revisar-el-diff-antes-de-publicar` | intermedio | 45 min |
| l03 | `l03-recuperar-versiones-restore-stash-y-reflog` | intermedio | 50 min |
| l04 | `l04-el-remoto-origin-push-fetch-y-pull` | intermedio | 50 min |
| l05 | `l05-ramas-por-cambio-feature-branch` | intermedio | 45 min |
| l06 | `l06-la-revision-el-diff-como-conversacion` | intermedio | 45 min |
| l07 | `l07-flujo-completo-rama-revision-fusion` | intermedio | 60 min |

**Los 9 ficheros de ejemplo** (`src/content/modulos/n0/m5/ejemplos/`), todos ejecutados con **Git 2.50.1** y **Node v24.22.0** el 21-10-2026:

- **Verdes** (código `0`): `repositorio-proyecto.sh` (historial del proyecto de m4 en 4 commits con `--stat`), `revisar-diff.sh` (los tres diffs: sin preparar, preparado y entre commits), `recuperar-versiones.sh` (`restore --staged`, `stash push/pop` y recuperación de un commit tras `reset --hard`), `remoto-local.sh` (remoto `origin` con `git init --bare`, `push -u`, `fetch` y `pull --ff-only` sin red), `ramas-feature.sh` (rama por cambio, `merge --no-ff`, `branch -d`) y `revision.sh` (revisión con `git log main..rama --stat` y `git diff main...rama`).
- **Suite del entregable**: `flujo-completo.test.js` — **7 pruebas `node --test` en verde** que ejercitan el flujo completo contra Git real vía `child_process`: historial, aportación de la rama, diff de tres puntos, fusión `--no-ff`, push al remoto, rechazo de push divergente con recuperación por `pull` y recuperación por `reflog` tras `reset --hard`.
- **Rojos deliberados** (`errores/`, código `1` documentado): `conflicto-merge.sh` (imprime `CONFLICT (content)` y marcadores `<<<<<<<`/`>>>>>>>` en stdout) y `push-rechazado.sh` (imprime `! [rejected] ... (fetch first)` en stderr).

**Cobertura de tests** (`tests/content/ejemplos.test.ts`, ampliado a m5):

- `describe` nuevo «ejemplos del módulo n0/m5: ejecución real (requiere git)»: 6 demos verdes con sus marcas de salida reales, la suite del entregable (`pass 7 / fail 0`), los 2 rojos `.sh` con sus códigos y mensajes reales, y **2 rojos registrados** en temporales (commit sin cambios → `1` con «nothing to commit»; `git switch` a rama inexistente → `128` con «fatal: invalid reference»).
- El helper `archivosVerificables` gana soporte de `.sh` en `errores/` (antes solo `.js`): el manifiesto de m5 cubre sus **9 ficheros** sin huérfanos.
- Durante H10 se corrigieron dos fallos propios detectados al ejecutar, antes de documentar: la marca de salida de `revision.sh` usaba `$rama` en la aserción del test (Git expande la variable, pero el texto esperado debe ser `main...formatea-importes`), y el mensaje de push rechazado real es `(fetch first)`, no `non-fast-forward`.
- **Corrección tras el primer CI rojo (§10.10)**: la primera pasada de CI falló en el bloque m5 porque el test imponía las marcas `main..formatea-importes` / `main...formatea-importes`, pero los scripts imprimen la variable `rama` (obtenida con `git symbolic-ref --short HEAD`, a propósito portátil) y el runner de GitHub Actions crea la rama por defecto `master`. Es decir, el fallo era del **test** (dependía de un nombre de rama por defecto no portable), no de los scripts ni del contenido. Se corrigió haciendo el test portable: las marcas verifican ahora la esencia del comando (`$ git log ` + `..formatea-importes --stat` y `$ git diff ` + `...formatea-importes`) sin imponer el nombre de la rama base. Validado reproduciendo el runner localmente (con `git init -b master`): las marcas nuevas matchean bajo `master` y bajo `main`.

**Coherencia**: `n0/m4/l07` ahora enlaza `n0/m5/l01` (no solo la ficha de m5); `src/content/modulos/n0/m5/index.mdx` actualizado con cuerpo, índice de las 7 lecciones y fecha 2026-10-21; las 15 fuentes citadas (git-scm.com/docs, Pro Git, Node.js `child_process` y GitHub Docs «About pull requests») verificadas con **HTTP 200** el 21-10-2026.

**Pendiente siguiente** (no forma parte de H10): el nivel `n0` queda con **5 de sus 7 módulos** publicados (m1–m5). *(Corrección 21-10-2026, detectada en H11: este párrafo decía erróneamente «el nivel `n0` queda completo (m1–m5)»; CURRICULUM.md §3 define 7 módulos para `n0` y faltan `n0/m6` «Pruebas y depuración» y `n0/m7` «Fundamentos web: HTML, CSS y HTTP», con ficha pero sin lecciones ni ejemplos — ver §10.11, corrección de alcance.)* Sigue la decisión D-plan (un módulo por hito) con `n1/m1` «Desarrollo asistido por IA», primer módulo del nivel `n1` y puerta al contenido central de VISION.md. *(Ya completado como H11: §10.11.)*

### 10.11 Registro de H11 — contenido `n1/m1` (21 de octubre de 2026)

**Rama**: `feat/n1-m1-modelos-de-codigo` (desde `4248e10`, el merge del PR #8 de H10). Se documenta antes del PR.

**Entregado**: el primer módulo del nivel `n1`, `n1/m1` «Cómo funcionan los modelos de código» (6 lecciones + 10 scripts ejecutables + `nota-ejemplo.md`). Es el primer módulo **conceptual** del currículo: su entregable es «Una nota técnica con fuentes citadas y fecha», no código de producción. La tensión con CURRICULUM.md §6 («un concepto importante → un ejemplo **y** un ejercicio») se resuelve con scripts que **miden y demuestran límites reales** usando **solo librería estándar** — sin dependencias, sin red y sin claves de API — de modo que todo el módulo se verifica offline con Node v24.22.0, igual que el resto de la plataforma.

**Las 6 lecciones** (plantilla de CURRICULUM.md §6, orden de secciones verificado por `tests/content/curriculo.test.ts`):

| # | Slug | Dificultad | Tiempo |
|---|------|-----------|--------|
| l01 | `l01-modelos-de-lenguaje-como-prediccion` | inicial | 45 min |
| l02 | `l02-los-limites-del-entrenamiento` | intermedio | 50 min |
| l03 | `l03-la-ventana-de-contexto` | intermedio | 55 min |
| l04 | `l04-contexto-y-sensibilidad` | intermedio | 50 min |
| l05 | `l05-la-verificacion-es-tu-limite` | intermedio | 55 min |
| l06 | `l06-nota-tecnica-con-fuentes` | avanzado | 60 min |

**Los 11 ficheros de ejemplo** (`src/content/modulos/n1/m1/ejemplos/`), todos ejecutados con **Node v24.22.0** el 21-10-2026:

- **Verdes** (7, código `0`): `tokenizar.js` (tokenizador ilustrativo con export y guard: la frase de 80 caracteres → 15 tokens, relación 0,188; `«harness-engineering-plataforma»` → 5 tokens), `alucinacion-api-inexistente.js` (el «método» inventado suena plausible sin red), `ventana-contexto.js` (desbordamiento en ventana de 400: 1092 tokens → 692 fuera, el modelo ve el 36,6 %), `coste-contexto.js` ($0.004400 la llamada con precios de referencia; 8 turnos reenviando historial → $0.047900 acumulados), `sensibilidad-contexto.js` (misma pregunta con 3 contextos → `fs/promises`, `HTTP` y `JSON`), `comprobar-claim.js` (2 `VERIFICADO` + 1 `REFUTADO`) y `comprobar-nota.js` (validador del entregable: `nota-ejemplo.md` → `0` con 3 afirmaciones y 2 fuentes).
- **Rojos deliberados** (`errores/`, código `1` documentado): `api-inexistente.js` (`TypeError: usuarioClient.getUsuarioAsync is not a function` en stderr), `ventana-excedida.js` (`Error: el contexto excede la ventana (720 > 400)`), `claim-refutado.js` (`REFUTADO — «parsearFilas valida el número de columnas»` en stderr con las filas reales `["a","1"],["b"]`).
- **Los 6 bloques `## Ejercicio`** se extrajeron del MDX y se ejecutaron **literalmente** desde `src/content/modulos/n1/m1/` (rutas relativas incluidas: `cp ../ejemplos/...` y el `cp ../../../../../lib/schemas.ts` del l03): los seis con las salidas documentadas en sus lecciones; el directorio `taller/` que crea cada ejercicio se borra tras la ejecución (comprobado: `m1/` queda con `ejemplos/`, `index.mdx` y `lecciones/`).

**Entregable del módulo**: `comprobar-nota.js` convierte la calidad del entregable en una condición ejecutable — 5 secciones obligatorias, ≥3 afirmaciones numeradas y, por cada fuente, URL `http(s)` y fecha `AAAA-MM-DD`. `nota-ejemplo.md` pasa (`NOTA VÁLIDA`, código `0`); una nota con las fechas borradas falla (código `1` con «fuente sin fecha de consulta»), como se ejecutó en el ejercicio de l06.

**Cobertura de tests** (`tests/content/ejemplos.test.ts`, ampliado a n1/m1): `describe` nuevo «ejemplos del módulo n1/m1: demos ejecutables (solo librería estándar)» con **7 demos verdes** con sus marcas de salida reales, **3 rojos** con sus códigos y mensajes reales y **1 nota rota** generada en un temporal (→ `1` con «fuente sin fecha de consulta»), más la prueba de cobertura del manifiesto: los **11 ficheros** del módulo sin huérfanos (`nota-ejemplo.md` listado como adicional verificado indirectamente, al estilo del README de m4).

- **Corrección de test en H11 (mismo patrón que §10.10)**: la primera pasada falló en `curriculo.test.ts > toda lección sigue el orden de secciones`: el ejercicio de l06 incrusta dentro de un heredoc la **plantilla de la nota técnica**, cuyo encabezado `## Fuentes` aparece antes que la sección real `## Fuentes` de la lección, y el test —que buscaba `^## Fuentes$` sobre el cuerpo entero— lo acusaba de «fuera de orden». El fallo era del **test**: la plantilla de §6 valida las secciones del **documento**, no los encabezados `## …` escritos dentro de bloques de código (que son texto copiable por el alumno). Se añadió `sinBloquesDeCodigo()` al test, que descarta los bloques cercados antes de comprobar el orden y se aplica también a la comprobación de `## Ejercicio`.

- **Corrección de alcance detectada en H11 (hallazgo del usuario)**: CURRICULUM.md §3 define **7 módulos** para `n0`, pero la plataforma solo tiene contenido de **m1–m5**: `n0/m6` «Pruebas y depuración» y `n0/m7` «Fundamentos web: HTML, CSS y HTTP» existen como **fichas de frontmatter sin cuerpo, sin lecciones y sin ejemplos** (0 y 0). El error se originó en H10, cuyo §10.10 afirmaba «el nivel `n0` queda completo (m1–m5)» y «la fase `f1` queda completa», y se propagó a este documento y a los informes: `grep n0-m6\|n0-m7 IMPLEMENTATION_PLAN.md` no arrojaba resultados, es decir, la tabla de hitos **nunca planificó m6/m7**. Correcciones aplicadas en H11: §10.9 y §10.10 con nota de corrección, lecciones `n0/m5/l01–l07` —las que hablaban de «fase `f1` completa» ahora dicen «parte «Git limpio» de `f1`»—, y esta sección. **Pendientes reales de `n0`**: `n0/m6` y `n0/m7`, en ese orden — **decidido con el usuario el 21-10-2026**: H12 = `n0/m6`, H13 = `n0/m7` (cierran `n0` y la fase `f1`), y después se retoma `n1/m2`.

**Coherencia**: `n0/m5/l07` ahora enlaza `n1/m1/l01` (salto de nivel documentado en su «Siguientes pasos»); `src/content/modulos/n1/m1/index.mdx` recibe cuerpo («Para quién es este módulo», «Cómo se cierra el módulo» y tabla de las 6 lecciones) y fecha 2026-10-21; las **12 fuentes distintas** citadas (The Illustrated GPT-2, Hugging Face «Language Modeling», OpenAI «GPT»/«Models»/«Pricing»/«Prompt engineering», Anthropic «Models overview»/«Prompting Claude», arXiv 2202.03629, martinfowler.com «The Practical Test Pyramid», Purdue OWL «APA — General Format» y RFC 2119) verificadas con **HTTP 200** el 21-10-2026 antes de citarse.

**Métricas tras H11**: `npm run build:deploy` completo en verde — **162 tests** (150 → 162), **110 páginas** (104 → 110), Pagefind **97 indexadas** (91 → 97), **3262 enlaces OK** (3006 → 3262), `astro check` 0 errores / 0 avisos, `eslint` y `prettier --check` sin incidencias.

**Pendiente siguiente**: `n0/m7` «Fundamentos web: HTML, CSS y HTTP» como **H13** — el último de los 7 módulos de CURRICULUM.md §3 para `n0` (H12 `n0/m6` completado el mismo día, §10.12)—, **decisión acordada con el usuario el 21-10-2026**: cerrar `n0` y con él la fase `f1` antes de continuar con `n1/m2`. Decisión D-plan: un módulo por hito.

---

### 10.12 Registro de H12 — contenido `n0/m6` (21 de octubre de 2026)

**Estado**: ✅ Contenido completo y gate local verde (`npm run build:deploy`); fusión pendiente de PR (§8.5, push y merge solo por el usuario).

**Diseño**: 7 lecciones que componen el entregable de CURRICULUM §3 «Suite de tests que falla a propósito y luego pasa» — l01 *Qué merece la pena probar* (fronteras), l02 *Aserciones con intención* (cuatro familias + mensajes), l03 *Estructura de una suite* (`describe`/`it`/`beforeEach` y aislamiento), l04 *El ciclo rojo-verde* (TDD), l05 *Leer la traza completa* (frames), l06 *Pruebas inestables: el reloj y el azar* (inyección), l07 *Entregable: una suite que falla a propósito y luego pasa*. El orden reproduce el protocolo completo: elegir qué probar → asercionar → estructurar → ciclar → depurar → eliminar inestabilidad → componer.

**Ejemplos**: 13 ficheros en `ejemplos/` — **10 verdes** y **3 rojos deliberados**. Verdes: `casos-limite.js` («6 de 6 casos en verde»), `aserciones-intencion.js` («4 aserciones en verde: estricta, profunda, excepción y texto»), `descuento.js` + `descuento.test.js` (pass 6 / fail 0), `ciclo-rojo-verde.js` (rojo pass 1 / fail 2 con código `1` → verde pass 3 / fail 0 con código `0`), `leer-traza.js` (TypeError de siete frames con «primer frame de TU código: interna»), `reloj-inyectado.js` (4 aserciones; reloj inyectado y semilla 7 reproducible), `presupuesto.js` + `presupuesto.test.js` (pass 8 / fail 0) y `entregable-rojo-verde.js` (rojo pass 7 / fail 1 con código de suite `1` → verde pass 8 / fail 0 con código de suite `0`, mismo fichero de pruebas). Rojos con clase, mensaje y código reales: `errores/asercion-sin-mensaje.js` (AssertionError `actual: 450, expected: 544.5`, código `1`), `errores/estado-compartido.js` (pass 1 / fail 1, código `1`) y `errores/traza-perdida.js` (TypeError con tres frames, código `1`).

**Verificación**: todos los ejemplos y **los 7 ejercicios** ejecutados literalmente con Node v24.22.0 el 21-10-2026 (comandos, salidas y códigos reales documentados en cada lección). Tests de contenido ampliados con 12 tests nuevos (8 demos con marcas, 3 rojos con sus marcadores y manifiesto de 13 ficheros sin huérfanos): total del repositorio **174/174**.

**Correcciones durante el hito** (el principio «ejecución literal > afirmaciones» volvió a pillar errores de redacción):
1. `reloj-inyectado.js` anunciaba «6 aserciones» con 4 `assert` reales en el código → corregido a «4 aserciones» (l06).
2. l06 afirmaba que la mutación de reloj dejaba la suite **en verde**; la ejecución lo desmintió (`fail 1`, «un día después ya está caducado», código `1`): el ensayo con `hoy` posterior a la caducidad **sí** pilla la mutación. Lección reescrita con el veredicto real y la enseñanza correcta —el rojo se **movería** de ensayo según el día de ejecución, que es la firma de la inestabilidad—.
3. La implementación de referencia de l06 validaba solo `typeof === "string"` y dejaba pasar `Date.parse("25/10/2026") → NaN` (el quinto ensayo fallaba) → corregida con `Number.isNaN(Date.parse(...))`.
4. Enlaces y menciones actualizados: «Siguiente módulo» de `n0/m5/l07` → `n0/m6/l01` (`n1/m1` se menciona como posterior), y las menciones de «pendientes `n0/m6` y `n0/m7`» en `n0/m4/index.mdx`, `n0/m4/l07` y `n0/m5/l07` → «pendiente `n0/m7`».

**Fuentes verificadas HTTP 200 el 21-10-2026**: `nodejs.org/api/assert.html`, `nodejs.org/api/test.html`, `nodejs.org/api/errors.html`, `martinfowler.com/articles/practical-test-pyramid.html`, `martinfowler.com/bliki/TestDrivenDevelopment.html` y `martinfowler.com/articles/nonDeterminism.html` — todas con fecha de consulta en la lección que las cita.

**Pendiente siguiente**: `n0/m7` «Fundamentos web: HTML, CSS y HTTP» como **H13** — último módulo de `n0`; cierra el nivel y la fase `f1`— y, tras su cierre, se retoma `n1/m2`. Nota para H13: el prerrequisito de `n1/m1/l01` (`n0/m5/l07`) podrá apuntar a `n0/m7/l07` cuando exista.

---

### 10.13 Registro de H13 — contenido `n0/m7` (21 de octubre de 2026)

**Estado**: ✅ Contenido completo y gate local verde (`npm run build:deploy`); fusión pendiente de PR (§8.5, push y merge solo por el usuario).

**Diseño**: 7 lecciones que componen el entregable de CURRICULUM §3 «Página estática validada y publicada en local» — l01 *Anatomía de una página: HTML semántico* (los cinco anclajes y diez comprobaciones estructurales), l02 *El DOM: el árbol que construye el navegador* (parser con pila y error de balance), l03 *CSS: reglas, cascada y especificidad* (terna `(a,b,c)` y empate por orden), l04 *La petición HTTP: método, ruta y cabeceras* (200/404/405 y `ECONNREFUSED`), l05 *Servir una página estática: del archivo al navegador* (MIME por extensión, `index.html` por defecto y guarda de rutas con `403`), l06 *El camino crítico de renderizado* (cascada con fuente por propiedad y `display: none` fuera del árbol de render), l07 *Entregable: página estática validada y publicada en local*. El orden reproduce el recorrido del archivo: estructura → árbol → estilos → transporte → servidor → render → entregable.

**Ejemplos**: 15 ficheros en `ejemplos/` — la implementación compartida **`web.js`** (parser de HTML con pila, parser de CSS con línea de error, cascada con fuentes por propiedad, validador de diez comprobaciones y servidor estático con MIME y guarda), **8 demos verdes**, **3 rojos deliberados** y **3 entradas** `pagina/` (`index.html`, `estilos.css`, `diagrama.svg`). Verdes: `validar-html.js` («10 comprobaciones en verde»), `arbol-dom.js` («30 elementos y 12 nodos de texto»), `especificidad.js` (9 reglas y tres resoluciones: `.destacado` gana a `p`, el orden desata el empate de `nav a`, `#pie p` gana por id), `peticion-http.js` (200 con `content-length: 1433` verificado y 404 → «2 comprobaciones HTTP en verde»), `servidor-estatico.js` (5 rutas: `/`, `/estilos.css`, `/diagrama.svg`, 404 y `/%2e%2e/secreto.txt` → 403), `ruta-critica.js` («9 elementos con reglas de autor y 21 solo con la hoja del agente»), `pagina.test.js` (pass 10 / fail 0, 3 suites) y `entregable-pagina.js` (rojo pass 5 / fail 5 con código de suite `1` → verde pass 10 / fail 0 con código de suite `0`, misma suite redirigida con `PAGINA`). Rojos con mensaje y código reales: `errores/html-invalido.js` («6 comprobaciones en rojo; 4 en verde», código `1`), `errores/css-roto.js` (`Error: CSS inválido en la línea 3: declaración sin «:» — «color red»`, código `1`) y `errores/ruta-404.js` («esperado 200, recibido 404», código `1`).

**Verificación**: todos los ejemplos y **los 7 ejercicios** ejecutados literalmente con Node v24.22.0 el 21-10-2026 (comandos, salidas y códigos reales documentados en cada lección): validador propio de l01 (5 comprobaciones; rota → 4 en rojo, código `1`), parser de fragmentos de l02 (árbol de 3 elementos; roto → `Error: etiqueta sin cerrar: <p>`, código `1`), calculadora de ganador de l03, cliente+servidor de l04 con `ECONNREFUSED` en rojo y 3 comprobaciones en verde, publicador de l05 con la guarda mutada por `sed` (escape devuelve `200` → 1 ruta en rojo, código `1`), árbol de render de l06 («10 elementos pintados, 1 fuera por display: none») y entregable de l07 con sus tres fases (9/9 verde → 3 rojos → restaurado). Tests de contenido ampliados con 12 tests nuevos (8 demos con marcas, 3 rojos con sus marcadores y manifiesto de 15 ficheros —con `pagina/` en `adicionales`— sin huérfanos): total del repositorio **186/186**.

**Correcciones durante el hito** (el principio «ejecución literal > afirmaciones» volvió a pillar errores):
1. `web.js`: la primera versión de `servidorEstatico` quedó con un borrador que usaba `this._servirArchivo` (inexistente en el closure) → reescrita con una función `servirArchivo` de módulo y closures limpias.
2. El cálculo de línea de `parsearCss` se anclaba al inicio del selector y señalaba «línea 2» para una declaración en la 3 → anclado a la llave `{`; el rojo apunta ahora a la línea real.
3. `publicador.js` (ejercicio de l05) importaba `readFileSync` de `node:path` → corregido a `node:fs`.
4. Precisión editorial: l02 ya no afirma que los nodos de texto «casan con `p::after`» (no es cierto), y el fragmento de solución de l03 —pseudocódigo que usaba `s` sin definir— se sustituyó por una versión didáctica ejecutable de `especificidad`.
5. Prerrequisito de `n1/m1/l01` actualizado de `n0/m5/l07` a `n0/m7/l07` (cierre real de `n0`, nota heredada de §10.12); `n0/m6/l07` ya enlazaba `/curriculo/n0/m7/`.

**Fuentes verificadas HTTP 200 el 21-10-2026**: `developer.mozilla.org` (HTML Element, Document Object Model, Cascade, Specificity, HTTP Overview, MIME types, Critical rendering path) y `nodejs.org` (`api/http.html`, `api/test.html`) — todas con fecha de consulta en la lección que las cita.

**Pendiente siguiente**: retomar `n1/m2` como **H14**. Con este hito, el nivel `n0` (m1–m7) y la fase `f1` del proyecto longitudinal quedan **completos** — la corrección de alcance detectada en H11 queda cerrada.

---

### 10.14 Registro de H14 — contenido `n1/m2` (22 de octubre de 2026)

**Estado**: ✅ Contenido completo y gate local verde (`npm run build:deploy`); fusión pendiente de PR (§8.5, push y merge solo por el usuario).

**Diseño**: 6 lecciones que componen el entregable de CURRICULUM §3 «Serie de tareas de 10 minutos con pruebas» — l01 *La tarea pequeña: anatomía de un encargo* (instrucción concreta, un entregable nombrable y criterios observables, con la regla del curso de 40 caracteres como detector grosero), l02 *Contexto mínimo: lo justo para resolver* (fragmento, convención y verificación; el ruido medido en palabras, no en «tokens» de proveedor), l03 *Criterios de aceptación ejecutables* (criterios como suites `node:test` escritas antes que el código y ciclo rojo→verde contra un borrador plausible), l04 *Acotar el alcance: fronteras de la tarea* (`archivosPermitidos` comparados con los archivos tocados), l05 *La verificación de 10 minutos* (un comando `node --test`, de 1 a 5 criterios y duración medida en ms reales) y l06 *Entregable: serie de tareas de 10 minutos con pruebas*. El orden reproduce el recorrido de un encargo: anatomía → contexto → criterios → frontera → medición → serie.

**Ejemplos**: 18 ficheros en `ejemplos/` — **7 demos verdes** (`anatomia.js` «anatomía correcta: 3 de 3 tareas», `contexto-minimo.js` «3 de 5 piezas; 27 palabras frente a 60 con el ruido», `criterios-primero.js` «pass 1 · fail 3» contra el borrador → «pass 4 · fail 0» contra la entrega, `alcance.js` «alcance respetado», `serie.js` «3 tareas · 11 criterios · 3 comandos», `comprobar-serie.js` «serie válida» y `verificacion-rapida.js` con los ms reales de cada comando), **4 rojos deliberados** (`errores/tarea-ambigua.js` «instrucción vaga (17 caracteres; el curso exige 40)», `errores/contexto-inflado.js` «2 piezas no son necesarias para esta tarea», `errores/alcance-excedido.js` «3 de 4 archivos tocados no estaban permitidos» y `errores/serie-rota.js`, rechazado por el validador con «serie NO válida: 6 incidencias»; los cuatro en código `1`) y **7 ficheros `tareas/`** (las tres implementaciones de referencia —normalizar nombres, contar líneas y sumar decimales—, el borrador plausible de la tarea-1 que la fase roja refuta con 3 fallos y las tres suites `node:test`: 4 + 4 + 3 pruebas en verde).

**Verificación**: todos los ejemplos y **los 6 ejercicios** ejecutados literalmente con Node v24.22.0 el 22-10-2026 (comandos, salidas y códigos reales documentados en cada lección): anatomía rota y corregida (2 de 3, código `1` → 3 de 3, código `0`), contexto con y sin ruido (27 → 43 → 27 palabras), borrador de la tarea-1 (`fail 3`, código `1` → `pass 4` tras corregirlo), alcance excedido y reducido (3 de 4 fuera, código `1` → respetado, código `0`), medición con comando inexistente y restaurado («0 pruebas en verde», código `1` → verde) y serie rota corregida incidencia a incidencia (6 incidencias → «serie válida: 3 tareas, 7 criterios, 3 comandos»). Tests de contenido ampliados con 13 tests nuevos (7 demos con marcas, 4 rojos con sus marcadores, verificación de las tres suites con el borrador en rojo y manifiesto de 18 ficheros —con `tareas/` en `subcarpetas`— sin huérfanos): total del repositorio **199/199**; gate: `astro check` 0 errores, **130 páginas**, **4157 enlaces internos OK** y **117 páginas** indexadas por Pagefind.

**Correcciones durante el hito** (la ejecución literal volvió a pillar errores):
1. `serie.js`: el guardián `process.argv[1].endsWith("serie.js")` coincidía también con `comprobar-serie.js` y ejecutaba la demo al importarlo → comparación exacta con `basename`.
2. `criterios-primero.js`: el listado de pruebas fallidas incluía la cabecera «✖ failing tests:» como si fuera un fallo → excluida del filtro.
3. Ejercicio de l06: al taller no se copiaba `serie.js`, por lo que el paso `node comprobar-serie.js` sin argumento fallaba → el ejercicio lo copia junto al validador.
4. Erratas editoriales detectadas al releer las lecciones («instrución», «Olv idar» y un fragmento de texto ajenzo en l04) → corregidas antes del gate.

**Fuentes verificadas HTTP 200 el 22-10-2026**: `platform.openai.com` (`docs/guides/prompt-engineering`), `docs.anthropic.com` (`en/docs/build-with-claude/prompt-engineering/overview`), `platform.claude.com` (`docs/en/test-and-evaluate/develop-tests`) y `nodejs.org` (`api/test.html`) — todas con fecha de consulta en la lección que las cita. Se descartaron `martinfowler.com/bliki/PromptEngineering.html` y `martinfowler.com/articles/slim-code-gen.html` (404) y la guía PAIR de Google (200 pero sin contenido legible sin JavaScript).

**Pendiente siguiente**: retomar `n1/m3` como **H15** («Revisar el código generado»: diffs, pruebas, dependencias y edge cases).

---

## 11. Riesgos y decisiones que deben posponerse

### 11.1 Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Astro 7 es reciente y más estricto (compilador Rust, `compressHTML: 'jsx'`, `src/fetch.ts` reservado) | Errores de compilación o espacios desaparecidos en plantillas | Reglas de revisión (1.3.5–1.3.7), `verify` antes de cada build, inspección visual por hito |
| Versión de Node distinta entre local, CI y Pages | "En mi equipo funciona" | `.nvmrc` + `.node-version` + `engines` + `NODE_VERSION` en Pages; mismos comandos en ambos |
| `NODE_VERSION` ignorado en algún despliegue de preview de Pages (reporte comunitario) | Build usa Node 22.16.0 y falla | Fijarlo por **dos** vías (`.nvmrc` y variable) y revisar el log del primer preview |
| Fijar TS 6.0.3 mientras TS avanza a 7.x | Divergencia de tipos respecto a herramientas nuevas | Aislado en `devDependencies`; revisar compatibilidad cada trimestre |
| Pagefind añade un paso post-build y binarios por plataforma | Build falla en la imagen de Linux de Pages | Validar en H4 dentro del build de preview antes de ponerlo en `build:deploy` |
| El contenido MDX crece y alarga el build | Builds lentos, previews tardíos | Medir duración por hito; si duele, revisar imágenes y colecciones antes de añadir herramientas |
| Calidad del contenido por debajo de la promesa de VISION | Pérdida de credibilidad | `CURRICULUM.md` con plantilla obligatoria y checklist editorial por lección |
| Sin pruebas E2E, un enlace roto puede llegar a producción | Experiencia rota | Validación de enlaces como gate obligatorio en build |
| Progreso en `localStorage` limitado (borrado por el navegador, sin sincronización) | El alumno pierde su estado | Comunicarlo en la interfaz; pospuesta una opción de exportación/importación |

### 11.2 Decisiones pospuestas (con criterio de reevaluación)

1. **TypeScript 7.x**: esperar a que `@astrojs/check`/language server lo admitan. Revisar al salir una versión compatible.
2. **Pluggins Markdown** (anclajes, enlaces externos con `rel`, matemáticas, tablas avanzadas): solo si el contenido lo pide; entonces instalar `@astrojs/markdown-remark` + `unified()` o portar a plugins Sätteri.
3. **React / `@astrojs/react`**: únicamente con una necesidad de interactividad demostrable que el JS nativo no cubra.
4. **Tests E2E (Playwright), regresión visual, axe automatizado**: cuando el volumen de páginas haga invable la revisión manual.
5. **Multiidioma (i18n)**: el contenido inicial es en español; evaluar con la ruta de internacionalización de Astro si hay demanda.
6. **Comentarios, cuentas, sincronización de progreso, backend/Workers, base de datos**: fuera de alcance por ahora (principios de `VISION.md` y `TECH_STACK.md`).
7. **Analítica y servicios externos** (p. ej. Cloudflare Web Analytics): requieren autorización explícita; valorar coste/privacidad cuando haya tráfico.
8. **CMS/headless editor** (Decap, Keystatic u otro): Git + MDX es suficiente mientras la contribución sea por PR.
9. **Dominio propio, certificados y servicios de pago**: bloqueados hasta autorización (sección 9).
10. **Cabeceras HTTP personalizadas (`_headers`), PWA/offline, prefetch agresivo, edge middleware**: pospuestos; ninguno es necesario para la primera versión.
11. **`@astrojs/sitemap` en producción**: se activa cuando exista `site` definitivo (dominio o decisión de usar la URL de preview).
12. **Licencia, `CONTRIBUTING.md` y gobernanza de contribuciones**: definir antes de invitar contribuciones externas.

---

## 12. Fuentes de la verificación

- Registro npm (`registry.npmjs.org`) para versiones y `peerDependencies`/`engines`: astro 7.4.0, @astrojs/mdx 8.1.0, @astrojs/check 0.9.10, @astrojs/sitemap 3.7.4, tailwindcss 4.3.3, @tailwindcss/vite 4.3.3, typescript 6.0.3/7.0.2, eslint 10.13.0, eslint-plugin-astro 3.2.1, prettier 3.9.10, prettier-plugin-astro 1.1.1, vitest 5.0.5, pagefind 1.5.2, actions/checkout 7.0.1, actions/setup-node 7.1.0.
- Guía de migración de Astro v7 (`docs.astro.build/en/guides/upgrade-to/v7/`): Vite 8, compilador Rust, procesador Sätteri, `compressHTML: 'jsx'`, `src/fetch.ts` reservado.
- Documentación de Astro sobre Tailwind (`docs.astro.build/en/guides/integrations-guide/tailwind/`): usar el plugin Vite de Tailwind 4.
- Documentación de Cloudflare sobre la imagen de build de Pages (`developers.cloudflare.com/pages/configuration/build-image/`): imagen v3, Node 22.16.0 por defecto, cualquier versión vía `NODE_VERSION`, `.nvmrc` o `.node-version`.

Todas las consultas se hicieron el 19 de octubre de 2026. Antes de instalar dependencias en el hito H0 se volverá a comprobar que estas versiones siguen siendo las estables vigentes.
