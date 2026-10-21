#!/bin/sh
# remoto-local.sh — un origin de verdad sin salir de tu máquina (l04)
# El remoto es un repositorio bare: push, fetch y pull reales sin red.
# Uso: sh remoto-local.sh (borra el temporal).
set -e

demo="$(mktemp -d)"
trap 'rm -rf "$demo"' EXIT

git init -q --bare "$demo/proyecto-origin.git"

cd "$demo"
mkdir principal && cd principal
git init -q
rama="$(git symbolic-ref --short HEAD)"
git config user.name "Demo Flujo"
git config user.email "demo@example.invalid"
printf 'hola\n' > saludo.txt
git add saludo.txt
git commit -q -m "Añade saludo.txt"
echo "\$ git remote add origin ../proyecto-origin.git"
git remote add origin "$demo/proyecto-origin.git"
echo "\$ git push -u origin $rama   # -u enlaza la rama local con su remota"
git push -q -u origin "$rama"
echo

cd "$demo"
git clone -q proyecto-origin.git companero
cd companero
git config user.name "Companero"
git config user.email "companero@example.invalid"
printf 'hola equipo\n' > saludo.txt
git commit -qam "Generaliza el saludo en la copia del compañero"
echo "\$ git push   # el compañero publica su commit"
git push -q
echo

cd "$demo/principal"
echo "\$ git fetch origin   # baja los commits SIN fusionar"
git fetch -q origin
echo "\$ git log $rama..origin/$rama --oneline   # lo que hay en el remoto y no aquí"
git log "$rama..origin/$rama" --oneline
echo
echo "\$ git pull --ff-only   # fusiona en línea recta (sin commit de fusión)"
git pull -q --ff-only
echo "\$ cat saludo.txt"
cat saludo.txt
echo
echo "\$ git log --oneline"
git log --oneline
echo
