/* Camada visual do questionário: acessibilidade, seleção e barra de progresso. */
(() => {
  "use strict";

  function criar({ perguntaEl, alternativasEl, progressoEl, barraEl }) {
    // Acessibilidade das alternativas.
    alternativasEl.setAttribute("role", "radiogroup");
    alternativasEl.setAttribute("aria-labelledby", perguntaEl.id);
    perguntaEl.setAttribute("tabindex", "-1");

    function atualizarProgresso(respondidas, total) {
      const porcentagem = Math.round((respondidas / total) * 100);
      progressoEl.style.width = `${porcentagem}%`;
      barraEl.setAttribute("aria-valuenow", String(porcentagem));
    }

    function atualizarRadios(selecionado) {
      alternativasEl.querySelectorAll(".quiz-option").forEach((botao, indice) => {
        const marcado = indice + 1 === selecionado;
        botao.classList.toggle("selected", marcado);
        botao.setAttribute("aria-checked", String(marcado));
        const entraNoTab = selecionado === null ? indice === 0 : marcado;
        botao.tabIndex = entraNoTab ? 0 : -1;
      });
    }

    return Object.freeze({ atualizarProgresso, atualizarRadios });
  }

  window.PersonaQuizInterface = Object.freeze({ criar });
})();
