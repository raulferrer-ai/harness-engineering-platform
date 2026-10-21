#!/bin/sh
# push-rechazado.sh — el remoto rechaza un push que no sigue su historia (l04/l07)
# Termina en rojo a propósito: el rechazo es la protección haciendo su trabajo.
# Uso: sh push-rechazado.sh (devuelve código 1).
demo="$(mktemp -d)"
trap 'rm -rf "$demo"' EXIT

git init -q --bare "$demo/origin.git"

cd "$demo"
mkdir autor1 && cd autor1
git init -q
rama="$(git symbolic-ref --short HEAD)"
git config user.name "Autora"
git config user.email "autora@example.invalid"
git remote add origin "$demo/origin.git"
printf 'base\n' > notas.txt
git add notas.txt
git commit -q -m "Añade notas.txt"
git push -q -u origin "$rama"

cd "$demo"
git clone -q origin.git autor2
cd autor2
git config user.name "Autor B"
git config user.email "autorb@example.invalid"
printf 'base\nprimera línea del equipo\n' > notas.txt
git commit -qam "Documenta la primera línea del equipo"
git push -q

cd "$demo/autor1"
printf 'base\nprimera línea de mi escritorio\n' > notas.txt
git commit -qam "Documenta mi primera línea"
codigo=0
echo "\$ git push origin $rama   # historia divergente: el remoto lo rechaza"
git push origin "$rama" || codigo=$?
echo "código de salida: $codigo"
echo
echo "(la recuperación está en la lección: git pull --no-rebase y vuelve a intentarlo)"
exit "$codigo"
