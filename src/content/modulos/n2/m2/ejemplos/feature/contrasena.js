// contrasena.js — la feature de reglas de contraseña, construida con pruebas
// primero: cada regla entró por su test rojo y registro.json conserva los
// seis ciclos con lo que se vio en cada paso.
const REGLAS = [
  { id: "longitud", cumple: (contrasena) => contrasena.length >= 8 },
  { id: "digito", cumple: (contrasena) => /\d/.test(contrasena) },
  { id: "mayuscula", cumple: (contrasena) => /[A-Z]/.test(contrasena) },
];

export function incumplidas(contrasena) {
  // «texto»: la entrada no es una cadena — ni se evalúan las reglas.
  if (typeof contrasena !== "string") return ["texto"];
  return REGLAS.filter((regla) => !regla.cumple(contrasena)).map((regla) => regla.id);
}

export function esValida(contrasena) {
  return incumplidas(contrasena).length === 0;
}
