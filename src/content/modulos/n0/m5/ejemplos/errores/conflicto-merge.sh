#!/bin/sh
# conflicto-merge.sh — dos ramas tocan la misma línea: el merge falla (l05)
# Termina en rojo a propósito: el conflicto es un evento normal de Git y se
# resuelve a mano. Uso: sh conflicto-merge.sh (devuelve código 1).
demo="$(mktemp -d)"
trap 'rm -rf "$demo"' EXIT
cd "$demo"
git init -q
rama="$(git symbolic-ref --short HEAD)"
git config user.name "Demo Flujo"
git config user.email "demo@example.invalid"
printf 'total: 83.69\n' > resumen.txt
git add resumen.txt
git commit -q -m "Añade resumen.txt"

git switch -q -c propuesta-a
printf 'total: 83.69 EUR\n' > resumen.txt
git commit -qam "Propone total con moneda (rama propuesta-a)"

git switch -q "$rama"
git switch -q -c propuesta-b
printf 'total: 83,69 EUR\n' > resumen.txt
git commit -qam "Propone coma decimal (rama propuesta-b)"

git switch -q "$rama"
echo "\$ git merge propuesta-a   # la primera fusión entra sin conflicto"
git merge -q propuesta-a -m "Fusiona propuesta-a"
echo
codigo=0
echo "\$ git merge propuesta-b   # la segunda toca la misma línea"
git merge propuesta-b || codigo=$?
echo "código de salida: $codigo"
echo
echo "\$ cat resumen.txt   # los marcadores de conflicto en el fichero"
cat resumen.txt
echo
echo "(se resuelve editando el fichero a la versión correcta, git add y commit)"
exit "$codigo"
