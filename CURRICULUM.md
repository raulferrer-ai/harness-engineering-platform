# Currículum — Harness Engineering Platform

Documento de contenido educativo. Define el mapa completo del currículo, el formato de las unidades y las reglas de calidad. Está alineado con `VISION.md` y con la estructura de datos descrita en `IMPLEMENTATION_PLAN.md` (rutas y colecciones).

Estado: **mapa completo y fase 1 de producción en curso**. El mapa es la referencia para producir las lecciones; el módulo `n0/m1` está **completo** (`l01`–`l07`, con ejemplos ejecutados y ejercicios verificados el 2026-10-19) y el resto del currículo sigue sin lecciones escritas.

---

## 1. Propósito y principios

Objetivo: llevar a una persona desde cero hasta un nivel experto en desarrollo de software asistido por inteligencia artificial y, concretamente, en **Harness Engineering** (diseñar sistemas fiables alrededor de modelos, agentes y herramientas).

Reglas que condicionan todo lo que sigue:

1. **El contenido es el producto.** Prioridad a la calidad de lecciones, ejemplos y ejercicios frente al número de páginas o a los efectos visuales.
2. **Aprender haciendo.** Cada módulo termina en algo ejecutable, comprobable o verificable.
3. **Todo concepto importante tiene ejemplo y ejercicio**, con criterios de verificación explícitos.
4. **Verificar el código generado por IA** es una competencia transversal que se entrena desde el primer módulo, no un tema aparte.
5. **Independencia de proveedores.** Se enseñan conceptos y contratos; las herramientas concretas se citan como ejemplos fechados y con fuente.
6. **Fuentes verificables** para todo dato o afirmación cambiante (versiones, precios, capacidades), con fecha de consulta.
7. **Sin afirmar lo no verificado**: ninguna funcionalidad ni resultado se presenta como existente sin haberlo comprobado.
8. **Gratuito y accesible sin registro**: el contenido es legible sin JavaScript, sin cuenta y sin cookies.

---

## 2. Arquitectura del currículo: nueve niveles

El itinerario de `VISION.md` se materializa como 9 niveles (`n0`…`n8`), secuenciales salvo indicación. Un nivel se aprueba cuando el alumno entrega su entregable verificable.

| Nivel | Nombre | Pregunta que resuelve | Prerrequisito |
| --- | --- | --- | --- |
| `n0` | Fundamentos de programación y desarrollo de software | ¿Cómo se escribe, ejecuta y comprueba un programa? | Ninguno |
| `n1` | Desarrollo asistido por IA | ¿Cómo trabajo con un asistente sin creerle sin comprobar? | `n0` |
| `n2` | AI-native Software Engineering | ¿Cómo es un ciclo de desarrollo donde la IA participa de principio a fin? | `n1` |
| `n3` | Context Engineering y Spec-driven Development | ¿Cómo doy al modelo el contexto y la especificación correctos? | `n2` |
| `n4` | Harness Engineering | ¿Cómo construyo el entorno de ejecución fiable alrededor del modelo? | `n3` |
| `n5` | Agent Engineering | ¿Cómo diseño agentes con tareas, permisos y supervisión? | `n4` |
| `n6` | Sistemas multiagente | ¿Cuándo y cómo conviene encadenar varios agentes? | `n5` |
| `n7` | Evaluación, seguridad, observabilidad y despliegue | ¿Cómo sé que sigue funcionando y que es seguro? | `n5` (puede paralelizarse con `n6`) |
| `n8` | Arquitecturas avanzadas y prácticas de nivel experto | ¿Cómo diseño sistemas que escalan en coste, fiabilidad y gobernanza? | `n6` + `n7` |

---

## 3. Mapa de módulos

Cada fila es un módulo (`nN-mK`). "Entregable" es la prueba de que el módulo está asimilado.

