const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const fonte = fs.readFileSync(path.join(__dirname, "../minha-jornada.js"), "utf8");
const inicio = fonte.indexOf("      const CHAVES_EXCLUSAO");
const fim = fonte.indexOf("      const apagarTudo", inicio);
assert.ok(inicio >= 0 && fim > inicio);
const contexto = vm.createContext({});
vm.runInContext(fonte.slice(inicio, fim) + "\nglobalThis.excluir = excluirDadosPersona;", contexto);
const conhecidas = ["persona_resultado_v1", "persona_resultado_v2", "persona_resultado_v3",
  "persona_perfil_salvo_v1", "persona_perfil_salvo_v3", "persona_historico_v1",
  "persona_progresso_v3", "persona_backup_historico_1790000000000"];
const externas = ["vetquiz_historico", "persona_outro_projeto", "persona_backup_historico_abc",
  "persona_backup_historico_123_extra", "persona_resultado_v4", "configuracoes_usuario"];
function armazenamento(chaves) {
  const dados = Object.fromEntries(chaves.map(k => [k, "preservar"]));
  Object.defineProperty(dados, "removeItem", { value(k) { delete dados[k]; } });
  return dados;
}
test("exclusao seletiva preserva chaves desconhecidas em ambos os armazenamentos", () => {
  for (const dados of [armazenamento([...conhecidas, ...externas]), armazenamento([...externas, ...conhecidas])]) {
    contexto.excluir(dados);
    assert.deepEqual(Object.keys(dados).sort(), [...externas].sort());
    for (const k of externas) assert.equal(dados[k], "preservar");
    contexto.excluir(dados);
    assert.deepEqual(Object.keys(dados).sort(), [...externas].sort());
  }
});
test("armazenamento vazio nao causa erro", () => {
  const dados = armazenamento([]);
  contexto.excluir(dados);
  assert.deepEqual(Object.keys(dados), []);
});
test("falha de exclusao e propagada ao tratamento de erro da interface", () => {
  const dados = { persona_historico_v1: "dados", vetquiz_historico: "externo" };
  Object.defineProperty(dados, "removeItem", { value() { throw new Error("bloqueado"); } });
  assert.throws(() => contexto.excluir(dados), /bloqueado/);
  assert.equal(dados.vetquiz_historico, "externo");
});
