const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const raiz = path.join(__dirname, "..");
test("referencias locais de CSS e JS possuem versao consistente", () => {
  const versoes = new Map();
  for (const pagina of ["index.html", "quiz.html", "resultado.html", "minha-jornada.html", "metodologia.html"]) {
    const html = fs.readFileSync(path.join(raiz, pagina), "utf8");
    const refs = [...html.matchAll(/(?:src|href)="([\w./-]+\.(?:css|js))([^"]*)"/g)];
    assert.ok(refs.length > 0, pagina);
    for (const [, arquivo, sufixo] of refs) {
      assert.match(sufixo, /^\?v=[1-9]\d*$/, pagina + ": " + arquivo);
      assert.ok(fs.existsSync(path.join(raiz, arquivo)), arquivo);
      if (versoes.has(arquivo)) assert.equal(sufixo, versoes.get(arquivo), pagina + ": " + arquivo);
      versoes.set(arquivo, sufixo);
    }
  }
});
