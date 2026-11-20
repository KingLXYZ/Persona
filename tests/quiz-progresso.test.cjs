// Testes de caracterização da persistência atual. Não alteram o site.
// Execute: node --test tests/*.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dados = fs.readFileSync(path.join(__dirname, '..', 'quiz-perguntas.js'), 'utf8');
const modulo = fs.readFileSync(path.join(__dirname, '..', 'quiz-progresso.js'), 'utf8');

function ambiente() {
  const armazenado = new Map();
  const armazenamento = {
    getItem: chave => armazenado.has(chave) ? armazenado.get(chave) : null,
    setItem: (chave, valor) => armazenado.set(chave, String(valor)),
    removeItem: chave => armazenado.delete(chave)
  };
  const contexto = vm.createContext({ window: {}, console: { warn() {} } });
  vm.runInContext(dados, contexto);
  vm.runInContext(modulo, contexto);
  const perguntas = Array.from(contexto.window.PersonaQuizDados.perguntas);
  const ids = perguntas.map(p => p.id);
  let estado = {
    atual: 0,
    ordem: ids.slice(),
    respostas: Object.fromEntries(ids.map(id => [id, null])),
    armazenamentoDisponivel: true,
    progressoRestaurado: false,
    progressoIncompativel: false,
    avisoMigracao: ''
  };
  const apiModulo = contexto.window.PersonaQuizProgresso.criar({
    perguntas,
    perguntasPorId: new Map(perguntas.map(p => [p.id, p])),
    revisoesPerguntas: Object.fromEntries(perguntas.map(p => [p.id, p.revisao])),
    versao: 3,
    revisaoInstrumento: 1,
    chaveProgresso: 'persona_progresso_v3',
    armazenamento,
    obterEstado: () => estado,
    atualizarEstado: alteracoes => { estado = { ...estado, ...alteracoes }; }
  });
  const api = {
    ...apiModulo,
    estado: () => estado,
    definir: novo => { estado = { ...estado, ...novo }; }
  };
  const normalizar = valor => JSON.parse(JSON.stringify(valor));
  return { armazenamento, ids, api, normalizar };
}

test('salva progresso com IDs, revisões, ordem e posição atual', () => {
  const e = ambiente();
  const ordem = e.ids.slice().reverse();
  const respostas = Object.fromEntries(e.ids.map(id => [id, null]));
  respostas[ordem[0]] = 4;
  e.api.definir({ atual: 1, ordem, respostas });
  assert.equal(e.api.salvarProgresso(), true);
  const salvo = JSON.parse(e.armazenamento.getItem('persona_progresso_v3'));
  assert.equal(salvo.version, 3);
  assert.equal(salvo.totalPerguntas, 30);
  assert.equal(salvo.revisaoInstrumento, 1);
  assert.equal(salvo.atual, 1);
  assert.deepEqual(salvo.ordem, ordem);
  assert.equal(salvo.respostas[ordem[0]], 4);
  assert.equal(Object.keys(salvo.revisoesPerguntas).length, 30);
});

test('restaura respostas, ordem e posição de tentativa válida', () => {
  const e = ambiente();
  const ordem = e.ids.slice().reverse();
  const respostas = Object.fromEntries(e.ids.map(id => [id, null]));
  respostas[ordem[0]] = 2;
  e.api.definir({ atual: 1, ordem, respostas });
  e.api.salvarProgresso();
  e.api.definir({ atual: 0, ordem: e.ids.slice(), respostas: Object.fromEntries(e.ids.map(id => [id, null])) });
  e.api.restaurarProgresso();
  const estado = e.normalizar(e.api.estado());
  assert.equal(estado.progressoRestaurado, true);
  assert.equal(estado.atual, 1);
  assert.deepEqual(estado.ordem, ordem);
  assert.equal(estado.respostas[ordem[0]], 2);
});

test('não apaga progresso com JSON inválido', () => {
  const e = ambiente();
  const bruto = '{invalido';
  e.armazenamento.setItem('persona_progresso_v3', bruto);
  e.api.restaurarProgresso();
  assert.equal(e.api.estado().progressoIncompativel, true);
  assert.equal(e.armazenamento.getItem('persona_progresso_v3'), bruto);
});

test('não sobrescreve tentativa com revisão metodológica incompatível', () => {
  const e = ambiente();
  e.api.salvarProgresso();
  const salvo = JSON.parse(e.armazenamento.getItem('persona_progresso_v3'));
  salvo.revisaoInstrumento = 99;
  const bruto = JSON.stringify(salvo);
  e.armazenamento.setItem('persona_progresso_v3', bruto);
  e.api.restaurarProgresso();
  assert.equal(e.api.estado().progressoIncompativel, true);
  assert.equal(e.armazenamento.getItem('persona_progresso_v3'), bruto);
});

test('resposta fora da escala 1–5 torna tentativa incompatível sem apagar dados', () => {
  const e = ambiente();
  e.api.salvarProgresso();
  const salvo = JSON.parse(e.armazenamento.getItem('persona_progresso_v3'));
  salvo.respostas[e.ids[0]] = 7;
  const bruto = JSON.stringify(salvo);
  e.armazenamento.setItem('persona_progresso_v3', bruto);
  e.api.restaurarProgresso();
  assert.equal(e.api.estado().progressoIncompativel, true);
  assert.equal(e.armazenamento.getItem('persona_progresso_v3'), bruto);
});
