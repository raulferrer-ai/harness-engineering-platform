# Spec — total de factura

## Contrato

Función: `totalFactura(lineas)`.
Entrada: array de líneas `{ importe, impuesto, descuento }`.
Salida: número redondeado a dos decimales.
Estrategia de redondeo: `Math.round(total * 100) / 100` sobre la suma.

## Criterios

### C1 · total de una línea sin impuesto ni descuento

entrada: [[{"importe": 100, "impuesto": 0, "descuento": 0}]]
esperado: 100

### C2 · el descuento se aplica antes que el impuesto

entrada: [[{"importe": 100, "impuesto": 21, "descuento": 10}]]
esperado: 108.9

### C3 · la lista vacía totaliza cero

entrada: [[]]
esperado: 0

### C4 · una línea a cero no aporta nada

entrada: [[{"importe": 0, "impuesto": 21, "descuento": 50}]]
esperado: 0
