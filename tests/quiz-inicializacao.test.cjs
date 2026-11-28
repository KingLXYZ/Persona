// Testes de falhas visíveis na inicialização do quiz, sem navegador real.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const controlador = fs.readFileSync(path.join(__dirname, '..', 'quiz-v3.js'), 'utf8');
const dados = fs.readFileSync(path.join(__dirname, '..', 'quiz-perguntas.js'), 'utf8');

function executar({ ausente = null, bloquearArmazenamento = false } = {}) {
  const elementos = Object.fromEntries(
    ['quiz-question', 'quiz-options', 'quiz-counter', 'quiz-progress-fill',
     'quiz-back', 'quiz-next', '.quiz-progress', '.quiz-instruction']
      .map(id => [id, {
        id, textContent: id === 'quiz-question' ? 'Carregando a primeira pergunta...' : '',
        disabled: false,
        attributes: {},
        setAttribute(nome, valor) { this.attributes[nome] = String(valor); },
        getAttribute(nome) { return this.attributes[nome] ?? null; },
        focus() {}, replaceChildren() {}
      }])
  );
  const document = {
    getElementById: id => elementos[id] || null,
    querySelector: seletor => elementos[seletor] || null
  };
  const window = {
    PersonaQuizPontuacao: { calcularPontuacoes() {} },
    PersonaQuizProgresso: { criar() { throw Error('não deveria inicializar'); } },
    PersonaQuizInterface: { criar() { throw Error('não deveria inicializar'); } }
  };
  Object.defineProperty(window, 'sessionStorage', {
    get() {
      if (bloquearArmazenamento) throw new Error('SecurityError: storage blocked');
      return { getItem() { return null; }, setItem() {}, removeItem() {} };
    }
  });
  const contexto = vm.createContext({ window, document, console: { warn() {}, error() {} } });
  vm.runInContext(dados, contexto);
  if (ausente) delete window[ausente];
  assert.doesNotThrow(() => vm.runInContext(controlador, contexto));
  return elementos;
}

for (const modulo of [
  'PersonaQuizDados', 'PersonaQuizPontuacao', 'PersonaQuizProgresso', 'PersonaQuizInterface'
]) {
  test(`módulo ausente ${modulo} exibe erro em vez de manter carregando`, () => {
    const elementos = executar({ ausente: modulo });
    assert.match(elementos['quiz-question'].textContent, /Não foi possível carregar/);
    assert.match(elementos['.quiz-instruction'].textContent, /arquivos necessários/);
    assert.equal(elementos['quiz-next'].disabled, true);
    assert.equal(elementos['quiz-question'].getAttribute('aria-describedby'), 'quiz-instruction');
  });
}

test('sessionStorage bloqueado exibe erro e impede avanço', () => {
  const elementos = executar({ bloquearArmazenamento: true });
  assert.equal(elementos['quiz-question'].textContent, 'Encontramos um problema.');
  assert.match(elementos['.quiz-instruction'].textContent, /bloqueou o armazenamento/);
  assert.equal(elementos['quiz-next'].disabled, true);
  assert.equal(elementos['quiz-question'].getAttribute('aria-describedby'), 'quiz-instruction');
});
