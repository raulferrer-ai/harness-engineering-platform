// reloj-inyectado.js — el reloj entra por la puerta: mismas entradas, mismas salidas (lección l06)
import assert from "node:assert/strict";

// Mala: la función lee el reloj del sistema por su cuenta → su resultado
// depende del momento en que la ejecutes. Buena: el reloj es un parámetro.
function esHoraDeCierre(ahora, horaCierre) {
  return ahora.getHours() === horaCierre;
}

const cierre = 20;
const ensayos = [
  { hora: 19, esperado: false },
  { hora: 20, esperado: true },
  { hora: 21, esperado: false },
];

for (const ensayo of ensayos) {
  const ahora = new Date(2026, 9, 21, ensayo.hora, 0, 0);
  assert.strictEqual(
    esHoraDeCierre(ahora, cierre),
    ensayo.esperado,
    `a las ${ensayo.hora}:00 la tienda ${ensayo.esperado ? "sí" : "no"} está en cierre`,
  );
  console.log(`verde — ${ensayo.hora}:00 → cierre: ${ensayo.esperado}`);
}

// El azar también se inyecta: dos corridas con la misma semilla dan la misma lista.
function lcg(semilla) {
  let estado = semilla >>> 0;
  return () => {
    estado = (1664525 * estado + 1013904223) >>> 0;
    return estado / 2 ** 32;
  };
}

const corrida1 = Array.from({ length: 5 }, lcg(7)).map((valor) => valor.toFixed(4));
const corrida2 = Array.from({ length: 5 }, lcg(7)).map((valor) => valor.toFixed(4));

assert.deepStrictEqual(corrida1, corrida2, "misma semilla → misma corrida: el azar reproducible no es azar");
console.log("verde — semilla 7, corrida 1:", corrida1.join(" "));
console.log("verde — semilla 7, corrida 2:", corrida2.join(" "));
console.log("4 aserciones en verde con el reloj y el azar inyectados");
