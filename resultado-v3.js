/* =====================================================
   PERSONA — Resultados
   Controle interno de formatos anteriores preservado.
   Comunicação pública sem números de versão.
   Indicadores exploratórios; questionário não validado.
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
    baixo: "Neste perfil, suas respostas se aproximaram de preferências por interações mais reservadas.",
    medio: "Neste perfil, suas respostas ficaram próximas do centro da escala social apresentada.",
    alto: "Neste perfil, suas respostas se aproximaram de preferências por interações mais expansivas."
  };
  const socialRecente = {
    nome: "Social", esquerda: "Observação inicial", direita: "Iniciativa social",
    baixo: "Nas situações propostas, suas respostas se aproximaram da preferência por observar antes de iniciar interações.",
    medio: "Suas respostas ficaram próximas do centro desta escala. Isso pode refletir preferências diferentes conforme o contexto.",
    alto: "Nas situações propostas, suas respostas se aproximaram da preferência por iniciar conversas e participar espontaneamente."
  };
  const decisoriaV1 = {
    nome: "Decisória", esquerda: "Valores e relações", direita: "Análise de argumentos",
    baixo: "Neste perfil, suas respostas deram mais peso a valores e relações. Isso não significa ausência de análise.",
    medio: "Neste perfil, suas respostas ficaram próximas do centro da escala apresentada.",
    alto: "Neste perfil, suas respostas deram mais peso a argumentos e evidências. Isso não significa menor consideração pelas pessoas."
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


  /* =====================================================
     SEU PERFIL NO COTIDIANO
     Leitura complementar, sem alterar os cálculos.
     Usa somente pontuações já calculadas e não salva dados.
     ===================================================== */
  const COTIDIANO = {
    social: {
      nome: "Social", titulo: "Conversas e grupos",
      baixo: {
        texto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por observar antes de participar. Em um grupo novo, isso pode aparecer como a escolha de conhecer o ambiente antes de entrar na conversa.",
        pergunta: "Em quais ambientes você prefere ouvir primeiro? Há situações em que toma a iniciativa?"
      },
      medio: {
        texto: "As respostas não indicaram uma preferência uniforme entre observar e iniciar interações. Talvez a familiaridade com as pessoas ou o assunto da conversa faça diferença.",
        pergunta: "O que costuma mudar sua disposição para começar uma conversa?"
      },
      alto: {
        texto: "Nas situações apresentadas, suas respostas se aproximaram da iniciativa social. Isso pode aparecer ao começar conversas ou compartilhar ideias em grupos, dependendo do contexto.",
        pergunta: "Em quais situações você gosta de iniciar o contato? Quando prefere apenas observar?"
      }
    },
    cognitiva: {
      nome: "Cognitiva", titulo: "Aprendizado e ideias",
      baixo: {
        texto: "Suas respostas se aproximaram da preferência por exemplos concretos. Ao conhecer um assunto, pode fazer sentido para você procurar situações práticas antes de explorar conceitos mais gerais.",
        pergunta: "Que tipo de exemplo costuma ajudar você a compreender uma ideia nova?"
      },
      medio: {
        texto: "As respostas ficaram na faixa central entre exemplos concretos e possibilidades abstratas. Isso pode refletir formas diferentes de abordar assuntos conforme a tarefa.",
        pergunta: "Quando você prefere um exemplo prático e quando gosta de discutir possibilidades?"
      },
      alto: {
        texto: "Suas respostas se aproximaram do interesse por conceitos, relações e hipóteses. Em alguns assuntos, explorar uma ideia geral antes de examinar os detalhes pode parecer mais interessante.",
        pergunta: "Que temas despertam sua curiosidade por hipóteses? Quando você busca exemplos concretos?"
      }
    },
    decisoria: {
      nome: "Decisória", titulo: "Escolhas e alternativas",
      baixo: {
        texto: "Suas respostas se aproximaram da preferência por usar uma impressão inicial em certas escolhas. Em situações familiares, essa primeira avaliação pode ajudar a orientar os próximos passos.",
        pergunta: "Que decisões você costuma tomar pela impressão inicial? Quais exigem uma comparação mais cuidadosa?"
      },
      medio: {
        texto: "As respostas não apontaram uma preferência constante entre impressão inicial e análise estruturada. A importância da escolha ou o tempo disponível podem influenciar sua abordagem.",
        pergunta: "O que faz você mudar de uma decisão mais imediata para uma análise detalhada?"
      },
      alto: {
        texto: "Suas respostas se aproximaram da preferência por comparar opções e consequências. Em algumas escolhas, organizar critérios pode ajudar você a compreender melhor as alternativas disponíveis.",
        pergunta: "Em quais escolhas você gosta de estabelecer critérios? Quando decide de maneira mais espontânea?"
      }
    },
    organizacional: {
      nome: "Organizacional", titulo: "Rotina e projetos",
      baixo: {
        texto: "Suas respostas se aproximaram da preferência por manter possibilidades abertas. Em atividades pessoais, pode ser mais confortável ajustar a sequência das etapas conforme elas acontecem.",
        pergunta: "Em que atividades a liberdade de mudar os planos funciona melhor para você?"
      },
      medio: {
        texto: "As respostas ficaram próximas do centro entre flexibilidade e planejamento. Você pode preferir organizar certas tarefas com antecedência e deixar outras mais abertas.",
        pergunta: "Quais compromissos você gosta de planejar e quais prefere decidir na hora?"
      },
      alto: {
        texto: "Suas respostas se aproximaram da preferência por preparar etapas antecipadamente. Ao iniciar uma tarefa ou projeto, estabelecer uma sequência pode ser uma forma confortável de se organizar.",
        pergunta: "Quando o planejamento ajuda você? Em quais momentos prefere deixar espaço para mudanças?"
      }
    },
    comportamental: {
      nome: "Comportamental", titulo: "Imprevistos e respostas",
      baixo: {
        texto: "Nas situações descritas, suas respostas se aproximaram da tendência a agir prontamente diante de imprevistos. Isso pode envolver experimentar uma resposta inicial e ajustá-la ao longo da situação.",
        pergunta: "Quando agir logo costuma ser sua preferência? Em quais situações você decide fazer uma pausa?"
      },
      medio: {
        texto: "As respostas ficaram próximas do centro entre ação imediata e pausa para avaliação. O tipo de imprevisto pode influenciar a forma como você prefere responder.",
        pergunta: "Que situações levam você a responder rapidamente e quais pedem mais tempo?"
      },
      alto: {
        texto: "Nas situações descritas, suas respostas se aproximaram da preferência por fazer uma pausa antes de agir. Em alguns imprevistos, compreender o que mudou pode vir antes de escolher uma resposta.",
        pergunta: "Quando observar antes de agir parece mais útil para você? Em que momentos prefere agir logo?"
      }
    }
  };

  function mostrarCotidiano(scores, versao, demonstracao) {
    // O questionário mais antigo avaliava polos diferentes em certas dimensões.
    // Não atribuiremos a ele interpretações baseadas nos itens posteriores.
    if (versao === 1) return;
    const reflexao = document.querySelector(".result-reflection");
    if (!reflexao || document.getElementById("perfil-cotidiano")) return;

    const estilos = document.createElement("style");
    estilos.id = "estilos-perfil-cotidiano";
    estilos.textContent = `
      .cotidiano-section { scroll-margin-top: 24px; }
      .cotidiano-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 42px; }
      .cotidiano-card { display: flex; flex-direction: column; gap: 0; min-width: 0; padding: 30px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
      .cotidiano-card h3 { margin: 18px 0 12px; color: var(--text); font: 700 21px/1.35 "Manrope", sans-serif; }
      .cotidiano-text { color: var(--muted); font-size: 14px; line-height: 1.85; }
      .cotidiano-question { margin-top: 23px; padding-top: 18px; border-top: 1px solid var(--border); color: var(--text); font-size: 13px; line-height: 1.8; }
      .cotidiano-question strong { display: block; margin-bottom: 7px; color: var(--purple-light); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
      @media (max-width: 900px) { .cotidiano-card { padding: 24px; } }
      @media (max-width: 600px) {
        .cotidiano-grid { grid-template-columns: 1fr; gap: 14px; margin-top: 34px; }
        .cotidiano-card h3 { font-size: 19px; }
        .cotidiano-text { font-size: 13px; }
        .cotidiano-question { font-size: 13px; }
      }
    `;
    document.head.appendChild(estilos);

    const secao = document.createElement("section");
    secao.className = "result-section cotidiano-section";
    secao.id = "perfil-cotidiano";
    secao.setAttribute("aria-labelledby", "cotidiano-titulo");

    const cabecalho = document.createElement("div");
    cabecalho.className = "result-heading";
    const tag = document.createElement("span");
    tag.className = "result-tag";
    tag.textContent = "03 / SEU PERFIL NO COTIDIANO";
    const titulo = document.createElement("h2");
    titulo.id = "cotidiano-titulo";
    titulo.appendChild(document.createTextNode("Além das respostas. "));
    const destaque = document.createElement("span");
    destaque.textContent = "Situações para refletir.";
    titulo.appendChild(destaque);
    const introducao = document.createElement("p");
    introducao.textContent = demonstracao
      ? "Exemplo fictício de como os indicadores podem orientar perguntas sobre o cotidiano. Estas descrições não pertencem a uma pessoa real."
      : "Estes exemplos relacionam suas respostas a situações possíveis. São convites à reflexão, não previsões ou definições sobre seu comportamento.";
    cabecalho.append(tag, titulo, introducao);
    secao.appendChild(cabecalho);

    const grade = document.createElement("div");
    grade.className = "cotidiano-grid";
    ORDEM.forEach((chave, indice) => {
      const info = COTIDIANO[chave];
      const valor = scores[chave];
      const faixa = valor < 35 ? "baixo" : valor > 65 ? "alto" : "medio";
      const leitura = info[faixa];
      const cartao = document.createElement("article");
      cartao.className = "cotidiano-card";
      const numero = document.createElement("span");
      numero.className = "result-number";
      numero.textContent = `${String(indice + 1).padStart(2, "0")} / ${info.nome.toUpperCase()}`;
      const subtitulo = document.createElement("h3");
      subtitulo.textContent = info.titulo;
      const texto = document.createElement("p");
      texto.className = "cotidiano-text";
      texto.textContent = leitura.texto;
      const pergunta = document.createElement("p");
      pergunta.className = "cotidiano-question";
      const chamada = document.createElement("strong");
      chamada.textContent = "Para refletir";
      pergunta.append(chamada, document.createTextNode(leitura.pergunta));
      cartao.append(numero, subtitulo, texto, pergunta);
      grade.appendChild(cartao);
    });
    secao.appendChild(grade);
    reflexao.parentNode.insertBefore(secao, reflexao);
    const etiquetaFinal = reflexao.querySelector(".result-tag");
    if (etiquetaFinal) etiquetaFinal.textContent = "04 / SUA JORNADA";
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
    mostrarCotidiano(scores, versao, demonstracao);
    if (demonstracao) {
      statusEl.textContent = "DEMONSTRAÇÃO — Exemplo fictício com pontuações possíveis. Não é seu perfil.";
    } else {
      statusEl.textContent = "Resultado da sua exploração. Indicadores experimentais de autoconhecimento.";
      if (resultado.origem === "salvo") {
        statusEl.textContent += " Perfil recuperado deste navegador.";
      }
      if (versao === 1) {
        statusEl.textContent += " Este perfil foi criado com perguntas anteriores. Não compare diretamente suas pontuações com resultados mais recentes.";
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
    titulo.textContent = "Salvar meu perfil";
    Object.assign(titulo.style, { fontSize: "18px", letterSpacing: "-0.02em", lineHeight: "1.4" });
    painel.appendChild(titulo);

    const descricao = document.createElement("p");
    descricao.textContent = "O salvamento é opcional e fica apenas neste navegador. " +
      "São guardadas cinco pontuações, a data e informações técnicas para recuperar o perfil. " +
      "Não há cadastro nem sincronização entre dispositivos. Perfis anteriores permanecem separados.";
    Object.assign(descricao.style, { color: "var(--muted)", fontSize: "13px", lineHeight: "1.8", marginTop: "10px" });
    painel.appendChild(descricao);

    const mensagem = document.createElement("p");
    mensagem.setAttribute("role", "status");
    mensagem.setAttribute("aria-live", "polite");
    Object.assign(mensagem.style, { color: "var(--purple-light)", fontSize: "12px", marginTop: "14px", lineHeight: "1.7" });
    mensagem.textContent = salvoDaVersao
      ? `Perfil salvo neste navegador em ${textoData(salvoDaVersao.salvoEm)}.`
      : "Este perfil ainda não foi salvo neste navegador.";
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
      excluir.textContent = versao === 3 ? "Excluir perfil salvo" : "Excluir perfil anterior";
      excluir.addEventListener("click", () => {
        if (!window.confirm("Deseja excluir este perfil salvo? Outros perfis armazenados não serão afetados.")) return;
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
      if (anterior && !window.confirm("Já existe um perfil salvo para este questionário. Deseja substituí-lo por este resultado?")) return;
      try {
        localStorage.setItem(chave, JSON.stringify({
          formato: 1, version: versao, totalPerguntas: versao === 1 ? 20 : 30,
          scores: resultado.pontuacoes, salvoEm: new Date().toISOString()
        }));
        mensagem.textContent = "Perfil salvo neste navegador. Outros perfis foram preservados.";
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
      link.textContent = "Ver perfil mais recente";
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
    statusEl.textContent = "Nenhum resultado disponível. Conclua o questionário ou abra um perfil salvo neste navegador.";
    const leitura = document.getElementById("overview-combination");
    if (leitura) leitura.textContent = "Conclua o questionário para visualizar a leitura das dimensões.";
    const orientacao = document.getElementById("overview-guidance");
    if (orientacao) orientacao.textContent = "As pontuações são exploratórias e não representam diagnóstico ou avaliação psicológica validada.";
    return;
  }

  mostrarResultados(resultado);
  mostrarControles(resultado, salvoAntigo, salvoV3);
})();
