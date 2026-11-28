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

  // As pontuações e escalas permanecem visíveis; só a interpretação é recolhida.
  function transformarDimensoes() {
    const secao = document.getElementById("dimensoes");
    if (!secao) return;
    for (const cartao of secao.querySelectorAll(".result-card[data-dimension]")) {
      if (cartao.querySelector(".result-dimension-details")) continue;
      const descricao = cartao.querySelector(".result-description");
      if (!descricao) continue;

      const detalhes = document.createElement("details");
      detalhes.className = "result-dimension-details";
      const resumo = document.createElement("summary");
      resumo.textContent = "Entender minha pontuação";
      const nomeDimensao = cartao.querySelector("h3")?.textContent.trim();
      if (nomeDimensao) resumo.setAttribute("aria-label", `Entender minha pontuação: ${nomeDimensao}`);
      const conteudo = document.createElement("div");
      conteudo.className = "result-dimension-explanation";
      conteudo.appendChild(descricao);
      detalhes.append(resumo, conteudo);
      cartao.appendChild(detalhes);
    }
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

    const etiqueta = document.createElement("span");
    etiqueta.className = "kingdom-signature-label";
    etiqueta.textContent = "Um projeto de";

    const marca = document.createElement("span");
    marca.className = "kingdom-signature-name";
    const coroa = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    coroa.setAttribute("viewBox", "604 97 328 288");
    coroa.setAttribute("fill", "var(--purple-light, #c4b5fd)");
    coroa.setAttribute("aria-hidden", "true");
    const caminho = document.createElementNS("http://www.w3.org/2000/svg", "path");
    caminho.setAttribute("stroke", "none");
    caminho.setAttribute("d", "M624 160 L704 221 L768 117 L832 221 L912 160 L889 270 L864 270 L874 218 L828 254 L768 159 L708 254 L662 218 L672 270 L647 270 Z M651 287 L684 287 L688 305 L655 305 Z M852 287 L885 287 L881 305 L848 305 Z M659 322 L683 322 L688 342 L848 342 L853 322 L877 322 L870 359 Q869 365 862 365 L674 365 Q667 365 666 359 Z");
    coroa.appendChild(caminho);
    marca.append(coroa, document.createTextNode(NOME));

    const slogan = document.createElement("span");
    slogan.className = "kingdom-signature-slogan";
    slogan.textContent = "Beyond Imagination";
    slogan.lang = "en";
    assinatura.append(etiqueta, marca, slogan);
    footer.appendChild(assinatura);
  }

  // Navegação complementar dos resultados, sem interferir nos dados do perfil.
  function iniciarNavegacaoResultados() {
    const navegacao = document.querySelector(".result-quick-nav");
    const introducao = document.querySelector(".result-intro");
    if (!navegacao || !introducao || navegacao.dataset.navigationReady === "true") return;
    navegacao.dataset.navigationReady = "true";

    const botaoTopo = document.createElement("button");
    botaoTopo.type = "button";
    botaoTopo.className = "result-back-to-top";
    botaoTopo.textContent = "↑";
    botaoTopo.setAttribute("aria-label", "Voltar ao início dos resultados");
    botaoTopo.title = "Voltar ao início";
    botaoTopo.hidden = true;
    botaoTopo.addEventListener("click", () => {
      const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const titulo = document.getElementById("result-intro-title");
      if (titulo) titulo.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reduzir ? "instant" : "smooth" });
    });
    document.body.appendChild(botaoTopo);

    const links = Array.from(navegacao.querySelectorAll('a[href^="#"]'));
    // O Cotidiano é criado apenas para resultados com interpretação compatível.
    // Não apresentar atalhos que apontem para seções ausentes.
    for (const link of links) {
      const id = link.getAttribute("href").slice(1);
      if (!document.getElementById(id)) link.hidden = true;
    }
    const destinos = links.filter(link => !link.hidden).map(link => {
      const id = link.getAttribute("href").slice(1);
      return { link, elemento: document.getElementById(id) };
    }).filter(item => item.elemento);

    function atualizar() {
      const y = window.scrollY || window.pageYOffset || 0;
      const limite = introducao.getBoundingClientRect().bottom + y;
      botaoTopo.hidden = y < Math.max(500, limite);
      navegacao.classList.toggle("result-quick-nav--compact", y > limite);

      let atual = null;
      for (const item of destinos) {
        if (item.elemento.getBoundingClientRect().top <= 160) atual = item;
      }
      for (const item of destinos) {
        if (item === atual) item.link.setAttribute("aria-current", "location");
        else item.link.removeAttribute("aria-current");
      }
    }

    let pendente = false;
    function agendar() {
      if (pendente) return;
      pendente = true;
      window.requestAnimationFrame(() => {
        pendente = false;
        atualizar();
      });
    }
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    atualizar();
  }

  function iniciar() {
    const ano = document.getElementById('current-year');
    if (ano) ano.textContent = String(new Date().getFullYear());
    transformarCotidiano();
    transformarDimensoes();
    adicionarAssinatura();
    iniciarNavegacaoResultados();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
})();
