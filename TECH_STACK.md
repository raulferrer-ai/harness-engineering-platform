Decisiones tecnológicas del proyecto
Framework

Utilizar Astro como framework principal para construir una academia educativa orientada al contenido, con renderizado estático siempre que sea posible.

Lenguajes
TypeScript para la lógica y los componentes interactivos.
Markdown y MDX para el contenido educativo.
Estilos

Utilizar Tailwind CSS para implementar un sistema de diseño coherente y responsive.

Elegir versiones estables y compatibles entre sí en el momento de crear el proyecto. No utilizar versiones experimentales salvo justificación explícita.

Componentes interactivos

Preferir componentes nativos de Astro y JavaScript ligero.

Introducir React únicamente cuando exista una necesidad real de interactividad compleja que justifique esa dependencia.

Contenido

Mantener el currículo y las lecciones separados de la lógica de la aplicación.

Definir una estructura de contenido reutilizable, con metadatos, objetivos de aprendizaje, ejercicios, referencias y nivel de dificultad.

Repositorio

Utilizar Git y GitHub para control de versiones, colaboración y automatización.

Publicación

Objetivo inicial: publicar la web en Cloudflare Pages desde un repositorio de GitHub.

Configurar un proceso reproducible de instalación, compilación y despliegue.

Documentar los comandos de desarrollo local y de producción.

Verificar la compatibilidad de la versión elegida de Astro y de las integraciones con el modo de despliegue estático antes de implementar.

No configurar credenciales, dominios ni servicios de pago sin autorización.

Arquitectura inicial
Priorizar la generación estática de páginas.
No incorporar una base de datos en la primera versión.
No requerir autenticación.
Guardar el progreso opcional del alumno en el navegador.
No ejecutar código no confiable de visitantes en el servidor.
Diseñar las funcionalidades interactivas para que puedan ampliarse en fases posteriores.
Calidad

El proyecto debe incluir comprobaciones de tipos, linting cuando proceda, pruebas adecuadas y compilación de producción.

El despliegue debe fallar si las comprobaciones obligatorias detectan errores.

Documentar cualquier limitación técnica relevante.

Versiones fijadas en el hito H0 (19 de octubre de 2026)

La compatibilidad se verificó contra los metadatos publicados de cada paquete antes de instalar (proceso, fuentes y resultados en IMPLEMENTATION_PLAN.md, secciones 1 y 12).

Conjunto fijado y verificado:

Node.js 24.22.0, declarado en .nvmrc, .node-version, engines y el campo volta de package.json.
Astro 7.4.0 con @astrojs/mdx 8.1.0 (Vite 8.3.4 empaquetado en Astro).
TypeScript 6.0.3 con @astrojs/check 0.9.10, porque el tooling de tipos de Astro aún no admite TypeScript 7.
Tailwind CSS 4.3.3 mediante @tailwindcss/vite 4.3.3, ya que la integración @astrojs/tailwind está obsoleta.
ESLint 10.13.0 con eslint-plugin-astro 3.2.1 y @eslint/js 10.0.1, en configuración flat y con defineConfig de eslint/config.
Prettier 3.9.10 con prettier-plugin-astro 1.1.1.
Vitest 5.0.5 con @types/node 24.19.2.

Decisiones operativas derivadas de esa verificación:

La instalación usa engine-strict (.npmrc): una versión de Node fuera del rango soportado falla de forma explícita en lugar de comportarse de forma impredecible.
Cloudflare Pages debe fijar Node 24.22.0 en el proyecto, porque la imagen de build v3 trae 22.16.0 por defecto, por debajo del mínimo que exige Astro 7.
Los scripts .ts se validan con astro check; no se añade typescript-eslint hasta que exista lógica de negocio que lo justifique.
Pagefind y la validación de enlaces se incorporan en los hitos H4 y H5, no en H0, para no cargar dependencias sin uso.