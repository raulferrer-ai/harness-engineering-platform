// La misma funcionalidad, refactorizada: tarifas nombradas, tramos por peso
// y funciones pequeñas. Mismos exports y mismas salidas que envios.js —
// la suite de test/ pasa igual con uno u otro fichero.

const TARIFA_BASE = { nacional: 3.5, europea: 5.9, internacional: 9.9 };
const POR_KG_LIGERO = { nacional: 1.2, europea: 1.8, internacional: 2.5 };
const POR_KG_MEDIO = { nacional: 0.9, europea: 1.4, internacional: 2 };
const LIMITE_LIGERO = 1;
const LIMITE_MEDIO = 5;
const PESO_MAXIMO = 20;
const FACTOR_EXPRESS = 1.5;
const DECIMALES = 100;

function redondear(valor) {
  return Math.round(valor * DECIMALES) / DECIMALES;
}

function tarifaPorZona(tabla, zona) {
  return tabla[zona] ?? tabla.internacional;
}

function basePorTramo(peso, zona) {
  if (peso <= LIMITE_LIGERO) {
    return tarifaPorZona(TARIFA_BASE, zona);
  }
  if (peso <= LIMITE_MEDIO) {
    return (
      tarifaPorZona(TARIFA_BASE, zona) +
      (peso - LIMITE_LIGERO) * tarifaPorZona(POR_KG_LIGERO, zona)
    );
  }
  return (
    tarifaPorZona(TARIFA_BASE, zona) +
    (LIMITE_MEDIO - LIMITE_LIGERO) * tarifaPorZona(POR_KG_LIGERO, zona) +
    (peso - LIMITE_MEDIO) * tarifaPorZona(POR_KG_MEDIO, zona)
  );
}

export function costeEnvio(pedido) {
  if (pedido.peso > PESO_MAXIMO) {
    throw new Error("peso no soportado");
  }
  const base = basePorTramo(pedido.peso, pedido.zona);
  return redondear(pedido.express ? base * FACTOR_EXPRESS : base);
}

export function resumenPedido(pedido) {
  const total = costeEnvio(pedido);
  const extra = pedido.express ? redondear(total - total / FACTOR_EXPRESS) : 0;
  return { total, extra };
}
