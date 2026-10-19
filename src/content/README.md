# Contenido educativo

Este directorio aloja el currículum tal como lo define `CURRICULUM.md` y `IMPLEMENTATION_PLAN.md` (sección 3):

- `niveles/` — una página por nivel (`n0`…`n8`).
- `modulos/<nivel>/<modulo>/index.mdx` — índice de un módulo (`m1`, `m2`, …).
- `modulos/<nivel>/<modulo>/lecciones/*.mdx` — lecciones (`l01-…`, `l02-…`).
- `modulos/<nivel>/<modulo>/ejemplos/` — código ejecutable citado por las lecciones (no es una colección; se valida ejecutándolo, no lintiándolo).
- `glosario/` — términos con definición corta.
- `referencias/` — fuentes con fecha de consulta.
- `proyecto/` — fases del proyecto longitudinal.

Las colecciones y sus esquemas de validación (Content Collections con `defineCollection` y zod) están definidos en `src/content.config.ts`, con los esquemas en `src/lib/schemas.ts` (hito H2). En este momento están publicadas: las 9 fichas de nivel, las 56 fichas de módulo y **las 7 lecciones del módulo `n0/m1`** (hito H3: `l01`…`l07`, con sus 12 ficheros de `ejemplos/`); `glosario/`, `referencias/` y `proyecto/` quedan declaradas con su esquema pero aún sin ficheros ni rutas.

### Ejemplos ejecutables (`modulos/<nivel>/<modulo>/ejemplos/`)

Convención (D23, H3) y cómo se verifican (D24):

- `ejemplos/*.js` y `ejemplos/*.sh` deben **terminar con código 0** al ejecutarlos; `ejemplos/errores/*.js` fallan a propósito (código 1 con su clase de error documentada en la lección correspondiente).
- Los `.test.js` se ejecutan con `node --test` (el ejecutor que enseñan las lecciones); no confundir con Vitest.
- `tests/content/ejemplos.test.ts` ejecuta **todos** los ejemplos (manifiesto + test de cobertura): si añades un fichero de ejemplo sin registrarlo ahí, el gate `npm run verify` falla.
- Esa carpeta está excluida de ESLint, Prettier y `astro check` (`tsconfig.json`): un ejemplo puede contener errores sintácticos a propósito. Se valida **ejecutándolo**, no lintiándolo.
- Toda salida incrustada en una lección debe ser una ejecución real con la versión de Node/Git fijada en `versiones-esperadas.txt`.

## Reglas para quien añada contenido

- El frontmatter se valida en la compilación (zod) y con tests (`tests/content/`): una ficha con metadatos inválidos no compila y un fallo de relaciones (prerrequisito inexistente, `orden` duplicado, ruta que no coincide con el frontmatter) rompe `npm run verify`.
- El `orden` de una lección debe coincidir con el prefijo `lNN` de su fichero; es la base del «anterior/siguiente».
- Toda lección necesita al menos un ejercicio (sección `## Ejercicio` en el cuerpo) o declarar `tipo: laboratorio`.
- Cada módulo con lecciones debe tener al menos una unidad con `tipo: leccion`.
- No se enlaza a unidades que aún no existan; si se mencionan, se marcan como próximas.
