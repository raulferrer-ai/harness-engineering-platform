// casos-limite.js — qué merece la pena probar: camino feliz y casos de frontera (lección l01)
function nivelStock(unidades) {
  if (unidades <= 0) return "agotado";
  if (unidades <= 5) return "bajo";
  return "suficiente";
}

const casos = [
  { descripcion: "camino feliz: 20 unidades", entrada: 20, esperado: "suficiente" },
  { descripcion: "frontera inferior del rango bajo: 1", entrada: 1, esperado: "bajo" },
  { descripcion: "frontera superior del rango bajo: 5", entrada: 5, esperado: "bajo" },
  { descripcion: "un paso por debajo: 0", entrada: 0, esperado: "agotado" },
  { descripcion: "dato inválido (negativo): -3", entrada: -3, esperado: "agotado" },
  { descripcion: "un paso por encima: 6", entrada: 6, esperado: "suficiente" },
];

let fallos = 0;
for (const caso of casos) {
  const obtenido = nivelStock(caso.entrada);
  const enVerde = obtenido === caso.esperado;
  if (!enVerde) fallos += 1;
  console.log(`${enVerde ? "verde" : "rojo"} — ${caso.entrada} → ${obtenido} (esperado: ${caso.esperado})`);
}

console.log(`${casos.length - fallos} de ${casos.length} casos en verde`);
if (fallos > 0) process.exit(1);
