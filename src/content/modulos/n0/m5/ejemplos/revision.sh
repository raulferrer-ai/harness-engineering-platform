#!/bin/sh
# revision.sh — revisar la rama antes de fusionarla (l06)
# Tres vistas de revisión: qué aporta, qué cambia y cuánto pesa.
# Uso: sh revision.sh (borra el temporal).
set -e

demo="$(mktemp -d)"
trap 'rm -rf "$demo"' EXIT
cd "$demo"
git init -q
rama="$(git symbolic-ref --short HEAD)"
git config user.name "Demo Flujo"
git config user.email "demo@example.invalid"
printf 'pan,1.85\n' > gastos.csv
git add gastos.csv
git commit -q -m "Añade gastos.csv"

git switch -q -c formatea-importes
printf 'pan,1.85 EUR\n' > gastos.csv
git commit -qam "Formatea los importes con moneda"
printf 'pan,1.85 EUR\ncine,9.00 EUR\n' > gastos.csv
git commit -qam "Añade cine formateado"
printf 'revisar el redondeo del total\n' > notas.txt
git add notas.txt
git commit -qam "Añade notas.txt con un pendiente"

echo "\$ git log $rama..formatea-importes --stat   # qué aporta la rama, commit a commit"
git log "$rama..formatea-importes" --stat
echo
echo "\$ git diff $rama...formatea-importes   # el diff desde el punto de bifurcación"
git diff "$rama...formatea-importes"
echo
echo "\$ git diff $rama...formatea-importes --stat   # vista corta para decidir"
git diff "$rama...formatea-importes" --stat
echo
echo "(la revisión encuentra notas.txt: no pertenece a este cambio)"
