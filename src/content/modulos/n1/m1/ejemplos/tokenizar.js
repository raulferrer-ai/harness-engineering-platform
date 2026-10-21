// tokenizar.js — qué es "tokenizar" y por qué el modelo NO ve texto, ve números (l01)
//
// Un modelo de lenguaje no lee caracteres: lee una secuencia de enteros (tokens).
// Este script implementa un tokenizador mínimo (palabra + puntuación, estilo BPE
// grosero) para mostrar tres ideas reales:
//   1. el mismo texto se parte en tokens de longitud variable;
//   2. palabras raras se parten en trozos, así que consumen MÁS tokens;
//   3. contar tokens es contar "entradas" del modelo, no caracteres.
//
// Uso: node tokenizar.js
// Nota de honestidad: no es el tokenizador real de ningún proveedor (que es
// aprendido de datos y propietario). Es una ilustración ejecutable del concepto.

/** Parte `texto` en tokens: palabras completas + signos sueltos (minúsculas). */
export function tokenizar(texto) {
  const tokens = [];
  const coincidencias = texto.toLowerCase().match(/[a-záéíóúñ]+|[^a-záéíóúñ\s]/gu) ?? [];
  for (const coincidencia of coincidencias) tokens.push(coincidencia);
  return tokens;
}

/** Cuenta de tokens que consume cada palabra en `frase`. */
export function tokensPorPalabra(frase) {
  const tabla = new Map();
  for (const token of tokenizar(frase)) {
    tabla.set(token, (tabla.get(token) ?? 0) + 1);
  }
  return [...tabla.entries()].sort((a, b) => b[1] - a[1]);
}

// Demostración al ejecutar el fichero directamente (no al importarlo).
if (process.argv[1] && process.argv[1].endsWith("tokenizar.js")) {
  const frase =
    "El modelo de lenguaje predice el siguiente token. La plataforma es una academia.";
  const tokens = tokenizar(frase);

  console.log("frase:", frase);
  console.log("caracteres:", frase.length);
  console.log("tokens:", tokens.length);
  console.log("tokens reales:", JSON.stringify(tokens));
  console.log("relación tokens/caracteres:", (tokens.length / frase.length).toFixed(3));

  // Palabra frecuente (una entrada) vs palabra rara (se parte en trozos).
  const palabraComun = "modelo";
  const palabraRara = "harness-engineering-plataforma";
  console.log("\n--- por qué importa la frecuencia ---");
  console.log(`«${palabraComun}» →`, tokenizar(palabraComun).length, "token(s)");
  console.log(`«${palabraRara}» →`, tokenizar(palabraRara).length, "token(s)");
  console.log("(una palabra rara o con guiones consume muchas más entradas)");
}
