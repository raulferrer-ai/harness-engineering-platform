#!/bin/sh
# revisar-diff.sh — los tres diffs que importan antes de publicar (l02)
# Uno sin preparar, uno preparado y uno entre commits: cada uno responde una
# pregunta distinta. Uso: sh revisar-diff.sh (borra el temporal).
set -e

demo="$(mktemp -d)"
trap 'rm -rf "$demo"' EXIT
cd "$demo"
git init -q
rama="$(git symbolic-ref --short HEAD)"
git config user.name "Demo Flujo"
git config user.email "demo@example.invalid"

printf 'pan,comida,1.85\ncine,ocio,9.00\n' > gastos.csv
git add gastos.csv
git commit -q -m "Añade gastos.csv con dos gastos de prueba"

# Un cambio preparado (importe de cine) y otro sin preparar (gasto de transporte)
printf 'pan,comida,1.85\ncine,ocio,12.00\n' > gastos.csv
git add gastos.csv
printf 'pan,comida,1.85\ncine,ocio,12.00\ntransporte,transporte,5.40\n' > gastos.csv

echo "\$ git diff   # sin preparar: lo que aún NO entra en el próximo commit"
git diff
echo
echo "\$ git diff --staged   # preparado: lo que SÍ entrará en el próximo commit"
git diff --staged
echo
git commit -q -m "Actualiza el importe de cine en el CSV"
echo "\$ git diff HEAD~1 HEAD   # el commit recién creado, comparado con su padre"
git diff HEAD~1 HEAD
echo
git add gastos.csv
git commit -q -m "Añade el gasto de transporte al CSV"
echo "\$ git log --oneline"
git log --oneline
echo
