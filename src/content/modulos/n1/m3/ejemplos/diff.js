// H15 (l01) — el diff como unidad de revisión.
// Dif de líneas por programación dinámica (LCS) con solo librería estándar:
// suficiente para leer entero el diff de una tarea pequeña.

export function diff(antes, despues) {
  const a = antes.split("\n");
  const d = despues.split("\n");

  // Tabla de subsecuencias comunes más largas entre las dos versiones.
  const tabla = Array.from({ length: a.length + 1 }, () =>
    new Array(d.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = d.length - 1; j >= 0; j--) {
      tabla[i][j] =
        a[i] === d[j]
          ? tabla[i + 1][j + 1] + 1
          : Math.max(tabla[i + 1][j], tabla[i][j + 1]);
    }
  }

  const lineas = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < d.length) {
    if (a[i] === d[j]) {
      lineas.push({ tipo: "igual", texto: a[i] });
      i++;
      j++;
    } else if (tabla[i + 1][j] >= tabla[i][j + 1]) {
      lineas.push({ tipo: "quita", texto: a[i] });
      i++;
    } else {
      lineas.push({ tipo: "pone", texto: d[j] });
      j++;
    }
  }
  while (i < a.length) {
    lineas.push({ tipo: "quita", texto: a[i] });
    i++;
  }
  while (j < d.length) {
    lineas.push({ tipo: "pone", texto: d[j] });
    j++;
  }
  return lineas;
}

export function estadisticas(lineas) {
  return {
    anadidas: lineas.filter((l) => l.tipo === "pone").length,
    quitadas: lineas.filter((l) => l.tipo === "quita").length,
    iguales: lineas.filter((l) => l.tipo === "igual").length,
  };
}

/** Carga el código entregado. Si no carga, devuelve el error tal cual. */
export async function cargarModulo(url) {
  try {
    return { ok: true, modulo: await import(url) };
  } catch (error) {
    return { ok: false, error };
  }
}

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const antes = readFileSync(new URL("./entregas/gastos-antes.js", import.meta.url), "utf8");
  const despues = readFileSync(new URL("./entregas/gastos-despues.js", import.meta.url), "utf8");
  const lineas = diff(antes, despues);
  const est = estadisticas(lineas);

  console.log("entrega: gastos — Total de gastos con redondeo a dos decimales");
  for (const linea of lineas) {
    if (linea.tipo === "igual") continue;
    const marca = linea.tipo === "pone" ? "+" : "-";
    console.log(`${marca} ${linea.texto.trim()}`);
  }
  console.log(
    `diff: ${est.anadidas} líneas añadidas, ${est.quitadas} quitadas, ${est.iguales} iguales`,
  );

  const carga = await cargarModulo(new URL("./entregas/gastos-despues.js", import.meta.url).href);
  if (carga.ok) {
    console.log("✓ el código entregado se carga sin errores");
  } else {
    console.log(`✗ ${carga.error.name}: ${carga.error.message}`);
  }
}
