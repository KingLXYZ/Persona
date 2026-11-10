/* =====================================================
   PERSONA — Página inicial
   Reconhece perfis salvos das versões 1, 2 e 3.
   A versão 3 tem prioridade, sem apagar perfis antigos.
   ===================================================== */
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const ano = document.getElementById("current-year");
    if (ano) ano.textContent = String(new Date().getFullYear());

    const dimensoes = [
      "social", "cognitiva", "decisoria", "organizacional", "comportamental"
    ];

    function lerPerfil(chave, versoesPermitidas) {
      try {
        const bruto = localStorage.getItem(chave);
        if (!bruto) return null;

        const dados = JSON.parse(bruto);
        if (!dados || dados.formato !== 1) return null;
        if (!versoesPermitidas.includes(dados.version)) return null;
        if (dados.totalPerguntas !== (dados.version === 1 ? 20 : 30)) return null;
        if (!dados.scores || typeof dados.scores !== "object" || Array.isArray(dados.scores)) return null;
        if (typeof dados.salvoEm !== "string" || !Number.isFinite(Date.parse(dados.salvoEm))) return null;

        const pontuacoesValidas = dimensoes.every(dimensao => {
          const valor = dados.scores[dimensao];
          return Number.isInteger(valor) && valor >= 0 && valor <= 100;
        });
        return pontuacoesValidas ? dados : null;
      } catch {
        return null;
      }
    }

    const perfil =
      lerPerfil("persona_perfil_salvo_v3", [3]) ||
      lerPerfil("persona_perfil_salvo_v1", [1, 2]);

    // Sem perfil salvo, os links padrão da página inicial continuam iguais.
    if (!perfil) return;

    const botaoPrincipal = document.querySelector(".hero-content .primary-button");
    if (!botaoPrincipal) return;

    // Direcionar explicitamente à versão correta evita exibir outra sessão.
    botaoPrincipal.href = `resultado.html?versao=${perfil.version}`;
    const seta = document.createElement("span");
    seta.textContent = "→";
    seta.setAttribute("aria-hidden", "true");
    botaoPrincipal.replaceChildren(document.createTextNode("Ver meu perfil "), seta);

    const botaoRefazer = document.createElement("a");
    botaoRefazer.href = "quiz.html";
    botaoRefazer.className = "secondary-button";
    botaoRefazer.textContent = "Refazer questionário →";

    const acoes = document.createElement("div");
    acoes.className = "hero-actions";
    acoes.style.display = "flex";
    acoes.style.flexWrap = "wrap";
    acoes.style.gap = "12px";
    acoes.style.alignItems = "center";
    botaoPrincipal.replaceWith(acoes);
    acoes.append(botaoPrincipal, botaoRefazer);

    const nota = document.querySelector(".hero-content .hero-note");
    if (nota) {
      const linha = nota.querySelector(".note-line");
      const mensagem = document.createElement("span");
      mensagem.textContent = "Seu perfil está salvo neste navegador.";
      nota.replaceChildren(...(linha ? [linha, mensagem] : [mensagem]));
    }
  });
})();
