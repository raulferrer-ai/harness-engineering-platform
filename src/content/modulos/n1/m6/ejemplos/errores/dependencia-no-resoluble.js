// dependencia-no-resoluble.js — rojo de l04: importar un paquete inventado
// (ERR_MODULE_NOT_FOUND). El asistente propuso fecha-hora-es, el package.json
// la declara, pero el package-lock.json nunca la resolvió porque no está
// publicada: al importarla, Node no encuentra el módulo. La lección: mirar el
// lock antes de instalar.
const { formatear } = await import("fecha-hora-es");
console.log(formatear(new Date()));
