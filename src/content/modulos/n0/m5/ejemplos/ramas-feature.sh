#!/bin/sh
# ramas-feature.sh — una rama por cambio, fusión y borrado (l05)
# git switch es el comando moderno para moverse entre ramas.
# Uso: sh ramas-feature.sh (borra el temporal).
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

echo "\$ git switch -c anade-cine   # rama por cambio"
git switch -q -c anade-cine
printf 'pan,1.85\ncine,9.00\n' > gastos.csv
git commit -qam "Añade cine al CSV"
printf 'pan,1.85\ncine,9.00\nmuseo,18.99\n' > gastos.csv
git commit -qam "Añade museo al CSV"

echo "\$ git log $rama..anade-cine --oneline   # solo lo que aporta la rama"
git log "$rama..anade-cine" --oneline
echo
echo "\$ git switch $rama && git merge --no-ff anade-cine -m «Fusiona anade-cine»"
git switch -q "$rama"
git merge -q --no-ff anade-cine -m "Fusiona anade-cine"
echo "\$ git log --oneline --graph   # el commit de fusión visible en el historial"
git log --oneline --graph
echo
echo "\$ git branch -d anade-cine   # la rama cumplió: se borra"
git branch -d anade-cine
echo "\$ git branch"
git branch
echo
