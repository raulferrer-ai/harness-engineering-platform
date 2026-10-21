#!/bin/sh
# recuperar-versiones.sh — restore, stash y reflog en acción (l03)
# Tres formas de recuperarse: deshacer la preparación, aparcar cambios y
# resucitar un commit perdido. Uso: sh recuperar-versiones.sh (borra el temporal).
set -e

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

echo "\$ git restore --staged resumen.txt   # deshace la preparación, conserva el cambio"
printf 'total: 84.00\n' > resumen.txt
git add resumen.txt
git restore --staged resumen.txt
echo "\$ git status --short   # sigue modificado, pero fuera del área de preparación"
git status --short
echo

echo "\$ git restore resumen.txt   # descarta el cambio sin preparar (sin vuelta atrás)"
git restore resumen.txt
echo "\$ cat resumen.txt"
cat resumen.txt
echo

printf 'total: 83.69\nfecha: 2026-10-21\n' > resumen.txt
echo "\$ git stash push -m «prueba de fecha»   # aparca el cambio en caliente"
git stash push -m "prueba de fecha"
echo "\$ git stash list"
git stash list
echo "\$ git stash pop   # recupera lo aparocado"
git stash pop
echo "\$ cat resumen.txt"
cat resumen.txt
echo

git add resumen.txt
git commit -q -m "Añade la fecha al resumen"
ultimo="$(git rev-parse HEAD)"
echo "\$ git reset --hard HEAD~1   # «pierdo» el último commit"
git reset --hard HEAD~1
echo "\$ cat resumen.txt   # el contenido del commit desaparece del fichero"
cat resumen.txt
echo
echo "\$ git reset --hard \$ultimo   # el reflog lo recupera todo"
git reset --hard "$ultimo"
echo "\$ cat resumen.txt"
cat resumen.txt
echo
echo "(git reflog lista las posiciones guardadas de HEAD: nada se pierde)"
