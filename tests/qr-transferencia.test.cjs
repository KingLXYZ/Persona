const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function carregar() {
  const sessoes = new Map();
  const destinos = [];
  const contexto = vm.createContext({
    btoa, atob, Intl,
    document: { readyState: "loading", addEventListener() {} },
    sessionStorage: { setItem(k, v) { sessoes.set(k, JSON.parse(v)); } },
    location: { assign(url) { destinos.push(url); } }
  });
  const fonte = fs.readFileSync(path.join(__dirname, "../persona-qr.js"), "utf8");
  const fim = fonte.lastIndexOf("})();");
  assert.ok(fim >= 0);
  vm.runInContext(fonte.slice(0, fim) +
    "globalThis.qr = { empacotar, desempacotar, irParaPerfil };\n" +
    fonte.slice(fim), contexto);
  return { ...contexto.qr, sessoes, destinos };
}
const perfil = {
  id: "exploracao-teste", versao: 3, revisaoInstrumento: 2,
  salvoEm: "2026-01-01T12:00:00.000Z",
  pontuacoes: { social: 0, cognitiva: 25, decisoria: 50, organizacional: 75, comportamental: 100 }
};
const normalizar = x => JSON.parse(JSON.stringify(x));

test("QR preserva perfil e revisao metodologica", () => {
  const qr = carregar();
  assert.deepEqual(normalizar(qr.desempacotar(qr.empacotar(perfil))), perfil);
});
test("QR antigo permanece sem revisao inventada", () => {
  const qr = carregar();
  for (const versao of [1, 2, 3]) {
    const antigo = { ...perfil, versao };
    delete antigo.revisaoInstrumento;
    assert.deepEqual(normalizar(qr.desempacotar(qr.empacotar(antigo))), antigo);
  }
});
test("QR rejeita revisoes invalidas ou incompativeis", () => {
  const qr = carregar();
  for (const revisaoInstrumento of [0, -1, 1.5, "2", null]) {
    assert.throws(() => qr.desempacotar(qr.empacotar({ ...perfil, revisaoInstrumento })));
  }
  assert.throws(() => qr.desempacotar(qr.empacotar({ ...perfil, versao: 2 })));
});
test("visualizacao importada preserva revisao e identificador", () => {
  const qr = carregar();
  qr.irParaPerfil(perfil);
  assert.deepEqual(qr.sessoes.get("persona_resultado_v3"), {
    version: 3, totalPerguntas: 30, scores: perfil.pontuacoes,
    historicoId: perfil.id, salvoEm: perfil.salvoEm, revisaoInstrumento: 2
  });
  assert.deepEqual(qr.destinos, ["resultado.html?versao=3"]);
});
test("visualizacao antiga nao inventa revisao", () => {
  const qr = carregar();
  const antigo = { ...perfil };
  delete antigo.revisaoInstrumento;
  qr.irParaPerfil(antigo);
  assert.equal(Object.hasOwn(qr.sessoes.get("persona_resultado_v3"), "revisaoInstrumento"), false);
});
