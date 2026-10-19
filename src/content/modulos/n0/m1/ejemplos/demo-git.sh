#!/bin/sh
# demo-git.sh — recorrido mínimo de Git de la lección l07, en un repositorio temporal.
# Uso: sh demo-git.sh   (necesita git instalado; borra el directorio temporal al terminar)
set -e

demo="$(mktemp -d)"
trap 'rm -rf "$demo"' EXIT

cd "$demo"
git init -q
rama="$(git symbolic-ref --short HEAD)"
git config user.name "Demo"
git config user.email "demo@example.invalid"

printf 'hola\n' > saludo.txt
git add saludo.txt
git commit -q -m "Añade saludo.txt"

printf 'hola mundo\n' > saludo.txt
git commit -qam "Mejora el saludo"

echo "\$ git log --oneline"
git log --oneline
echo
echo "\$ git diff HEAD~1 HEAD -- saludo.txt"
git diff HEAD~1 HEAD -- saludo.txt
echo

printf 'adios\n' > despedida.txt
git add despedida.txt
git commit -q -m "Añade despedida.txt"

echo "\$ git revert --no-edit HEAD"
git revert --no-edit HEAD
echo
echo "\$ git log --oneline"
git log --oneline
echo
echo "\$ ls"
ls
echo

git checkout -q -b correccion
printf 'hola a todos\n' > saludo.txt
git commit -qam "Generaliza el saludo en la rama correccion"
git checkout -q "$rama"
git merge -q --no-ff correccion -m "Fusiona la rama correccion"

echo "\$ git log --oneline"
git log --oneline
