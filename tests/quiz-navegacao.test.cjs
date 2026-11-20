// Testes de caracterização da ordem e da navegação lógica do questionário.
// Execute: node --test tests/*.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const quiz = fs.readFileSync(path.join(__dirname, '..', 'quiz-v3.js'), 'utf8');
const dados = fs.readFileSync(path.join(__dirname, '..', 'quiz-perguntas.js'), 'utf8');
const inicio = quiz.indexOf('  // Sorteia a ordem evitando perguntas da mesma dimensão em sequência.');
const fim = quiz.indexOf('  let erroAtivo = false;', inicio);
assert.ok(inicio >= 0 && fim > inicio, 'Funções de navegação não encontradas: revisar os testes.');
const logica = quiz.slice(inicio, fim);

function ambiente() {
  const contexto = vm.createContext({ window: {}, Math });
  vm.runInContext(dados, contexto);
  vm.runInContext(`const perguntas = window.PersonaQuizDados.perguntas;
    const perguntasPorId = new Map(perguntas.map(p => [p.id, p]));
    let ordem = perguntas.map(p => p.id);
    let atual = 0;
    let respostas = Object.fromEntries(perguntas.map(p => [p.id, null]));
    ${logica}
    globalThis.api = {
      sortearOrdem, perguntaAtual, primeiraPendente,
      definir: (estado) => { ordem = estado.ordem; atual = estado.atual; respostas = estado.respostas; }
    };`, contexto);
  const perguntas = Array.from(contexto.window.PersonaQuizDados.perguntas);
  return { api: contexto.api, perguntas, ids: perguntas.map(p => p.id) };
}

test('sorteio mantém os 30 IDs sem repetições', () => {
  const { api, ids } = ambiente();
  for (let i = 0; i < 30; i++) {
    const ordem = Array.from(api.sortearOrdem());
    assert.equal(ordem.length, 30);
    assert.equal(new Set(ordem).size, 30);
    assert.deepEqual(ordem.slice().sort(), ids.slice().sort());
  }
});

test('sorteio evita dimensões consecutivas iguais no questionário atual', () => {
  const { api, perguntas } = ambiente();
  const porId = new Map(perguntas.map(p => [p.id, p]));
  for (let i = 0; i < 30; i++) {
    const ordem = Array.from(api.sortearOrdem());
    for (let j = 1; j < ordem.length; j++) {
      assert.notEqual(porId.get(ordem[j - 1]).dimensao, porId.get(ordem[j]).dimensao);
    }
  }
});

test('primeira pendente segue a ordem da tentativa, não a ordem do banco', () => {
  const { api, ids } = ambiente();
  const ordem = ids.slice().reverse();
  const respostas = Object.fromEntries(ids.map(id => [id, 3]));
  respostas[ordem[8]] = null;
  respostas[ordem[19]] = null;
  api.definir({ ordem, atual: 29, respostas });
  assert.equal(api.primeiraPendente(), 8);
  assert.equal(api.perguntaAtual().id, ordem[29]);
});

test('sem respostas pendentes, primeiraPendente retorna -1', () => {
  const { api, ids } = ambiente();
  api.definir({ ordem: ids, atual: 0, respostas: Object.fromEntries(ids.map(id => [id, 4])) });
  assert.equal(api.primeiraPendente(), -1);
});