### n0 — Fundamentos de programación y desarrollo de software

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n0-m1` | Entorno, ejecución y verificación | Instalar un entorno, ejecutar un programa y comprobar su salida de forma reproducible | Programa pequeño con pruebas automatizadas y primer commit |
| `n0-m2` | Tipos, variables y funciones | Modelar datos y transformarlos con funciones pequeñas y comprobables | Conjunto de funciones con tests |
| `n0-m3` | Control de flujo y estructuras de datos | Decidir, repetir y organizar datos (listas, mapas, conjuntos) | Script que procesa un fichero real |
| `n0-m4` | Estructura de proyectos y dependencias | Separar código en módulos y gestionar dependencias con criterio | Proyecto con 3 módulos y README |
| `n0-m5` | Control de versiones con Git | Trabajar por ramas, revisar diffs y recuperar versiones | Flujo completo rama → revisión → fusión |
| `n0-m6` | Pruebas y depuración | Escribir aserciones, leer trazas de error y localizar fallos | Suite de tests que falla a propósito y luego pasa |
| `n0-m7` | Fundamentos web: HTML, CSS y HTTP | Entender cómo se sirve y renderiza una página web | Página estática validada y publicada en local |

### n1 — Desarrollo asistido por IA

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n1-m1` | Cómo funcionan los modelos de código | Explicar qué es un modelo de lenguaje, su contexto y sus límites, con fuentes | Nota técnica con fuentes citadas y fecha |
| `n1-m2` | Tareas pequeñas: instrucciones y contexto mínimo | Formular tareas acotadas que el asistente resuelve verificablemente | Serie de tareas de 10 minutos con pruebas |
| `n1-m3` | Revisar el código generado | Aplicar criterios de revisión: diffs, pruebas, dependencias, edge cases | Checklist de revisión aplicado a 3 entregas |
| `n1-m4` | Flujos de trabajo con asistente | Trabajar en chat, edición inline y asistente de terminal sin perder el control | Registro de 5 sesiones con verificación |
| `n1-m5` | Automatizar lo repetible | Convertir convenciones del proyecto en reglas, hooks y scripts ejecutables | Reglas del repositorio + pre-commit |
| `n1-m6` | Fallos típicos de los asistentes | Reconocer APIs inexistentes, código plausible-but-erróneo y dependencias inventadas | Colección personal de 10 fallos con detección |

### n2 — AI-native Software Engineering

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n2-m1` | El ciclo AI-native: plan → especificación → implementación → verificación | Ejecutar un ciclo completo sobre una funcionalidad real | Funcionalidad entregada con su spec y sus tests |
| `n2-m2` | Pruebas primero con asistente | Usar TDD para dirigir y limitar lo que la IA genera | Cobertura de tests rojos→verdes en una feature |
| `n2-m3` | Refactor asistido sin regresiones | Mejorar código existente manteniendo verde la suite | Antes/después con métricas y suite intacta |
| `n2-m4` | Revisión de código y deuda técnica | Medir y decidir sobre deuda técnica con datos | Informe de revisión con acciones priorizadas |
| `n2-m5` | Integración continua mínima | Configurar CI para proyectos pequeños con comprobaciones que bloquean | CI verde que falla ante un error inyectado |

### n3 — Context Engineering y Spec-driven Development

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n3-m1` | Anatomía del contexto | Descomponer contexto en instrucciones, datos, restricciones y estado | Mapa de contexto de un repositorio propio |
| `n3-m2` | Especificaciones como artefacto de trabajo | Escribir specs cortas, ejecutables y trazables a pruebas | 3 specs y su trazabilidad req → test |
| `n3-m3` | Instrucciones del repositorio | Definir un archivo de instrucciones del proyecto efectivo y mantenido | Archivo de instrucciones + revisión de resultados |
| `n3-m4` | Memoria y conocimiento del proyecto | Decidir qué se recuerda, dónde se guarda y cómo se caduca | Glosario/`MEMORY` versionado con caducidad |
| `n3-m5` | Contexto largo: coste, truncado y fragmentación | Trabajar con archivos grandes sin perder coherencia | Estrategia documentada para un repositorio real |
| `n3-m6` | Evolución de las specs | Mantener specs vivas cuando el requisito cambia | Caso de cambio con spec actualizada y tests |

