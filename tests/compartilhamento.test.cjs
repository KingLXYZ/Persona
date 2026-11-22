// Testes do gerador de cartões, sem navegador e sem modificar dados locais.
// Execute: node --test tests/compartilhamento.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function carregar() {
  const chamadas = [];
  const ctx = new Proxy({}, {
    get(obj, chave) {
      if (chave in obj) return obj[chave];
      if (chave === 'createLinearGradient') return () => ({ addColorStop() {} });
      return (...args) => { chamadas.push({ metodo: chave, args }); };
    },
    set(obj, chave, valor) { obj[chave] = valor; return true; }
  });
  const canvas = { width: 0, height: 0, getContext: tipo => tipo === '2d' ? ctx : null,
    toBlob: callback => callback({ type: 'image/png' }) };
  const contexto = vm.createContext({
    window: {},
    document: { createElement: tag => {
      assert.equal(tag, 'canvas');
      return canvas;
    } }
  });
  const fonte = fs.readFileSync(path.join(__dirname, '..', 'persona-compartilhamento.js'), 'utf8');
  vm.runInContext(fonte, contexto);
  return { api: contexto.window.PersonaCompartilhamento, canvas, chamadas };
}

const pontuacoes = { social: 42, cognitiva: 80, decisoria: 75, organizacional: 61, comportamental: 35 };

test('gera os dois formatos em 1080 x 1920, com valores reais', () => {
  for (const formato of ['completo', 'resumido']) {
    const { api, canvas, chamadas } = carregar();
    assert.equal(api.gerar({ pontuacoes, formato }), canvas);
    assert.equal(canvas.width, 1080);
    assert.equal(canvas.height, 1920);
    const textos = chamadas.filter(c => c.metodo === 'fillText').map(c => c.args[0]);
    assert.ok(textos.includes('80'));
    assert.ok(textos.includes('75'));
    assert.ok(textos.includes('Questionário experimental, não validado.'));
    if (formato === 'completo') {
      assert.ok(textos.includes('42'));
      assert.ok(textos.includes('61'));
      assert.ok(textos.includes('35'));
    } else {
      assert.ok(!textos.includes('42'));
      assert.ok(!textos.includes('61'));
      assert.ok(!textos.includes('35'));
    }
  }
});

test('rejeita formatos e pontuações inválidos', () => {
  const { api } = carregar();
  assert.throws(() => api.gerar({ pontuacoes, formato: 'desconhecido' }));
  assert.throws(() => api.gerar({ pontuacoes: { ...pontuacoes, social: 101 } }));
  assert.throws(() => api.gerar({ pontuacoes: { ...pontuacoes, social: 42.5 } }));
  assert.throws(() => api.gerar({ pontuacoes: {} }));
});

test('converte o canvas para PNG sem alterar o histórico', async () => {
  const { api, canvas } = carregar();
  const blob = await api.criarBlob(canvas);
  assert.equal(blob.type, 'image/png');
});
