/* =====================================================
   PERSONA — Resultados V3, compatível com V1 e V2.
   ATENÇÃO: arquivo preparado para teste. A publicação
   só acontecerá quando resultado.html apontar para ele.
   Indicadores exploratórios; não é teste validado.
   ===================================================== */
(() => {
  "use strict";

  const CHAVES_SESSAO = {
    1: "persona_resultado_v1",
    2: "persona_resultado_v2",
    3: "persona_resultado_v3"
  };
  // Não mudar esta chave: ela contém os resultados antigos V1/V2.
  const CHAVE_ANTIGA = "persona_perfil_salvo_v1";
  // A V3 guarda seu próprio perfil e não substitui automaticamente a V2.
  const CHAVE_V3 = "persona_perfil_salvo_v3";
  const ORDEM = ["social", "cognitiva", "decisoria", "organizacional", "comportamental"];

  const comum = {
    cognitiva: {
      nome: "Cognitiva", esquerda: "Concreta", direita: "Abstrata",
      baixo: "Suas respostas se aproximaram da preferência por exemplos e situações concretas nas afirmações apresentadas.",
      medio: "Suas respostas ficaram próximas do centro desta escala. Isso pode refletir preferências diferentes conforme a situação.",
      alto: "Suas respostas se aproximaram da preferência por ideias gerais, hipóteses e relações entre conceitos."
    },
    organizacional: {
      nome: "Organizacional", esquerda: "Flexibilidade", direita: "Planejamento",
      baixo: "Suas respostas se aproximaram da preferência por manter possibilidades abertas e decidir etapas enquanto avança.",
      medio: "Suas respostas ficaram próximas do centro, sem indicar uma preferência uniforme nas situações descritas.",
      alto: "Suas respostas se aproximaram da preferência por organizar etapas e atividades antecipadamente."
    },
    comportamental: {
      nome: "Comportamental", esquerda: "Reação imediata", direita: "Pausa para avaliar",
      baixo: "Nas situações descritas, você relatou maior tendência a responder ou agir prontamente diante de imprevistos.",
      medio: "Suas respostas se aproximaram do centro ou variaram entre ação imediata e pausa para avaliar.",
      alto: "Nas situações descritas, você relatou maior tendência a fazer uma pausa antes de responder ou agir."
    }
  };
  const socialV1 = {
    nome: "Social", esquerda: "Reserva", direita: "Expansividade",
    baixo: "Na versão 1, suas respostas se aproximaram de preferências por interações mais reservadas.",
    medio: "Na versão 1, suas respostas ficaram próximas do centro da escala social utilizada na época.",
    alto: "Na versão 1, suas respostas se aproximaram de preferências por interações mais expansivas."
  };
  const socialRecente = {
    nome: "Social", esquerda: "Observação inicial", direita: "Iniciativa social",
    baixo: "Nas situações propostas, suas respostas se aproximaram da preferência por observar antes de iniciar interações.",
    medio: "Suas respostas ficaram próximas do centro desta escala. Isso pode refletir preferências diferentes conforme o contexto.",
    alto: "Nas situações propostas, suas respostas se aproximaram da preferência por iniciar conversas e participar espontaneamente."
  };
  const decisoriaV1 = {
    nome: "Decisória", esquerda: "Valores e relações", direita: "Análise de argumentos",
    baixo: "Na versão 1, suas respostas deram mais peso a valores e relações. Isso não significa ausência de análise.",
    medio: "Na versão 1, suas respostas ficaram próximas do centro da escala antiga.",
    alto: "Na versão 1, suas respostas deram mais peso a argumentos e evidências. Isso não significa menor consideração pelas pessoas."
  };
  const decisoriaRecente = {
    nome: "Decisória", esquerda: "Impressão inicial", direita: "Análise estruturada",
    baixo: "Nas situações apresentadas, suas respostas se aproximaram da preferência por uma impressão inicial ao escolher.",
    medio: "Suas respostas ficaram próximas do centro desta escala. Isso não define uma preferência constante em todas as situações.",
    alto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por comparar critérios, alternativas e consequências."
  };
  const DIMENSOES = {
    1: { social: socialV1, cognitiva: comum.cognitiva, decisoria: decisoriaV1, organizacional: comum.organizacional, comportamental: comum.comportamental },
    2: { social: socialRecente, cognitiva: comum.cognitiva, decisoria: decisoriaRecente, organizacional: comum.organizacional, comportamental: comum.comportamental },
    3: { social: socialRecente, cognitiva: comum.cognitiva, decisoria: decisoriaRecente, organizacional: comum.organizacional, comportamental: comum.comportamental }
  };

  const statusEl = document.getElementById("result-status");
  const anoEl = document.getElementById("current-year");
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());
  if (!statusEl) {
    console.error("PERSONA: elemento #result-status ausente.");
    return;
  }

  function pontuacoesValidas(scores) {
    return scores !== null && typeof scores === "object" && !Array.isArray(scores) &&
      ORDEM.every(chave => Number.isInteger(scores[chave]) && scores[chave] >= 0 && scores[chave] <= 100);
  }

  function lerJSON(armazenamento, chave) {
    try {
      const bruto = armazenamento.getItem(chave);
      return bruto ? JSON.parse(bruto) : null;
    } catch (erro) {
      return null;
    }
  }

  function carregarSessao(versao) {
    const dados = lerJSON(sessionStorage, CHAVES_SESSAO[versao]);
    if (!dados || dados.version !== versao || !pontuacoesValidas(dados.scores)) return null;
    if (versao > 1 && dados.totalPerguntas !== 30) return null;
    return { versao, pontuacoes: dados.scores, origem: "sessao" };
  }

  function carregarSalvo(chave, versoes) {
    const dados = lerJSON(localStorage, chave);
    if (!dados || dados.formato !== 1 || !versoes.includes(dados.version) || !pontuacoesValidas(dados.scores)) return null;
    if (dados.version > 1 && dados.totalPerguntas !== 30) return null;
    if (typeof dados.salvoEm !== "string" || !Number.isFinite(Date.parse(dados.salvoEm))) return null;
    return { versao: dados.version, pontuacoes: dados.scores, origem: "salvo", salvoEm: dados.salvoEm };
  }

  function interpretar(config, valor) {
    return valor < 35 ? config.baixo : valor > 65 ? config.alto : config.medio;
  }

  function mostrarVisaoGeral(scores, versao, demonstracao) {
    const leitura = document.getElementById("overview-combination");
    const orientacao = document.getElementById("overview-guidance");
    if (!leitura || !orientacao) return;

    const dados = ORDEM.map(chave => {
      const config = DIMENSOES[versao][chave];
      const valor = scores[chave];
      return {
        nome: config.nome, valor,
        polo: valor < 35 ? config.esquerda : valor > 65 ? config.direita : null,
        distancia: Math.abs(valor - 50)
      };
    });
    const destaques = dados.filter(d => d.polo !== null)
      .sort((a, b) => b.distancia - a.distancia)
      .slice(0, 2);
    const abertura = demonstracao ? "Neste exemplo fictício, " : "Neste questionário, ";

    if (destaques.length === 2) {
      const [a, b] = destaques;
      leitura.textContent = abertura +
        `a dimensão ${a.nome} apresentou ${a.valor}/100, mais próxima de “${a.polo}”. ` +
        `A dimensão ${b.nome} apresentou ${b.valor}/100, mais próxima de “${b.polo}”. ` +
        "Essas preferências aparecem em contextos diferentes; uma pontuação não determina a outra.";
    } else if (destaques.length === 1) {
      const d = destaques[0];
      leitura.textContent = abertura +
        `a dimensão ${d.nome} apresentou ${d.valor}/100, mais próxima de “${d.polo}”. ` +
        "As demais pontuações ficaram na faixa central do questionário.";
    } else {
      leitura.textContent = abertura +
        "as cinco pontuações ficaram na faixa central (35 a 65). " +
        "Isso não comprova equilíbrio: as respostas podem variar conforme a situação.";
    }

    const centrais = dados.filter(d => d.polo === null);
    orientacao.textContent = centrais.length
      ? `Ficaram na faixa central: ${centrais.map(d => d.nome).join(", ")}. ` +
        "Estar perto de 50 não demonstra equilíbrio ou ausência de preferências. " +
        `Cada indicador resume ${versao === 1 ? 4 : 6} afirmações e não é uma medida clínica nem cientificamente validada.`
      : "Embora as cinco pontuações estejam fora da faixa central, isso não define características fixas. " +
        "Estes indicadores são experimentais e não foram validados cientificamente.";
  }

  function mostrarResultados(resultado, demonstracao = false) {
    const { versao, pontuacoes: scores } = resultado;
    for (const chave of ORDEM) {
      const config = DIMENSOES[versao][chave];
      const card = document.querySelector(`[data-dimension="${chave}"]`);
      const numero = document.getElementById(`score-${chave}`);
      const preenchimento = document.getElementById(`fill-${chave}`);
      const descricao = document.getElementById(`description-${chave}`);
      if (!card || !numero || !preenchimento || !descricao) continue;

      numero.textContent = String(scores[chave]);
      preenchimento.style.width = `${scores[chave]}%`;
      descricao.textContent = interpretar(config, scores[chave]);
      const rotulos = card.querySelectorAll(".result-scale span");
      if (rotulos.length === 2) {
        rotulos[0].textContent = config.esquerda;
        rotulos[1].textContent = config.direita;
      }
      const medidor = preenchimento.parentElement;
      if (medidor) {
        medidor.setAttribute("role", "meter");
        medidor.setAttribute("aria-label", `Indicador exploratório: ${config.nome}`);
        medidor.setAttribute("aria-valuemin", "0");
        medidor.setAttribute("aria-valuemax", "100");
        medidor.setAttribute("aria-valuenow", String(scores[chave]));
      }
    }
    mostrarVisaoGeral(scores, versao, demonstracao);
    if (demonstracao) {
      statusEl.textContent = "DEMONSTRAÇÃO — Exemplo fictício com pontuações possíveis. Não é seu perfil.";
    } else {
      statusEl.textContent = `Resultado experimental da versão ${versao} (${versao === 1 ? 20 : 30} perguntas).`;
      if (resultado.origem === "salvo") {
        statusEl.textContent += " Recuperado do armazenamento deste navegador.";
      }
      if (versao === 1) {
        statusEl.textContent += " As escalas antigas podem ter significados diferentes das versões atuais.";
      }
    }
  }

  function textoData(iso) {
    try { return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso)); }
    catch { return "uma data anterior"; }
  }

  function mostrarControles(resultado, perfilAntigo, perfilV3) {
    const versao = resultado.versao;
    const chave = versao === 3 ? CHAVE_V3 : CHAVE_ANTIGA;
    const salvoDaVersao = versao === 3 ? perfilV3 : perfilAntigo;
    const painel = document.createElement("section");
    painel.setAttribute("aria-label", "Salvar, consultar e excluir perfis");
    Object.assign(painel.style, {
      marginTop: "20px", padding: "22px", border: "1px solid var(--border)",
      borderRadius: "10px", background: "var(--surface)"
    });
    const titulo = document.createElement("h2");
    titulo.textContent = versao === 3 ? "Guardar meu perfil V3" : "Guardar meu perfil";
    Object.assign(titulo.style, { fontSize: "18px", letterSpacing: "-0.02em", lineHeight: "1.4" });
    painel.appendChild(titulo);

    const descricao = document.createElement("p");
    descricao.textContent = "O salvamento é opcional e local a este navegador. " +
      "Guardamos apenas cinco pontuações, a versão e a data, sem conta ou sincronização. " +
      "A V3 é guardada separadamente dos perfis anteriores.";
    Object.assign(descricao.style, { color: "var(--muted)", fontSize: "13px", lineHeight: "1.8", marginTop: "10px" });
    painel.appendChild(descricao);

    const mensagem = document.createElement("p");
    mensagem.setAttribute("role", "status");
    mensagem.setAttribute("aria-live", "polite");
    Object.assign(mensagem.style, { color: "var(--purple-light)", fontSize: "12px", marginTop: "14px", lineHeight: "1.7" });
    mensagem.textContent = salvoDaVersao
      ? `Já existe um perfil salvo desta família de versões desde ${textoData(salvoDaVersao.salvoEm)}.`
      : "Este perfil ainda não foi salvo permanentemente.";
    painel.appendChild(mensagem);

    const acoes = document.createElement("div");
    Object.assign(acoes.style, { display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "18px" });

    const salvar = document.createElement("button");
    salvar.type = "button";
    salvar.className = "primary-button";
    salvar.textContent = salvoDaVersao ? "Atualizar perfil salvo" : "Salvar neste navegador";

    let excluir = null;
    function atualizarExcluir() {
      const existente = carregarSalvo(chave, versao === 3 ? [3] : [1, 2]);
      if (!existente || excluir) return;
      excluir = document.createElement("button");
      excluir.type = "button";
      excluir.className = "secondary-button";
      excluir.textContent = versao === 3 ? "Excluir perfil V3 salvo" : "Excluir perfil antigo salvo";
      excluir.addEventListener("click", () => {
        if (!window.confirm("Excluir apenas este perfil salvo? O outro conjunto de versões será preservado.")) return;
        try {
          localStorage.removeItem(chave);
          sessionStorage.removeItem(CHAVES_SESSAO[versao]);
          window.location.reload();
        } catch {
          mensagem.textContent = "Não foi possível excluir os dados neste navegador.";
        }
      });
      acoes.appendChild(excluir);
    }

    salvar.addEventListener("click", () => {
      const anterior = carregarSalvo(chave, versao === 3 ? [3] : [1, 2]);
      if (anterior && !window.confirm("Já existe um perfil salvo desta versão. Deseja substituí-lo por este resultado?")) return;
      try {
        localStorage.setItem(chave, JSON.stringify({
          formato: 1, version: versao, totalPerguntas: versao === 1 ? 20 : 30,
          scores: resultado.pontuacoes, salvoEm: new Date().toISOString()
        }));
        mensagem.textContent = "Perfil salvo neste navegador. Perfis de outras versões permanecem intactos.";
        salvar.textContent = "Atualizar perfil salvo";
        atualizarExcluir();
      } catch {
        mensagem.textContent = "Não foi possível salvar. Verifique as permissões de armazenamento do navegador.";
      }
    });
    acoes.appendChild(salvar);
    atualizarExcluir();

    // Oferece consulta à outra versão, sem misturar as pontuações.
    if (versao === 3 && perfilAntigo) {
      const link = document.createElement("a");
      link.className = "secondary-button";
      link.href = `resultado.html?versao=${perfilAntigo.versao}`;
      link.textContent = "Ver perfil anterior";
      acoes.appendChild(link);
    } else if (versao !== 3 && perfilV3) {
      const link = document.createElement("a");
      link.className = "secondary-button";
      link.href = "resultado.html?versao=3";
      link.textContent = "Ver perfil V3";
      acoes.appendChild(link);
    }
    painel.appendChild(acoes);
    statusEl.insertAdjacentElement("afterend", painel);
  }

  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get("exemplo") === "1") {
    mostrarResultados({
      versao: 3, origem: "demonstracao",
      pontuacoes: { social: 38, cognitiva: 75, decisoria: 58, organizacional: 83, comportamental: 54 }
    }, true);
    return;
  }

  const salvoAntigo = carregarSalvo(CHAVE_ANTIGA, [1, 2]);
  const salvoV3 = carregarSalvo(CHAVE_V3, [3]);
  const escolher = parametros.get("versao");
  let resultado;
  if (escolher === "3") {
    resultado = carregarSessao(3) || salvoV3;
  } else if (escolher === "2") {
    resultado = carregarSessao(2) || (salvoAntigo && salvoAntigo.versao === 2 ? salvoAntigo : null);
  } else if (escolher === "1") {
    resultado = carregarSessao(1) || (salvoAntigo && salvoAntigo.versao === 1 ? salvoAntigo : null);
  } else {
    // O quiz V2 usa resultado.html sem parâmetro. Preservamos esse comportamento.
    // O quiz V3 usará resultado.html?versao=3 quando for ativado.
    resultado = carregarSessao(2) || carregarSessao(3) || salvoV3 || salvoAntigo || carregarSessao(1);
  }

  if (!resultado) {
    statusEl.textContent = "Nenhum resultado disponível para esta versão. Conclua o questionário ou abra um perfil salvo neste navegador.";
    const leitura = document.getElementById("overview-combination");
    if (leitura) leitura.textContent = "Conclua o questionário para visualizar a leitura das dimensões.";
    const orientacao = document.getElementById("overview-guidance");
    if (orientacao) orientacao.textContent = "As pontuações são exploratórias e não representam diagnóstico ou avaliação psicológica validada.";
    return;
  }

  mostrarResultados(resultado);
  mostrarControles(resultado, salvoAntigo, salvoV3);
})();
