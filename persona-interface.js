/* ================================================================
   PERSONA — Interface e assinatura Kingdom Studios
   - Transforma cartões já renderizados em um acordeão acessível.
   - Adiciona assinatura discreta ao rodapé das páginas.
   - Não lê nem altera resultados, pontuações ou armazenamento.
   ================================================================ */
(() => {
  "use strict";

  const NOME = "KINGDOM STUDIOS";

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
    const ano = document.getElementById('current-year');
    if (ano) ano.textContent = String(new Date().getFullYear());
    transformarCotidiano();
    adicionarAssinatura();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
