# Plan — total de factura

## Objetivo

Entregar `totalFactura(lineas)`: el total de una factura a partir de sus líneas,
con impuesto y descuento por línea y redondeo a dos decimales.

## Alcance

- Líneas con `importe` (número ≥ 0), `impuesto` (porcentaje ≥ 0) y `descuento` (porcentaje entre 0 y 100).
- El descuento se aplica al importe; el impuesto, sobre la base ya descontada.
- El total se redondea a dos decimales con `Math.round` estándar.

## Fuera de alcance

- Múltiples monedas, fechas de vencimiento e impuestos especiales.
- Almacenamiento, interfaz de usuario y red.
- Validación de entradas inválidas (la iteración de l05 decide si entra al alcance).

## Criterios de entrega

- Spec con al menos 4 criterios ejecutables (entrada y esperado).
- Suite `node --test` en verde.
- Ninguna función exportada que la spec no declare.
