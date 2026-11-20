// Testes de caracterização do questionário atual, sem alterar o código do site.
// Execute na raiz do repositório: node --test tests/quiz.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const fonte = fs.readFileSync(path.join(__dirname, '..', 'quiz-v3.js'), 'utf8');

function trechoEntre(inicio, fim) {
  const a = fonte.indexOf(inicio);
  const b = fonte.indexOf(fim, a + inicio.length);
  assert.ok(a !== -1 && b > a, 'Estrutura do arquivo mudou; revise a extração do teste.');
  return fonte.slice(a, b);
}

// Executa as definições e a função ORIGINAL de cálculo, isoladas do DOM.
// Esta extração temporária será substituída por imports após a modularização.
const definicoes = fs.readFileSync(path.join(__dirname, '..', 'quiz-perguntas.js'), 'utf8');
const calculo = fs.readFileSync(path.join(__dirname, '..', 'quiz-pontuacao.js'), 'utf8');
const contexto = vm.createContext({});
contexto.window = {};
vm.runInContext(definicoes, contexto);
vm.runInContext(calculo, contexto);
vm.runInContext('globalThis.quizTeste = window.PersonaQuizDados;', contexto);
const { dimensoes, perguntas } = contexto.quizTeste;
const nomes = Array.from(dimensoes);

function pontuar(respostaPorPergunta) {
  contexto.respostasTeste = respostaPorPergunta;
  return JSON.parse(JSON.stringify(contexto.window.PersonaQuizPontuacao.calcularPontuacoes(dimensoes, perguntas, contexto.respostasTeste)));
}

function todasCom(valor) {
  return Object.fromEntries(Array.from(perguntas, p => [p.id, valor]));
}

test('30 perguntas com IDs únicos e revisão válida', () => {
  assert.equal(perguntas.length, 30);
  assert.equal(new Set(Array.from(perguntas, p => p.id)).size, 30);
  for (const p of perguntas) {
    assert.match(p.id, /^(SOC|COG|DEC|ORG|COM)-\d{3}$/);
    assert.ok(Number.isInteger(p.revisao) && p.revisao >= 1);
    assert.ok(typeof p.texto === 'string' && p.texto.trim());
    assert.equal(typeof p.invertida, 'boolean');
  }
});

test('cinco dimensões, seis perguntas e três invertidas por dimensão', () => {
  assert.equal(nomes.length, 5);
  for (const nome of nomes) {
    const itens = Array.from(perguntas).filter(p => p.dimensao === nome);
    assert.equal(itens.length, 6, nome);
    assert.equal(itens.filter(p => p.invertida).length, 3, nome);
  }
});

test('resposta neutra em todas as perguntas produz 50 por dimensão', () => {
  assert.deepEqual(pontuar(todasCom(3)), Object.fromEntries(nomes.map(n => [n, 50])));
});

test('todas as respostas 1 ou 5 produzem 50 devido ao equilíbrio de inversões', () => {
  const esperado = Object.fromEntries(nomes.map(n => [n, 50]));
  assert.deepEqual(pontuar(todasCom(1)), esperado);
  assert.deepEqual(pontuar(todasCom(5)), esperado);
});

test('inversão aplica 6 - resposta e arredondamento atual', () => {
  const r = todasCom(3);
  const item = Array.from(perguntas).find(p => p.dimensao === nomes[0] && p.invertida);
  r[item.id] = 1; // invertido: 1 torna-se 5; média 20/6 => 58
  assert.equal(pontuar(r)[nomes[0]], 58);
  r[item.id] = 5; // invertido: 5 torna-se 1; média 16/6 => 42
  assert.equal(pontuar(r)[nomes[0]], 42);
});
