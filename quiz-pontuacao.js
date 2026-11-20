/* Pontuação experimental do Persona. Mantém a fórmula e as inversões atuais. */
(() => {
  "use strict";

  function calcularPontuacoes(dimensoes, perguntas, respostas) {
    const totais = Object.fromEntries(
      dimensoes.map(d => [
        d,
        { soma: 0, quantidade: 0 }
      ])
    );

    perguntas.forEach(pergunta => {
      const resposta = respostas[pergunta.id];

      const valor = pergunta.invertida
        ? 6 - resposta
        : resposta;

      totais[pergunta.dimensao].soma += valor;
      totais[pergunta.dimensao].quantidade++;
    });

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
