// api-inexistente.js — confiar en el método inventado y ejecutarlo (l02, rojo)
// Termina en rojo a propósito: el método "getUsuarioAsync" no existe en ninguna
// librería; al ejecutarlo, el intérprete lo refuta con un TypeError.
// Uso: node api-inexistente.js (devuelve código 1).

// El "modelo" sugirió esta línea; suena coherente, pero el símbolo es inventado.
const usuarioClient = {
  // La API real (inventada aquí como demo) expone getUsuario, no getUsuarioAsync.
  getUsuario: (id) => ({ id, nombre: "Ada" }),
};

const usuario = await usuarioClient.getUsuarioAsync(1, { timeout: 1000 });
console.log(usuario);
