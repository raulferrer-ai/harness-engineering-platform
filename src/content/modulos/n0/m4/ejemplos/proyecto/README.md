# informe-gastos

## Qué es

Proyecto del módulo `n0/m4` (fase `f1` del proyecto longitudinal): un script que lee un CSV de gastos, lo valida y imprime un informe con sus agregados. Es el informe de `n0/m3` separado en tres módulos con `import`/`export`, con su manifiesto y sus pruebas.

## Requisitos

- Node.js v24.22.0 (o superior) con soporte de ES modules.
- npm (incluido con Node) solo para ejecutar los scripts; **no hay dependencias externas**.

## Cómo ejecutar

```sh
npm run informe     # node src/main.js datos/gastos.csv
```

Salida real (ejecutada el 2026-10-21 con Node v24.22.0):

```text
Informe de gastos
gastos: 8
total: 83.69 EUR
media: 10.46 EUR
máximo: 42.30 EUR
por categoría:
  comida: 4 gasto(s), 8.00 EUR
  hogar: 1 gasto(s), 42.30 EUR
  ocio: 2 gasto(s), 27.99 EUR
  transporte: 1 gasto(s), 5.40 EUR
```

## Estructura

```text
proyecto/
├── package.json         manifiesto: nombre, versión, type: module y scripts
├── package-lock.json    lockfile generado por npm install (árbol fijo)
├── datos/
│   └── gastos.csv       CSV real: cabecera + 8 gastos
├── src/
│   ├── gastos.js        módulo 1: leer y validar el CSV
│   ├── informe.js       módulo 2: agregados y formato del informe
│   └── main.js          módulo 3: punto de entrada de la línea de comandos
└── test/
    └── proyecto.test.js pruebas que cruzan los tres módulos
```

## Cómo verificar

```sh
npm test              # node --test: 6 pruebas, 0 fallos
node src/main.js      # sin ruta: mensaje de uso y código de salida 1
```

Salida real de `npm test` (ejecutada el 2026-10-21 con Node v24.22.0): `tests 6 / pass 6 / fail 0`.

## Licencia

MIT
