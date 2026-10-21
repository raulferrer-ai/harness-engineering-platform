#!/bin/sh
# repositorio-proyecto.sh — el proyecto de m4 bajo control de versiones (l01)
# Copia el proyecto del módulo anterior y le da una historia de 4 commits
# con un mensaje por concepto. Uso: sh repositorio-proyecto.sh (borra el temporal).
set -e

demo="$(mktemp -d)"
trap 'rm -rf "$demo"' EXIT

cp -R "$(dirname "$0")/../../m4/ejemplos/proyecto" "$demo/proyecto"
cd "$demo/proyecto"
rm -rf node_modules
git init -q
rama="$(git symbolic-ref --short HEAD)"
git config user.name "Demo Flujo"
git config user.email "demo@example.invalid"

echo "\$ git status --short   # recién inicializado: todo sin rastrear"
git status --short
echo

git add package.json package-lock.json README.md
git commit -q -m "Añade el manifiesto, el lockfile y el README del proyecto"

git add src/
git commit -q -m "Separa el informe en tres módulos: gastos, informe y main"

git add test/
git commit -q -m "Añade las pruebas de composición del proyecto"

git add datos/
git commit -q -m "Incluye el CSV real de gastos como dato de prueba"

echo "\$ git log --oneline --stat"
git log --oneline --stat
echo
echo "\$ git status --short   # tras los 4 commits"
git status --short
echo "(árbol limpio: no hay cambios sin registrar)"
