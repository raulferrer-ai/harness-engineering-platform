# Auditoría de accesibilidad — checklist firmada

**Hito**: H6 (documentación de ejecución y mantenimiento + auditoría manual a11y).
**Fecha**: 21 de octubre de 2026.
**Alcance**: páginas representativas del sitio en build local (`astro preview`,
mismo artefacto que despliega Cloudflare) y, cuando se indica, la URL pública.
**Herramientas**:

- Lighthouse (categorías accessibility, best-practices y SEO) vía el navegador
  adjunto a la sesión (modo desktop).
- Auditoría manual de teclado, landmarks, jerarquía y estados (herramientas de
  navegador + inspección del DOM).
- Cálculo de ratios de contraste WCAG 2.x (fórmula de luminancia relativa sobre
  colores OKLCH→sRGB convertidos con la transformación estándar de Oklab).

**Resultado global**: **accessibility 1.0 en las 11 rutas auditadas, 0 fallos de
axe/Lighthouse, 0 errores de consola**, tras corregir los 4 hallazgos de esta
auditoría (§2). Este documento queda como checklist firmada para auditorías
futuras (ver `docs/MANTENIMIENTO.md` §7).

---

## 1. Checklist de verificación (estado tras las correcciones)

### 1.1 Contraste (WCAG 2.2 AA — 1.4.3)

| Elemento / token                                         | Fondo                                 | Ratio      | Mínimo | Estado                       |
| -------------------------------------------------------- | ------------------------------------- | ---------- | ------ | ---------------------------- |
| `--color-ink` (texto principal)                          | paper                                 | 16.43:1    | 4.5    | ✔                            |
| `--color-ink-soft` (texto secundario, 14 px)             | paper                                 | 7.23:1     | 4.5    | ✔                            |
| `--color-ink-faint` (texto auxiliar, 12 px)              | paper                                 | **4.93:1** | 4.5    | ✔ (corregido, §2.1)          |
| `--color-ink-faint`                                      | surface (blanco)                      | **5.28:1** | 4.5    | ✔ (corregido, §2.1)          |
| `--color-ink-faint`                                      | accent-soft (ítem activo del sidebar) | **4.59:1** | 4.5    | ✔ (corregido, §2.1)          |
| Texto sobre `--color-accent` (botones primarios, blanco) | accent                                | 5.91:1     | 4.5    | ✔                            |
| Comentario en bloques de código (`#8B949E`)              | `#24292e`                             | **4.77:1** | 4.5    | ✔ (corregido, §2.2)          |
| Resto de tokens de Shiki (`github-dark`)                 | `#24292e`                             | ≥5.5:1     | 4.5    | ✔ (verificado token a token) |

### 1.2 Teclado y foco (2.1.1, 2.4.1)

- ✔ **Skip link** «Saltar al contenido principal»: primer Tab de la página lo
  enfoca y lo muestra (visible, outline sólido 2 px); Enter **mueve el foco a
  `main#contenido`** y el siguiente Tab entra en el contenido (corregido, §2.3).
- ✔ **Orden de tabulación** coherente en home (skip link → CTAs → tarjetas de
  nivel) y en lección (nav → sidebar → contenido → progreso → pie).
- ✔ **Búsqueda completa con teclado** en `/buscar/`: Tab hasta el campo (9 tabs),
  escribir «git» → «5 resultados para «git»», Tab al primer resultado, Enter →
  lección «Primeros pasos con Git». Sin ratón.
- ✔ **Marcar lección completada con teclado** (Espacio sobre
  `checkbox#progreso-leccion`; verificado también en H5).
- ✔ **Foco visible** en todo el sitio: `:focus-visible` con `outline: 2px solid
var(--color-accent)` + `outline-offset: 2px` (comprobado en los elementos
  recorridos: outline «solid 2px» en todos).

### 1.3 Estructura y semántica (1.3.1, 4.1.2)

