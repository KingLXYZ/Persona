/* PERSONA — Apresentação de resultados (v1 e v2).
   Indicadores exploratórios; não equivalem a medidas clínicas. */
(() => {
  "use strict";

  const CHAVES = { 1: "persona_resultado_v1", 2: "persona_resultado_v2" };

  const comuns = {
    cognitiva: {
      nome: "Cognitiva", esquerda: "Concreta", direita: "Abstrata",
      baixo: "Suas respostas se aproximaram mais da preferência por exemplos concretos e aplicações práticas nas situações apresentadas.",
      medio: "Suas respostas ficaram próximas do centro desta escala. Isso pode refletir preferências diferentes conforme a situação.",
      alto: "Suas respostas se aproximaram mais da preferência por hipóteses, novas possibilidades e relações entre ideias."
    },
    organizacional: {
      nome: "Organizacional", esquerda: "Flexibilidade", direita: "Planejamento",
      baixo: "Suas respostas se aproximaram mais da preferência por manter possibilidades abertas e ajustar planos durante as atividades.",
      medio: "Suas respostas ficaram próximas do centro desta escala, sem evidenciar uma preferência definida neste conjunto de perguntas.",
      alto: "Suas respostas se aproximaram mais da preferência por organizar etapas, prazos e planos com antecedência."
    },
    comportamental: {
      nome: "Comportamental", esquerda: "Reação imediata", direita: "Pausa para avaliar",
      baixo: "Nas situações descritas, você relatou maior tendência a responder de maneira imediata diante de imprevistos.",
      medio: "Suas respostas se aproximaram do centro ou variaram entre reação imediata e pausa para avaliar.",
      alto: "Nas situações descritas, você relatou maior tendência a fazer uma pausa e considerar opções antes de responder."
    }
  };

  const socialV1 = {
    nome: "Social", esquerda: "Reserva", direita: "Expansividade",
    baixo: "Suas respostas se aproximaram mais de preferências por momentos reservados e interações em grupos menores.",
    medio: "Suas respostas ficaram próximas do centro da escala social utilizada na primeira versão.",
    alto: "Suas respostas se aproximaram mais da disposição para iniciar interações e compartilhar experiências."
  };
  const socialV2 = {
    nome: "Social", esquerda: "Observação inicial", direita: "Iniciativa social",
    baixo: "Nas situações propostas, suas respostas se aproximaram mais da preferência por observar antes de iniciar interações.",
    medio: "Suas respostas ficaram próximas do centro da escala. Isso pode refletir preferências diferentes conforme o contexto.",
    alto: "Nas situações propostas, suas respostas se aproximaram mais da iniciativa de conversar e participar espontaneamente."
  };
  const decisoriaV1 = {
    nome: "Decisória", esquerda: "Valores e relações", direita: "Análise de argumentos",
    baixo: "Na primeira versão, suas respostas deram mais peso a valores e consequências para as pessoas. Isso não significa ausência de análise lógica.",
    medio: "Suas respostas ficaram próximas do centro da escala antiga, que não permite concluir um equilíbrio entre lógica e consideração pelas pessoas.",
    alto: "Na primeira versão, suas respostas deram mais peso a argumentos e evidências. Isso não significa menor consideração pelas pessoas."
  };
  const decisoriaV2 = {
    nome: "Decisória", esquerda: "Impressão inicial", direita: "Análise estruturada",
    baixo: "Nas situações apresentadas, suas respostas se aproximaram mais da preferência por seguir uma impressão inicial ao escolher.",
    medio: "Suas respostas ficaram próximas do centro desta escala. Isso não define uma preferência constante em todas as situações.",
    alto: "Nas situações apresentadas, suas respostas se aproximaram mais da preferência por comparar critérios, alternativas e consequências."
  };

  const DIMENSOES = {
    1: { social: socialV1, cognitiva: comuns.cognitiva, decisoria: decisoriaV1, organizacional: comuns.organizacional, comportamental: comuns.comportamental },
    2: { social: socialV2, cognitiva: comuns.cognitiva, decisoria: decisoriaV2, organizacional: comuns.organizacional, comportamental: comuns.comportamental }
  };

  const statusEl = document.getElementById("result-status");
  const anoEl = document.getElementById("current-year");
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());
  if (!statusEl) {
    console.error("PERSONA: elemento result-status não encontrado.");
    return;
  }

  function pontuacoesValidas(pontuacoes) {
    return pontuacoes !== null && typeof pontuacoes === "object" && !Array.isArray(pontuacoes) &&
      Object.keys(DIMENSOES[2]).every(chave =>
        Number.isInteger(pontuacoes[chave]) && pontuacoes[chave] >= 0 && pontuacoes[chave] <= 100);
  }

  function carregarVersao(versao) {
    try {
      const bruto = sessionStorage.getItem(CHAVES[versao]);
      if (!bruto) return null;
      const dados = JSON.parse(bruto);
      if (!dados || dados.version !== versao || !pontuacoesValidas(dados.scores)) return null;
      if (versao === 2 && dados.totalPerguntas !== 30) return null;
      return { versao, pontuacoes: dados.scores };
    } catch (erro) {
      return null;
    }
  }

  function interpretar(configuracao, pontuacao) {
    if (pontuacao < 35) return configuracao.baixo;
    if (pontuacao > 65) return configuracao.alto;
    return configuracao.medio;
  }

  function mostrarResultados(pontuacoes, versao, demonstracao = false) {
    Object.entries(DIMENSOES[versao]).forEach(([chave, config]) => {
      const card = document.querySelector(`[data-dimension="${chave}"]`);
      const numero = document.getElementById(`score-${chave}`);
      const preenchimento = document.getElementById(`fill-${chave}`);
      const descricao = document.getElementById(`description-${chave}`);
      if (!card || !numero || !preenchimento || !descricao) return;

      const pontuacao = pontuacoes[chave];
      numero.textContent = String(pontuacao);
      preenchimento.style.width = `${pontuacao}%`;
      descricao.textContent = interpretar(config, pontuacao);

      const rotulos = card.querySelectorAll(".result-scale span");
      if (rotulos.length === 2) {
        rotulos[0].textContent = config.esquerda;
        rotulos[1].textContent = config.direita;
      }

      const medidor = preenchimento.parentElement;
      medidor.setAttribute("role", "meter");
      medidor.setAttribute("aria-label", `Indicador exploratório: ${config.nome}`);
      medidor.setAttribute("aria-valuemin", "0");
      medidor.setAttribute("aria-valuemax", "100");
      medidor.setAttribute("aria-valuenow", String(pontuacao));
    });

    statusEl.textContent = demonstracao
      ? "DEMONSTRAÇÃO — Valores fictícios da versão de 30 perguntas. Não representam seu perfil."
      : versao === 1
        ? "Resultado da versão 1 (20 perguntas). As pontuações não são diretamente comparáveis às da versão de 30 perguntas."
        : "Resultado experimental da versão 2 (30 perguntas). Os indicadores refletem apenas suas respostas neste questionário.";
  }

  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get("exemplo") === "1") {
    mostrarResultados({ social: 35, cognitiva: 75, decisoria: 60, organizacional: 85, comportamental: 55 }, 2, true);
  } else {
    const resultado = carregarVersao(2) || carregarVersao(1);
    if (resultado) {
      mostrarResultados(resultado.pontuacoes, resultado.versao);
    } else {
      statusEl.textContent = "Nenhum resultado disponível nesta sessão. Conclua o questionário para visualizar seu perfil.";
    }
  }
})();
