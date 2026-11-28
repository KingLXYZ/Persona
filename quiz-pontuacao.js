/* Pontuação experimental do Persona. Mantém a fórmula e as inversões atuais. */
(() => {
  "use strict";

  function calcularPontuacoes(dimensoes, perguntas, respostas) {
    if (!Array.isArray(dimensoes) || dimensoes.length !== 5 ||
        new Set(dimensoes).size !== 5 ||
        dimensoes.some(d => typeof d !== "string" || !d.trim()) ||
        !Array.isArray(perguntas) || perguntas.length !== 30 ||
        !respostas || typeof respostas !== "object" || Array.isArray(respostas)) {
      throw new TypeError("Dados do questionário inválidos.");
    }
    const ids = new Set();
    const totais = Object.fromEntries(
      dimensoes.map(d => [
        d,
        { soma: 0, quantidade: 0 }
      ])
    );

    perguntas.forEach(pergunta => {
      if (!pergunta || typeof pergunta.id !== "string" || !pergunta.id.trim() ||
          ids.has(pergunta.id) || !Object.hasOwn(totais, pergunta.dimensao) ||
          typeof pergunta.invertida !== "boolean") {
        throw new TypeError("Pergunta inválida ou duplicada.");
      }
      ids.add(pergunta.id);
      const resposta = respostas[pergunta.id];
      if (!Object.hasOwn(respostas, pergunta.id) ||
          !Number.isInteger(resposta) || resposta < 1 || resposta > 5) {
        throw new RangeError("Resposta ausente ou fora da escala.");
      }

      const valor = pergunta.invertida
        ? 6 - resposta
        : resposta;

      totais[pergunta.dimensao].soma += valor;
      totais[pergunta.dimensao].quantidade++;
    });

    if (dimensoes.some(d => totais[d].quantidade !== 6) ||
        Object.keys(respostas).some(id => !ids.has(id))) {
      throw new TypeError("Distribuição de perguntas ou respostas incompatível.");
    }

    return Object.fromEntries(
      dimensoes.map(d => {
        const media =
          totais[d].soma / totais[d].quantidade;

        const pontuacao = Math.round(
          ((media - 1) / 4) * 100
        );

        return [d, pontuacao];
      })
    );
  }

  window.PersonaQuizPontuacao = Object.freeze({ calcularPontuacoes });
})();