- ✔ **Landmarks**: `header`, `nav[Principal]`, `main`, `footer`,
  `nav[Pie de página]` (home).
- ✔ **Jerarquía de encabezados**: un solo `h1` por página; sin saltos de nivel
  en las rutas auditadas (home, módulo, lección).
- ✔ **Listas**: todos los `ol`/`ul` con hijos `li` únicamente (corregido, §2.4).
- ✔ **`aria-current="page"`** en la navegación activa (header, breadcrumb y
  lección activa del sidebar: 4 ocurrencias en la lección l01).
- ✔ **Etiquetas de formulario**: input de búsqueda con etiqueta visible
  («TÉRMINO DE BÚSQUEDA»), checkbox de progreso con etiqueta `label` asociada.
- ✔ **Imágenes**: el sitio no usa `<img>` (0 en todo `dist/`); no hay que
  verificar `alt`. Los SVGs decorativos, si se añaden en el futuro, deberán
  llevar `aria-hidden="true"` o `aria-label`.

### 1.4 Comportamiento y movimiento (2.3.3, 2.3.4)

- ✔ **`prefers-reduced-motion`**: regla global que anula animaciones,
  transiciones y `scroll-behavior` (presente en el CSS compilado).
- ✔ El sitio no tiene carouseles, autoplay ni movimiento espontáneo; las
  transiciones son cambios de color ≤150 ms.

### 1.5 Responsive (1.4.10) — alcance verificable sin emulador móvil

- ✔ `meta viewport` correcto (`width=device-width, initial-scale=1`).
- ✔ **Sin anchos fijos ≥321 px** en el CSS compilado (grep sobre `dist/*.css`:
  0 coincidencias de `width:<3 dígitos>px`), coherente con «sin rupturas a
  320 px» (§4.4 del plan).
- ✔ Breakpoints del CSS compilado: `40rem` (sm) y `64rem` (lg), mobile-first.
- ⚠ **Límite del alcance**: la herramienta Lighthouse de esta sesión corre en
  modo **desktop** (sin emulación de viewport móvil); la verificación visual en
  un viewport de 320 px y en un dispositivo real queda **pendiente** para cuando
  haya un emulador/dispositivo disponible. No se afirma lo que no se ha medido.

---

## 2. Hallazgos encontrados y corregidos (21-10-2026)

La primera pasada (Lighthouse sobre la home) dio **accessibility 0.9** con 2
reglas de axe en rojo; el recorrido ampliado a 11 rutas encontró 4 problemas
reales, todos corregidos en esta misma rama:

### 2.1 Contraste de `--color-ink-faint` (15 nodos marcados por axe)