### n4 — Harness Engineering

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n4-m1` | Qué es un harness | Definir el entorno de ejecución que rodea a un modelo: herramientas, bucles, límites | Diagrama anotado de un harness existente |
| `n4-m2` | Herramientas, contratos y permisos | Diseñar interfaces de herramienta tipadas y listas de permisos | Esquema de 5 herramientas con contratos |
| `n4-m3` | Bucles de ejecución: pasos, presupuestos, cancelación | Controlar número de pasos, coste, tiempo y parada | Presupuestos y cortes implementados |
| `n4-m4` | Validación de entradas y salidas | Rechazar salidas malformadas antes de que hagan daño | Validador de salidas con tests negativos |
| `n4-m5` | Aislamiento y límites de daño | Ejecutar en sandbox: permisos mínimos, sin secretos, sin daño externo | Demostración de intento bloqueado |
| `n4-m6` | Observabilidad del harness | Registrar pasos, herramientas, decisiones y errores de forma consultable | Log estructurado legible de una ejecución |
| `n4-m7` | Laboratorio: harness mínimo paso a paso | Construir un harness funcional sobre una tarea concreta | Repositorio funcional con README de ejecución |

### n5 — Agent Engineering

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n5-m1` | Tareas y fronteras del agente | Delimitar qué hace y qué no hace un agente | Ficha de alcance de un agente |
| `n5-m2` | Planificación y descomposición | Convertir objetivos en pasos verificables con criterios de "hecho" | Plan ejecutable con hitos comprobables |
| `n5-m3` | Herramientas y efectos secundarios | Gestionar acciones irreversibles y confirmaciones | Flujo con puntos de aprobación humana |
| `n5-m4` | Memoria a corto y largo plazo | Diseñar estado del agente y recuperación de información | Agente con memoria persistente versionada |
| `n5-m5` | Supervisión humana | Definir cuándo una persona debe aprobar, revisar o veto | Política de supervisión + registro de decisiones |
| `n5-m6` | Evaluación de agentes | Crear tareas doradas y detectar regresiones | Mini-suite de evaluación con resultados |
| `n5-m7` | Laboratorio: agente con permisos y validación | Integrar lo aprendido en un agente real de principio a fin | Agente ejecutando tareas acotadas con supervisión |

### n6 — Sistemas multiagente

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n6-m1` | Patrones de orquestación | Elegir entre enrutamiento, jerarquía o debate según el problema | Comparativa justificada con un caso propio |
| `n6-m2` | Mensajes y contratos entre agentes | Definir formatos de mensaje válidos y versionados | Esquema de mensajes + validación |
| `n6-m3` | Estado compartido y conflictos | Evitar que dos agentes pisen el trabajo del otro | Estrategia de bloqueo/serialización probada |
| `n6-m4` | Coste, latencia y cuellos de botella | Medir y optimizar el coste de un sistema multiagente | Medición antes/después con números |
| `n6-m5` | Fallos parciales y degradación | Diseñar sistemas que siguen siendo útiles cuando un agente falla | Modo degradado demostrado con fallo simulado |
| `n6-m6` | Laboratorio: pipeline con agente revisor | Encadenar productor y revisor con contrato de calidad | Pipeline con tasa de rechazo medida |

### n7 — Evaluación, seguridad, observabilidad y despliegue

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n7-m1` | Evaluación y regresión | Construir conjuntos de evaluación, métricas y comparativas | Informe de evaluación reproducible |
| `n7-m2` | Seguridad: inyección, exfiltración, permisos | Identificar y mitigar ataques dirigidos a agentes | Pruebas de ataque documentadas y bloqueadas |
| `n7-m3` | Secretos, dependencias y cadena de suministro | Proteger credenciales y reducir riesgo de dependencias | Auditoría de dependencias y política de secretos |
| `n7-m4` | Observabilidad: logs, trazas y coste | Instrumentar ejecuciones para depurar y facturar | Tablero básico con trazas y coste por ejecución |
| `n7-m5` | Despliegue y reversión | Publicar de forma reproducible con gate de comprobaciones | Despliegue con rollback probado |
| `n7-m6` | Operación: vigilancia y alertas | Detectar regresiones tras publicar | Alerta mínima sobre una métrica real |

