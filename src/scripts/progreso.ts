/**
 * Interfaz del progreso local en el navegador (hito H4). Mejora progresiva:
 * sin este script el HTML estático muestra un estado neutral que no afirma
 * nada («—», marcas ocultas, casilla desmarcada). Toda lectura y escritura
 * pasa por `src/lib/progreso.ts`, probado con Vitest.
 *
 * Contrato con el HTML:
 * - `[data-progreso-unidades="id1,id2,…"]`: contenedor cuyo
 *   `[data-progreso-resumen]` recibe el texto del resumen.
 * - `[data-progreso-marca="id"]`: marca de unidad que se muestra al completar.
 * - `[data-progreso-toggle="id"]` (+ `data-clave-progreso`): casilla de la
 *   lección actual.
 * - `[data-progreso-error]`: aviso de fallo de escritura (oculto por defecto).
 */
import {
  alternarLeccion,
  formatearResumen,
  leerProgreso,
  resumenModulo,
  TEXTO_NO_DISPONIBLE,
  type LecturaProgreso,
} from "../lib/progreso";

function almacenLocal(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function idsDe(contenedor: HTMLElement): string[] {
  return (contenedor.dataset.progresoUnidades ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

function inicializar(): void {
  const contenedores = document.querySelectorAll<HTMLElement>("[data-progreso-unidades]");
  const control = document.querySelector<HTMLInputElement>("[data-progreso-toggle]");
  if (contenedores.length === 0 && !control) return;

  const almacen = almacenLocal();
  let lectura: LecturaProgreso = leerProgreso(almacen);

  const pintar = (): void => {
    const completo = (id: string): boolean => lectura.completadas.has(id);
    for (const contenedor of contenedores) {
      const resumen = contenedor.querySelector<HTMLElement>("[data-progreso-resumen]");
      if (resumen) {
        resumen.textContent =
          lectura.estado === "disponible"
            ? formatearResumen(resumenModulo(lectura.completadas, idsDe(contenedor)))
            : TEXTO_NO_DISPONIBLE;
      }
    }
    // Las marcas se pintan por identificador en todo el documento: así el
    // resumen y las listas (sidebar, módulo, mapa) pueden vivir separados.
    for (const marca of document.querySelectorAll<HTMLElement>("[data-progreso-marca]")) {
      marca.hidden = !completo(marca.dataset.progresoMarca ?? "");
    }
    if (control) control.checked = completo(control.dataset.progresoToggle ?? "");
  };

  const mostrarError = (visible: boolean): void => {
    const aviso = document.querySelector<HTMLElement>("[data-progreso-error]");
    if (aviso) aviso.hidden = !visible;
  };

  pintar();

  control?.addEventListener("change", () => {
    const id = control.dataset.progresoToggle ?? "";
    const resultado = alternarLeccion(lectura, almacen, id);
    if (resultado.exito) {
      lectura = { estado: "disponible", completadas: resultado.completadas };
      mostrarError(false);
      pintar();
      return;
    }
    // No se guardó: la casilla vuelve al estado real almacenado y se avisa.
    pintar();
    mostrarError(true);
  });
}

inicializar();
