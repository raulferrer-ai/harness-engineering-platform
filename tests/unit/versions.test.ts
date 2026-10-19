import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const raiz = new URL("../../", import.meta.url);
const leer = (ruta: string): string => readFileSync(new URL(ruta, raiz), "utf8");

const packageJson = JSON.parse(leer("package.json")) as {
  engines: { node: string; npm: string };
  scripts: Record<string, string>;
};

/**
 * Guardarraíles del hito H0 (IMPLEMENTATION_PLAN.md §1.3 y §7):
 * la fijación de versiones tiene que seguir siendo coherente entre
 * .nvmrc, .node-version, package.json y el entorno que ejecuta los tests.
 */
describe("fijación de versiones y scripts del proyecto", () => {
  const nvmrc = leer(".nvmrc").trim();
  const nodeVersion = leer(".node-version").trim();

  it(".nvmrc y .node-version declaran exactamente la misma versión", () => {
    expect(nvmrc).toBe(nodeVersion);
  });

  it("la versión fijada es Node 24 y el entorno en uso usa esa misma línea mayor", () => {
    expect(nvmrc).toMatch(/^\d+\.\d+\.\d+$/);
    expect(process.versions.node.split(".")[0]).toBe(nvmrc.split(".")[0]);
  });

  it("package.json declara engines coherentes con la versión fijada", () => {
    expect(packageJson.engines.node.startsWith("^24")).toBe(true);
    expect(packageJson.engines.npm).toBe(">=9.6.5");
  });

  it("existen los scripts obligatorios de desarrollo, comprobación y compilación", () => {
    const requeridos = [
      "dev",
      "build",
      "build:deploy",
      "links",
      "preview",
      "check",
      "lint",
      "format",
      "format:check",
      "test",
      "verify",
    ];
    for (const script of requeridos) {
      expect(packageJson.scripts[script], `falta el script "${script}"`).toBeTruthy();
    }
  });
});
