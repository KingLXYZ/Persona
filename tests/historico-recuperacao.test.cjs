const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const codigo = fs.readFileSync(path.join(__dirname, '..', 'persona-historico.js'), 'utf8');
const CHAVE = 'persona_historico_v1';
const pontuacoes = { social: 50, cognitiva: 50, decisoria: 50, organizacional: 50, comportamental: 50 };
const valido = id => ({ id, versao: 3, totalPerguntas: 30, pontuacoes, salvoEm: '2026-11-20T12:00:00.000Z' });
function ambiente() {
  const mapa = new Map();
  const localStorage = {
    getItem: chave => mapa.has(chave) ? mapa.get(chave) : null,
    setItem: (chave, valor) => mapa.set(chave, String(valor)),
    removeItem: chave => mapa.delete(chave)
  };
  const contexto = vm.createContext({ window: {}, localStorage, Date, Math });
  vm.runInContext(codigo, contexto);
  return { api: contexto.window.PersonaHistorico, mapa, localStorage };
}
test('recuperação preserva registros válidos e guarda cópia do original', () => {
  const e = ambiente();
  const bruto = JSON.stringify({ formato: 1, registros: [valido('bom-1'), { id: 'ruim' }, valido('bom-2')] });
  e.localStorage.setItem(CHAVE, bruto);
  assert.equal(e.api.quantidadeIgnorada(), 1);
  const resultado = e.api.removerInvalidos();
  assert.equal(resultado.removidos, 1);
  assert.equal(resultado.preservados, 2);
  assert.equal(e.localStorage.getItem(resultado.backup), bruto);
  assert.equal(e.api.listar().length, 2);
  assert.equal(e.api.quantidadeIgnorada(), 0);
  assert.equal(e.api.excluir('bom-1'), true);
  assert.equal(e.api.listar().length, 1);
});
test('histórico inteiramente inválido pode ser recuperado sem apagar o backup', () => {
  const e = ambiente();
  const bruto = JSON.stringify({ formato: 1, registros: [{ id: 'ruim' }] });
  e.localStorage.setItem(CHAVE, bruto);
  assert.equal(e.api.listar().length, 0);
  assert.equal(e.api.quantidadeIgnorada(), 1);
  const r = e.api.removerInvalidos();
  assert.equal(r.removidos, 1);
  assert.equal(e.localStorage.getItem(r.backup), bruto);
  assert.equal(e.api.listar().length, 0);
});
test('JSON ilegível permanece intacto', () => {
  const e = ambiente();
  e.localStorage.setItem(CHAVE, '{quebrado');
  assert.throws(() => e.api.removerInvalidos(), /ilegível/);
  assert.equal(e.localStorage.getItem(CHAVE), '{quebrado');
});
test('falha ao criar backup impede qualquer alteração no histórico', () => {
  const e = ambiente();
  const bruto = JSON.stringify({ formato: 1, registros: [{ id: 'ruim' }] });
  e.localStorage.setItem(CHAVE, bruto);
  e.localStorage.setItem = (chave, valor) => {
    if (chave !== CHAVE) throw new Error('quota exceeded');
    e.mapa.set(chave, valor);
  };
  assert.throws(() => e.api.removerInvalidos(), /quota exceeded/);
  assert.equal(e.localStorage.getItem(CHAVE), bruto);
});
