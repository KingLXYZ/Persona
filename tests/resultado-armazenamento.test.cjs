const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const fonte = fs.readFileSync(path.join(__dirname, "../resultado-v3.js"), "utf8");
function ambiente(local, sessao) {
  const status = { textContent: "" };
  const window = { location: { search: "?versao=3" } };
  for (const [tipo, valor] of [["localStorage", local], ["sessionStorage", sessao]]) {
    Object.defineProperty(window, tipo, { get() {
      if (valor instanceof Error) throw valor;
      return valor;
    } });
  }
  const contexto = vm.createContext({ window, URLSearchParams, console,
    document: { getElementById(id) { return id === "result-status" ? status : null; } }
  });
  const marcador = '  const parametros = new URLSearchParams';
  const pos = fonte.indexOf(marcador);
  assert.ok(pos >= 0);
  vm.runInContext(fonte.slice(0, pos) +
    'globalThis.api = { carregarSessao, carregarSalvo, lerJSON };\n' +
    '})();', contexto);
  return { api: contexto.api, status, contexto };
}
const vazio = { getItem() { return null; } };
const bloqueado = new Error("SecurityError");
test("getter de armazenamento bloqueado nao interrompe leitura", () => {
  const e = ambiente(bloqueado, bloqueado);
  assert.equal(e.api.carregarSessao(3), null);
  assert.equal(e.api.carregarSalvo("perfil", [3]), null);
  vm.runInContext(fonte, e.contexto);
  assert.match(e.status.textContent, /restringiu/);
});
test("falha de getItem nao impede acesso ao outro armazenamento", () => {
  const dados = { version: 3, totalPerguntas: 30, historicoId: "teste-1",
    revisaoInstrumento: 2, scores: { social: 50, cognitiva: 50, decisoria: 50, organizacional: 50, comportamental: 50 } };
  const e = ambiente({ getItem() { throw bloqueado; } }, { getItem() { return JSON.stringify(dados); } });
  assert.equal(e.api.carregarSalvo("perfil", [3]), null);
  assert.equal(e.api.carregarSessao(3).revisaoInstrumento, 2);
});
test("JSON invalido nao e confundido com bloqueio de armazenamento", () => {
  const e = ambiente({ getItem() { return "{"; } }, vazio);
  vm.runInContext(fonte, e.contexto);
  assert.match(e.status.textContent, /Nenhum resultado disponível/);
});