### n8 — Arquitecturas avanzadas y prácticas de nivel experto

| Módulo | Título | Objetivo de aprendizaje | Entregable |
| --- | --- | --- | --- |
| `n8-m1` | Enrutamiento y modelos heterogéneos | Asignar tarea a modelo/estrategia según coste y calidad | Política de enrutamiento con datos |
| `n8-m2` | Conocimiento a largo plazo (RAG aplicado) | Diseñar recuperación útil sobre el propio código y docs | Recuperación evaluada con métricas propias |
| `n8-m3` | Evolución en caliente del sistema | Cambiar prompts/políticas sin romper lo que funciona | Cambio versionado con evaluación previa/posterior |
| `n8-m4` | Escala, coste y rendimiento | Optimizar presupuestos de tiempo y dinero a escala | Análisis de coste con proyección |
| `n8-m5` | Auditoría, cumplimiento y trazabilidad | Demostrar quién hizo qué y por qué | Trazabilidad completa de una decisión |
| `n8-m6` | Casos de estudio y post-mortems | Analizar fallos reales y extraer reglas del proyecto | Post-mortem con acciones aplicadas |

---

## 4. Proyecto longitudinal

Un único proyecto acompaña todo el currículo: **evolucionar una aplicación sencilla hasta convertirla en un sistema de desarrollo asistido por agentes con pruebas, permisos, validación y supervisión humana** (tal como pide `VISION.md`). Cada fase usa el mismo repositorio y deja una versión ejecutable.

| Fase | Nivel asociado | Qué se construye | Criterio de verificación |
| --- | --- | --- | --- |
| `f1` | `n0` | Aplicación sencilla, con tests y Git limpio | Tests verdes en local y CI mínimo |
| `f2` | `n1` | La misma app evolucionada con asistente | Cada cambio acompañado de pruebas y revisión de diff |
| `f3` | `n2` + `n3` | Specs, instrucciones del repositorio y CI estricto | Cambio de requisito → spec → tests → CI verde |
| `f4` | `n4` | Harness propio que ejecuta tareas acotadas | Tarea completada con presupuesto y log |
| `f5` | `n5` + `n6` | Agente supervisado + segundo agente revisor | Intención peligrosa requerirá aprobación humana |
| `f6` | `n7` | Evaluación, seguridad y despliegue con rollback | Evaluación reproducible + rollback probado |
| `f7` (opcional) | `n8` | Optimización de coste, enrutamiento y auditoría | Métricas antes/después publicadas |

Reglas del proyecto: cada fase se versiona con etiqueta (`f1`…`f6`); nada se da por cerrado sin su criterio de verificación ejecutado; el repositorio del alumno es la evidencia.

---

## 5. Unidades de contenido y formatos

| Formato | Extensión | Qué contiene | Extensión típica |
| --- | --- | --- | --- |
| Nivel | `src/content/niveles/nN.md` | Misión, prerrequisitos, lista de módulos, criterio de nivel | 1 pantalla |
| Módulo | `src/content/modulos/nN/mK/index.mdx` | Objetivos, ruta sugerida, entregable, recursos | 1–2 pantallas |
| Lección | `…/mK/lNN-titulo.mdx` | Formato completo de la sección 6 | 600–1200 palabras |
| Laboratorio | misma colección con `tipo: laboratorio` | Práctica guiada paso a paso con comprobación final | Más largo, guiado |
| Ejercicio | incluido en lección (o fichero propio en `ejemplos/`) | Enunciado + criterios de verificación + pista | 10–45 min |
| Solución | incluido en lección | Explicación razonada, alternativas, errores típicos | Junto al ejercicio |
| Fase de proyecto | `src/content/proyecto/f*.mdx` | Objetivo, entregable, criterios de verificación | 1 pantalla |
| Glosario | `src/content/glosario/*.md` | Término, definición corta, enlaces a lecciones | 5–10 líneas |
| Referencia | `src/content/referencias/*.md` | Fuente, qué aporta, fecha de consulta | 5–10 líneas |

