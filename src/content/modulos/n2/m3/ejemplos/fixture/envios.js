// Cálculo de envíos — «entregado» por el asistente en una sesión anterior.
// La suite de test/ fija su comportamiento: refactoriza sin salir del verde.

export function costeEnvio(pedido) {
  let total = 0;
  if (pedido.peso <= 1) {
    if (pedido.zona === "nacional") {
      total = total + 3.5;
    } else if (pedido.zona === "europea") {
      total = total + 5.9;
    } else {
      total = total + 9.9;
    }
  } else if (pedido.peso <= 5) {
    if (pedido.zona === "nacional") {
      total = total + 3.5 + (pedido.peso - 1) * 1.2;
    } else if (pedido.zona === "europea") {
      total = total + 5.9 + (pedido.peso - 1) * 1.8;
    } else {
      total = total + 9.9 + (pedido.peso - 1) * 2.5;
    }
  } else if (pedido.peso <= 20) {
    if (pedido.zona === "nacional") {
      total = total + 3.5 + 4 * 1.2 + (pedido.peso - 5) * 0.9;
    } else if (pedido.zona === "europea") {
      total = total + 5.9 + 4 * 1.8 + (pedido.peso - 5) * 1.4;
    } else {
      total = total + 9.9 + 4 * 2.5 + (pedido.peso - 5) * 2;
    }
  } else {
    throw new Error("peso no soportado");
  }
  if (pedido.express) {
    total = total * 1.5;
  }
  return Math.round(total * 100) / 100;
}

export function resumenPedido(pedido) {
  const total = costeEnvio(pedido);
  let extra = 0;
  if (pedido.express) {
    extra = Math.round((total - total / 1.5) * 100) / 100;
  }
  return { total, extra };
}