- **Hallazgo**: el token `oklch(0.6 0.015 265)` (#7C808A) usado como texto
  auxiliar real (códigos `n0`/`l01`, recuentos «7 módulos», etiquetas del
  sidebar) daba **3.69:1 sobre paper y 3.95:1 sobre surface** (< 4.5:1).
  Además, sobre `accent-soft` (ítem activo del sidebar) el ratio era aún menor.
- **Corrección**: `--color-ink-faint: oklch(0.53 0.015 265)` (#676C75), que
  cumple AA sobre los tres fondos reales: paper **4.93:1**, surface **5.28:1**,
  accent-soft **4.59:1** (ratios calculados con la fórmula de luminancia
  relativa; la conversión OKLCH→sRGB se validó reproduciendo el #7C808A que axe
  reportó). El comentario del token en `global.css` documenta el porqué.
- **Archivo**: `src/styles/global.css`.

### 2.2 Contraste de comentarios en bloques de código (lecciones con `//`)

- **Hallazgo**: el tema por defecto de Shiki (`github-dark`) pinta los
  comentarios con `#6A737D` sobre `#24292e` → **3.05:1** (marcado en l01).
- **Intento descartado**: `markdown.shikiConfig.colorReplacements` no surtió
  efecto con `@astrojs/mdx@8.1.0` + `shiki@4.5.0` (probado directamente contra
  la API con claves en mayúsculas y minúsculas: el color no cambia).
- **Corrección**: override CSS concreto
  (`.astro-code [style*="#6A737D"] { color: #8b949e !important }`) → **4.77:1**.
  El resto de tokens del tema se auditaron uno a uno (mínimo 5.52:1) y no
  necesitan ajuste.
- **Archivos**: `src/styles/global.css`.

### 2.3 Skip link sin foco real en el contenido

- **Hallazgo**: Enter en el skip link cambiaba el hash a `#contenido` pero el
  foco de teclado **se quedaba en el header** (el `<main>` no era enfocable, así
  que el navegador solo hacía scroll).
- **Corrección**: `<main id="contenido" tabindex="-1" focus:outline-none">`;
  verificado: Enter → foco en `MAIN#contenido` → siguiente Tab dentro del
  contenido.
- **Archivo**: `src/layouts/BaseLayout.astro`.

### 2.4 Lista `ol` con hijos no permitidos (regla axe `list`)

- **Hallazgo**: la lista ordenada de fases del proyecto en la home renderizaba
  `<div>` (el componente `Card`) como hijos directos del `<ol>`.
- **Corrección**: `Card` acepta la prop `como` (`"div"` por defecto,
  retrocompatible) y la home usa `<Card como="li">`; la lista queda semánticamente
  válida sin tocar el resto de usos del componente.
- **Archivos**: `src/components/ui/Card.astro`, `src/pages/index.astro`.

---

## 3. Registro de la verificación final (21-10-2026)

Batería tras las correcciones, sobre build local (`npm run build` +
`astro preview`; el artefacto `dist/` es el mismo que despliega Cloudflare):

| Ruta                                                          | Lighthouse accessibility | Fallos axe | Errores de consola |
| ------------------------------------------------------------- | ------------------------ | ---------- | ------------------ |
| `/` (home)                                                    | **1.0**                  | 0          | 0                  |
| `/curriculo/`                                                 | **1.0**                  | 0          | 0                  |
| `/curriculo/n0/m1/` (módulo)                                  | **1.0**                  | 0          | 0                  |
| `/curriculo/n0/m1/l01-que-es-programar/` (lección con código) | **1.0**                  | 0          | 0                  |
| `/curriculo/n0/m1/l04-…` (lección con pruebas)                | **1.0**                  | 0          | 0                  |
| `/curriculo/n0/m1/l07-…` (lección con Git)                    | **1.0**                  | 0          | 0                  |
| `/buscar/`                                                    | **1.0**                  | 0          | 0                  |
| `/proyecto/`                                                  | **1.0**                  | 0          | 0                  |
| `/enfoque/`                                                   | **1.0**                  | 0          | 0                  |
| `/glosario/`                                                  | **1.0**                  | 0          | 0                  |
| `/404.html`                                                   | **1.0**                  | 0          | 0                  |

Recorridos manuales superados (detallados en §1.2): skip link con foco real,
búsqueda solo teclado, marcar lección con teclado, `aria-current`, landmarks y
jerarquía de encabezados.

**Pendiente conocida** (§1.5): verificación visual responsive en viewport móvil
de 320 px y en dispositivo real — la herramienta de esta sesión solo ofrece modo
desktop.

---

## 4. Firmas

- **Auditoría ejecutada por**: agente de OpenCode (sesión H6), 21-10-2026, con
  herramientas de navegador sobre build local y revisión del DOM/CSS compilado.
- **Correcciones incluidas en esta rama**: `docs/h6-mantenimiento-a11y` (4
  ficheros de código + esta documentación), sujetas al gate `npm run build:deploy`
  y a la revisión del PR.
- **Aprobación**: pendiente de fusión del PR de H6 (el gate de rama exige CI
  verde antes de merge).
