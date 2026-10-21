// traza-perdida.js — un TypeError no capturado con tres frames de profundidad (rojo, l05)
function principal() {
  return mediate();
}

function mediate() {
  return interna({ usuario: { perfil: null } });
}

function interna(datos) {
  return datos.usuario.perfil.nombre;
}

console.log(principal());
