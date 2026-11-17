/* ================================================================
   PERSONA — Interface e assinatura Kingdom Studios
   - Transforma cartões já renderizados em um acordeão acessível.
   - Adiciona assinatura discreta ao rodapé das páginas.
   - Não lê nem altera resultados, pontuações ou armazenamento.
   ================================================================ */
(() => {
  "use strict";

  const CSS_ID = "persona-estilos-interface";
  const NOME = "KINGDOM STUDIOS";

  function adicionarEstilos() {
    if (document.getElementById(CSS_ID)) return;
    const style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = `
      /* Acordeão — Perfil no cotidiano */
      #perfil-cotidiano .persona-accordion {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
        width: 100%;
        max-width: 920px;
        margin-top: 36px;
      }
      #perfil-cotidiano .persona-accordion-item {
        min-width: 0;
        overflow: hidden;
        border: 1px solid var(--border, rgba(255, 255, 255, .11));
        border-radius: 12px;
        background: var(--surface, #111117);
      }
      #perfil-cotidiano .persona-accordion-item[open] {
        border-color: rgba(167, 139, 250, .4);
      }
      #perfil-cotidiano .persona-accordion-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        cursor: pointer;
        list-style: none;
        min-height: 78px;
        padding: 19px 25px;
        color: var(--text, #f5f3fa);
      }
      #perfil-cotidiano .persona-accordion-trigger::-webkit-details-marker { display: none; }
      #perfil-cotidiano .persona-accordion-trigger::marker { content: ""; }
      #perfil-cotidiano .persona-accordion-trigger:hover { background: rgba(167, 139, 250, .045); }
      #perfil-cotidiano .persona-accordion-trigger:focus-visible {
        outline: 2px solid var(--purple-light, #c4b5fd);
        outline-offset: -4px;
        border-radius: 10px;
      }
      #perfil-cotidiano .persona-accordion-label { display: grid; gap: 7px; min-width: 0; }
      #perfil-cotidiano .persona-accordion-label .result-number {
        display: block;
        font-size: 10px;
        letter-spacing: 1.6px;
        color: var(--purple, #a78bfa);
      }
      #perfil-cotidiano .persona-accordion-label strong {
        font: 700 clamp(16px, 2vw, 20px)/1.4 "Manrope", sans-serif;
        color: var(--text, #f5f3fa);
      }
      #perfil-cotidiano .persona-accordion-icon {
        flex: none;
        display: grid;
        place-items: center;
        height: 31px;
        width: 31px;
        border: 1px solid rgba(167, 139, 250, .32);
        border-radius: 50%;
        color: var(--purple-light, #c4b5fd);
        font-size: 21px;
        line-height: 1;
      }
      #perfil-cotidiano .persona-accordion-icon::before { content: "+"; }
      #perfil-cotidiano .persona-accordion-item[open] .persona-accordion-icon::before { content: "−"; }
      #perfil-cotidiano .persona-accordion-content {
        padding: 0 25px 25px;
      }
      #perfil-cotidiano .persona-accordion-content .cotidiano-text {
        margin: 0;
        color: var(--muted, #9995a5);
        font-size: 14px;
        line-height: 1.85;
      }
      #perfil-cotidiano .persona-accordion-content .cotidiano-question {
        margin: 19px 0 0;
        padding-top: 18px;
        border-top: 1px solid var(--border, rgba(255, 255, 255, .11));
        font-size: 13px;
        line-height: 1.8;
      }
      /* Assinatura de criação, sem alegação de registro de marca. */
      footer.footer { flex-wrap: wrap; }
      footer.footer .kingdom-signature {
        box-sizing: border-box;
        display: flex;
        flex: 0 0 100%;
        grid-column: 1 / -1;
        width: 100%;
        max-width: 100%;
        margin-top: 22px;
        padding: 21px 0 0;
        border-top: 1px solid var(--border, rgba(255, 255, 255, .1));
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 7px;
        text-align: center;
      }
      footer.footer .kingdom-signature-label {
        color: var(--muted, #9995a5);
        font-size: 10px;
        letter-spacing: 1.6px;
        text-transform: uppercase;
      }
      footer.footer .kingdom-signature-name {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: var(--text, #f5f3fa);
        font: 800 14px/1.4 "Manrope", sans-serif;
        letter-spacing: 1.2px;
      }
      footer.footer .kingdom-signature-name svg {
        width: 20px;
        height: 20px;
        stroke: var(--purple-light, #c4b5fd);
      }
      footer.footer .kingdom-signature-slogan {
        color: var(--purple-light, #c4b5fd);
        font-size: 10px;
        letter-spacing: 1.75px;
        text-transform: uppercase;
      }
      @media (max-width: 600px) {
        #perfil-cotidiano .persona-accordion { gap: 10px; margin-top: 27px; }
        #perfil-cotidiano .persona-accordion-trigger { min-height: 72px; padding: 16px 17px; }
        #perfil-cotidiano .persona-accordion-content { padding: 0 17px 19px; }
        #perfil-cotidiano .persona-accordion-content .cotidiano-text { font-size: 13px; }
        footer.footer .kingdom-signature { margin-top: 18px; padding-top: 19px; }
      }
      @media (prefers-reduced-motion: reduce) {
        #perfil-cotidiano .persona-accordion-trigger { scroll-behavior: auto; }
      }
    `;
    document.head.appendChild(style);
  }

  function transformarCotidiano() {
    const secao = document.getElementById("perfil-cotidiano");
    if (!secao || secao.querySelector(".persona-accordion")) return;
    const grade = secao.querySelector(".cotidiano-grid");
    if (!grade) return;
    const cartoes = Array.from(grade.querySelectorAll(":scope > .cotidiano-card"));
    if (cartoes.length === 0) return;

    const acordeao = document.createElement("div");
    acordeao.className = "persona-accordion";
    const introducao = secao.querySelector(".result-heading > p");
    if (introducao && !introducao.textContent.includes("Selecione uma dimensão")) {
      introducao.textContent += " Selecione uma dimensão para explorar sua reflexão.";
    }

    cartoes.forEach((cartao, index) => {
      const numero = cartao.querySelector(".result-number");
      const titulo = cartao.querySelector("h3");
      if (!titulo) return;

      const detalhes = document.createElement("details");
      detalhes.className = "persona-accordion-item";
      detalhes.open = index === 0;

      const resumo = document.createElement("summary");
      resumo.className = "persona-accordion-trigger";
      const rotulo = document.createElement("span");
      rotulo.className = "persona-accordion-label";
      if (numero) rotulo.appendChild(numero);
      const nome = document.createElement("strong");
      nome.textContent = titulo.textContent;
      rotulo.appendChild(nome);
      resumo.appendChild(rotulo);
      const icone = document.createElement("span");
      icone.className = "persona-accordion-icon";
      icone.setAttribute("aria-hidden", "true");
      resumo.appendChild(icone);

      const conteudo = document.createElement("div");
      conteudo.className = "persona-accordion-content";
      for (const filho of Array.from(cartao.children)) {
        if (filho !== titulo) conteudo.appendChild(filho);
      }
      detalhes.append(resumo, conteudo);
      detalhes.addEventListener("toggle", () => {
        if (!detalhes.open) return;
        for (const outro of acordeao.querySelectorAll(".persona-accordion-item")) {
          if (outro !== detalhes) outro.open = false;
        }
      });
      acordeao.appendChild(detalhes);
    });

    if (acordeao.children.length > 0) grade.replaceWith(acordeao);
  }

  function adicionarAssinatura() {
    let footer = document.querySelector("footer.footer");
    // A página do questionário não tinha rodapé; acrescentamos uma versão
    // discreta sem tocar nos controles e sem alterar a lógica das respostas.
    if (!footer && document.querySelector(".quiz-layout")) {
      footer = document.createElement("footer");
      footer.className = "footer kingdom-generated-footer";
      const link = document.createElement("a");
      link.className = "logo";
      link.href = "index.html";
      link.setAttribute("aria-label", "PERSONA — Página inicial");
      const simbolo = document.createElement("span");
      simbolo.className = "logo-symbol";
      simbolo.textContent = "P.";
      link.append(simbolo, document.createTextNode(" PERSONA"));
      const descricao = document.createElement("p");
      descricao.textContent = "Além da superfície, existe muito mais para descobrir.";
      const direito = document.createElement("span");
      direito.textContent = `© ${new Date().getFullYear()} PERSONA.`;
      footer.append(link, descricao, direito);
      document.body.appendChild(footer);
    }
    if (!footer || footer.querySelector(".kingdom-signature")) return;
    const assinatura = document.createElement("div");
    assinatura.className = "kingdom-signature";
    assinatura.setAttribute("aria-label", `${NOME} — Beyond Imagination`);

    const etiqueta = document.createElement("span");
    etiqueta.className = "kingdom-signature-label";
    etiqueta.textContent = "Um projeto de";

    const marca = document.createElement("span");
    marca.className = "kingdom-signature-name";
    const coroa = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    coroa.setAttribute("viewBox", "0 0 24 24");
    coroa.setAttribute("fill", "none");
    coroa.setAttribute("stroke-width", "1.8");
    coroa.setAttribute("stroke-linecap", "round");
    coroa.setAttribute("stroke-linejoin", "round");
    coroa.setAttribute("aria-hidden", "true");
    const caminho = document.createElementNS("http://www.w3.org/2000/svg", "path");
    caminho.setAttribute("d", "M3 9l4 4 5-7 5 7 4-4-2 12H5L3 9Z");
    coroa.appendChild(caminho);
    marca.append(coroa, document.createTextNode(NOME));

    const slogan = document.createElement("span");
    slogan.className = "kingdom-signature-slogan";
    slogan.textContent = "Beyond Imagination";
    assinatura.append(etiqueta, marca, slogan);
    footer.appendChild(assinatura);
  }

  function iniciar() {
    adicionarEstilos();
    transformarCotidiano();
    adicionarAssinatura();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