---

## 6. Plantilla obligatoria de lección

Toda lección (`tipo: lección`) sigue este orden de secciones:

1. **Título (H1 único)** y resumen de 1–2 frases.
2. **Objetivos de aprendizaje** — 3–6, con verbos observables ("al terminar podrás…").
3. **Respuesta corta** — la respuesta al problema de la lección en 3–5 líneas (repaso y citación).
4. **Conceptos** — explicación rigurosa con ejemplos de código ejecutables.
5. **Ejercicio** — enunciado, **criterios de verificación** ("esto se cumple cuando…") y pista.
6. **Solución explicada** — por qué funciona, alternativas y errores típicos al resolverlo.
7. **Cómo verificarlo** — comandos exactos que el alumno ejecuta y qué debe observar.
8. **Errores comunes** — trampas frecuentes y cómo detectarlas.
9. **Fuentes** — con fecha de consulta; **Siguientes pasos** — enlace a la lección siguiente y al proyecto.

Restricciones:

- Un concepto importante → un ejemplo **y** un ejercicio. Sin excepciones.
- Si el ejemplo usa código generado por IA o asistido, la lección debe mostrar **cómo se verificó** (prueba, salida, diff).
- Nada de "funciona en mi caso": afirmaciones generales acompañadas de fuente o de comprobación reproducible.
- Independencia de proveedores: las herramientas concretas se presentan como ejemplos fechados, nunca como requisito del aprendizaje.

---

## 7. Metadatos de cada unidad

Campos de frontmatter (definición completa en `IMPLEMENTATION_PLAN.md`, sección 3.2): `titulo`, `resumen`, `nivel`, `modulo`, `orden`, `dificultad`, `tiempoEstimado`, `objetivos`, `prerrequisitos`, `tags`, `actualizado`, `fuentes`, `tipo`.

Reglas de currículo (comprobadas por tests, no a mano):

- `orden` único dentro de cada módulo; `nivel` y `modulo` deben existir.
- Todo `prerrequisito` debe apuntar a una unidad existente (sin referencias colgantes).
- Cada módulo declara al menos una unidad con `tipo: lección`; cada lección declara al menos un ejercicio o un laboratorio.
- Cada nivel `nN` tiene al menos un módulo; ningún módulo sin nivel.
- Las URLs se derivan de la estructura (`/curriculo/nN/mK/lNN-…/`): el `slug` nunca se escribe a mano.

---

## 8. Progresión y evaluación del alumno

- **Sin cuentas ni servidores.** El progreso se guarda en `localStorage` (lecciones completadas, última posición, notas privadas locales).
- **Checklist de "módulo hecho"** generado de los objetivos: el alumno lo marca y puede exportarlo como texto.
- **Autoevaluación por módulo**: 3–5 preguntas de comprobación con respuesta en la propia página (sin trampa: lo que importa es poder ejecutar la verificación).
- **Evidencia > sensación**: el estado "completado" se sugiere solo cuando el alumno ha ejecutado la sección "Cómo verificarlo".
- **Credenciales**: ninguna. Si en el futuro se quiere certificación, será una decisión pospuesta (ver `IMPLEMENTATION_PLAN.md` 11.2).

---

## 9. Glosario y referencias

- **Glosario**: términos con definición corta (≤ 10 líneas), enlace a la primera lección que los explica y fecha de revisión. Todo término usado en un nivel debe estar en el glosario o enlazado a su explicación.
- **Referencias**: una ficha por fuente (URL, qué aporta, fecha de consulta, tipo: documentación/estándar/artículo). Prioridad a documentación oficial y estándares abiertos. Los datos cambiantes (versiones, límites, precios) requieren fecha de consulta obligatoria.

---

## 10. Alcance de la primera versión y primer módulo

### 10.1 Primera versión (igual que "Alcance inicial" de `VISION.md`)

