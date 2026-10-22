// spec.js — demo de l02: la idea se convierte en criterios ejecutables.
// La spec declara su contrato (función y forma) y sus criterios C1…Cn, cada
// uno con entrada y esperado parseables: leerSpec los extrae y valida; lo que
// no se pueda parsear, no es un criterio ejecutable.
import { leerSpec } from "./ciclo.js";

const ruta = process.argv[2] ?? "proyecto/spec.md";
const { funcion, criterios } = leerSpec(ruta);
console.log(`leyendo la spec de ${ruta}:`);
console.log(` contrato: ${funcion}`);
for (const criterio of criterios) {
  console.log(
    ` ${criterio.id} · ${criterio.titulo} — entrada ${JSON.stringify(criterio.entrada)} → ${JSON.stringify(criterio.esperado)}`,
  );
}
console.log(
  `spec: ${criterios.length} criterios ejecutables — cada uno con entrada y esperado`,
);
