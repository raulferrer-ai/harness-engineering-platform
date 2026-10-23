// clasificar.js — demo de l02: rojo falso y rojo genuino, lado a lado.
// Un rojo sólo cuenta si la suite llegó a ejecutarse: el import roto mata la
// carga del fichero y ese fallo no dice nada del comportamiento de la feature.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { clasificar, ejecutarSuite } from "./tdd.js";

const dir = mkdtempSync(join(tmpdir(), "n2m2-clasificar-"));
try {
  cpSync("feature", join(dir, "feature"), { recursive: true });
  const rutaTests = join(dir, "feature", "test", "contrasena.test.js");
  const rutaImpl = join(dir, "feature", "contrasena.js");
  const testsOriginales = readFileSync(rutaTests, "utf8");
  const implOriginal = readFileSync(rutaImpl, "utf8");

  // A — import roto: la prueba ni siquiera llega a correr.
  writeFileSync(
    rutaTests,
    testsOriginales.replace(
      "import { esValida, incumplidas }",
      "import { esValidaRota, incumplidas }",
    ),
  );
  const carga = clasificar(ejecutarSuite(join(dir, "feature")));
  console.log(`${carga.veredicto}: ${carga.detalle}`);

  // B — esqueleto: la suite corre y el comportamiento falta.
  writeFileSync(rutaTests, testsOriginales);
  writeFileSync(rutaImpl, readFileSync(join(dir, "feature", "esqueleto.js"), "utf8"));
  const comportamiento = clasificar(ejecutarSuite(join(dir, "feature")));
  console.log(`${comportamiento.veredicto}: ${comportamiento.detalle}`);

  // C — la feature real: verde.
  writeFileSync(rutaImpl, implOriginal);
  const verde = clasificar(ejecutarSuite(join(dir, "feature")));
  console.log(`${verde.veredicto}: ${verde.detalle}`);

  const correcto =
    carga.veredicto === "rojo falso" &&
    comportamiento.veredicto === "rojo genuino" &&
    verde.veredicto === "verde";
  if (!correcto) process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