1. Página de inicio.
2. Mapa completo del currículo (`/curriculo/`) con los 9 niveles y todos los módulos listados.
3. Navegación por niveles y módulos.
4. Plantilla reutilizable de lección.
5. **Un primer módulo completo y de calidad: `n0-m1`.**
6. Ejemplos y ejercicios prácticos del módulo.
7. Diseño responsive y accesible.
8. Documentación para ejecutar y mantener el proyecto.

Todo lo demás (resto de módulos, búsqueda avanzada, progreso) se añade por hitos, sin romper lo ya verificado.

### 10.2 Primer módulo: `n0-m1` — Entorno, ejecución y verificación

Público objetivo: personas **sin experiencia previa**. Duración estimada: 4–6 horas repartidas.

| Lección | Título | Objetivos | Ejercicio y verificación |
| --- | --- | --- | --- |
| `l01` | Qué es programar y cómo se ejecuta un programa | Explicar el ciclo escribir → ejecutar → comprobar | Predecir la salida de un script de 10 líneas y ejecutarla para confirmar |
| `l02` | Instalar el entorno sin sorpresas | Instalar Node y un editor, comprobar versiones | `node --version` etc. contra un fichero de versiones esperadas |
| `l03` | Terminal, rutas y archivos | Navegar y manipular archivos desde la terminal | Crear la estructura de un proyecto desde cero y verificarla |
| `l04` | Tu primer programa y sus pruebas | Escribir una función y una aserción sobre ella | Test en verde; provocar un fallo y verlo en rojo |
| `l05` | Leer errores y depurar | Interpretar trazas de error y localizar la causa | Diagnosticar 3 errores provocados y documentar la causa de cada uno |
| `l06` | Cómo verificar lo que genera una IA | Aplicar el ciclo pedir → ejecutar → revisar → descartar | Pedir un código, ejecutar sus pruebas, anotar el diff y el fallo encontrado |
| `l07` | Primeros pasos con Git | Versionar, ver diffs y volver atrás | 5 commits con mensajes útiles y un `git revert` demostrado |

Cierre del módulo: el alumno entrega una carpeta con el programa, sus pruebas en verde, el historial de Git y una nota de "qué verifiqué y qué no puedo afirmar". Ese entregable es la puerta de entrada a `n1`.

---

## 11. Reglas de calidad y auditoría de contenido

Antes de dar por buena una lección se comprueba:

- [ ] Frontmatter completo y esquema validado por el build.
- [ ] Objetivos observables, no vagos ("entender" no vale: usa "explicar", "construir", "verificar").
- [ ] Al menos un ejemplo ejecutable y un ejercicio con criterios de verificación.
- [ ] Sección "Cómo verificarlo" con comandos reales ejecutados por quien escribe.
- [ ] Fuentes citadas con fecha para todo dato cambiante; enlaces probados.
- [ ] Sin afirmaciones de funcionalidades o resultados no verificados.
- [ ] HTML semántico, jerarquía de encabezados sin saltos, imágenes con `alt`.
- [ ] Independencia de proveedores: el aprendizaje no depende de una herramienta concreta.
- [ ] Revisión editorial: claridad, sin relleno, sin repetir lo que ya se explica en el módulo anterior.

---

## 12. Fases de producción del contenido

| Fase | Contenido | Depende de |
| --- | --- | --- |
| Fase 1 | Mapa completo (`n0`…`n8` con todos los módulos) + plantilla de lección + `n0-m1` completo | Hitos H1–H3 del plan |
| Fase 2 | Resto de `n0` y `n1` con ejercicios verificados; proyecto `f1`–`f2` | Fase 1 |
| Fase 3 | `n2`–`n3` y proyecto `f3`; glosario creciente | Fase 2 |
| Fase 4 | `n4`–`n5` (núcleo del harness) con laboratorios; proyecto `f4`–`f5` | Fase 3 |
| Fase 5 | `n6`–`n7`, evaluación y seguridad; proyecto `f6` | Fase 4 |
| Fase 6 | `n8`, casos de estudio y revisión integral de frescura de contenidos | Fase 5 |

Cada fase termina con una auditoría usando la checklist de la sección 11 y con una actualización de este documento si el mapa ha cambiado.
