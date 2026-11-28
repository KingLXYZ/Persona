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
    medio: "Sua pontuação ficou na faixa central desta escala. Esse valor, por si só, não mostra se suas respostas foram semelhantes ou diferentes entre as situações.",
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
  // Os textos revisados são usados nos resultados do questionário atual.
  // Os anteriores continuam interpretados pelo conjunto com que foram criados.
  const cognitivaAtual = {
    ...comum.cognitiva,
    baixo: "Nas situações apresentadas, suas respostas se aproximaram da preferência por exemplos práticos e aplicações concretas. Isso descreve uma preferência de abordagem, não sua capacidade de compreender ideias abstratas.",
    medio: "Sua pontuação ficou na faixa central entre as abordagens concreta e abstrata. Esse resultado, isoladamente, não permite identificar como suas preferências variaram entre as situações apresentadas.",
    alto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por explorar conceitos gerais, hipóteses e relações entre ideias. Isso não representa uma medida de inteligência, criatividade ou capacidade de aprendizagem."
  };
  const decisoriaAtual = {
    ...decisoriaRecente,
    baixo: "Nas situações apresentadas, suas respostas se aproximaram da preferência por utilizar impressões iniciais e experiências anteriores ao escolher. Isso não significa ausência de reflexão ou incapacidade de analisar alternativas.",
    medio: "Sua pontuação ficou na faixa central entre impressão inicial e análise estruturada. Esse valor não permite concluir, isoladamente, como você utiliza cada abordagem nas diferentes situações.",
    alto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por comparar critérios, alternativas e consequências antes de decidir. Isso não significa que suas decisões sejam necessariamente melhores ou mais corretas."
  };
  const organizacionalAtual = {
    ...comum.organizacional,
    baixo: "Nas situações apresentadas, suas respostas se aproximaram da preferência por manter alternativas abertas e definir etapas conforme as atividades avançam. Isso não significa falta de organização, disciplina ou comprometimento.",
    medio: "Sua pontuação ficou na faixa central entre flexibilidade e planejamento. Esse resultado não permite determinar, isoladamente, como você organiza diferentes atividades ou em quais situações prefere cada abordagem.",
    alto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por organizar atividades e preparar etapas antecipadamente. Isso não significa necessariamente maior produtividade, responsabilidade ou capacidade de alcançar objetivos."
  };
  const comportamentalAtual = {
    ...comum.comportamental,
    baixo: "Nas situações apresentadas, suas respostas se aproximaram da preferência por agir ou responder prontamente diante de acontecimentos inesperados. Isso não significa impulsividade, agressividade ou falta de autocontrole.",
    medio: "Sua pontuação ficou na faixa central entre reação imediata e pausa para avaliar. Esse resultado resume suas respostas, mas não permite determinar, isoladamente, como você reage em cada situação ou se suas preferências variam conforme o contexto.",
    alto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por compreender o que está acontecendo antes de responder ou agir. Isso não significa necessariamente maior equilíbrio emocional, maturidade ou capacidade de lidar com dificuldades."
  };

  const DIMENSOES = {
    1: { social: socialV1, cognitiva: comum.cognitiva, decisoria: decisoriaV1, organizacional: comum.organizacional, comportamental: comum.comportamental },
    2: { social: socialRecente, cognitiva: comum.cognitiva, decisoria: decisoriaRecente, organizacional: comum.organizacional, comportamental: comum.comportamental },
    3: { social: socialRecente, cognitiva: cognitivaAtual, decisoria: decisoriaAtual, organizacional: organizacionalAtual, comportamental: comportamentalAtual }
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

  // Cada conclusão recebe um identificador interno. Ao terminar outra vez,
  // o questionário substitui os dados da sessão, gerando um identificador novo.
  // Isso evita duplicatas sem confundir duas explorações com notas iguais.
  function criarIdExploracao() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `exploracao-${crypto.randomUUID()}`;
    }
    return `exploracao-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }

  // Resultados antigos sem revisão explícita permanecem identificados como legado.
  function revisaoResultado(dados, versao) {
    return versao === 3 && Number.isInteger(dados.revisaoInstrumento) &&
      dados.revisaoInstrumento >= 1 ? dados.revisaoInstrumento : undefined;
  }

  function carregarSessao(versao) {
    const dados = lerJSON(sessionStorage, CHAVES_SESSAO[versao]);
    if (!dados || dados.version !== versao || !pontuacoesValidas(dados.scores)) return null;
    if (versao > 1 && dados.totalPerguntas !== 30) return null;
    if (!dados.historicoId || typeof dados.historicoId !== "string") {
      dados.historicoId = criarIdExploracao();
      try {
        sessionStorage.setItem(CHAVES_SESSAO[versao], JSON.stringify(dados));
      } catch {
        // A ausência de armazenamento impede salvar o histórico, mas não ler o resultado.
      }
    }
    return {
      versao, pontuacoes: dados.scores, origem: "sessao", historicoId: dados.historicoId,
      ...(typeof dados.salvoEm === "string" && Number.isFinite(Date.parse(dados.salvoEm)) ? { salvoEm: dados.salvoEm } : {}),
      ...(revisaoResultado(dados, versao) === undefined ? {} :
        { revisaoInstrumento: revisaoResultado(dados, versao) })
    };
  }

  function carregarSalvo(chave, versoes) {
    const dados = lerJSON(localStorage, chave);
    if (!dados || dados.formato !== 1 || !versoes.includes(dados.version) || !pontuacoesValidas(dados.scores)) return null;
    if (dados.version > 1 && dados.totalPerguntas !== 30) return null;
    if (typeof dados.salvoEm !== "string" || !Number.isFinite(Date.parse(dados.salvoEm))) return null;
    const historicoId = typeof dados.historicoId === "string" && dados.historicoId.length >= 4
      ? dados.historicoId
      : `exploracao-importada-${dados.version}-${Date.parse(dados.salvoEm)}`;
    return {
      versao: dados.version, pontuacoes: dados.scores,
      origem: "salvo", salvoEm: dados.salvoEm, historicoId,
      ...(revisaoResultado(dados, dados.version) === undefined ? {} :
        { revisaoInstrumento: revisaoResultado(dados, dados.version) })
    };
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
        texto: "Sua pontuação ficou na faixa central da escala Social. Isso não permite concluir se suas respostas foram semelhantes ou variadas. A familiaridade com as pessoas e o assunto da conversa podem influenciar como você prefere participar.",
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
        texto: "Nas situações propostas, suas respostas se aproximaram da preferência por exemplos e aplicações concretas. Isso não significa maior ou menor capacidade de lidar com conceitos abstratos.",
        pergunta: "Quando aprende algo novo, que exemplos práticos costuma buscar? Em quais assuntos prefere começar pela ideia geral?"
      },
      medio: {
        texto: "Sua pontuação ficou na faixa central da escala Cognitiva. Esse resultado resume suas respostas, mas não revela, por si só, quais situações favoreceram exemplos concretos ou possibilidades abstratas.",
        pergunta: "Quando você está aprendendo algo novo, prefere começar por exemplos práticos ou por uma explicação mais geral? Isso muda conforme o assunto?"
      },
      alto: {
        texto: "Nas situações propostas, suas respostas se aproximaram da preferência por conceitos, hipóteses e relações entre ideias. Essa preferência não define inteligência ou capacidade de aprendizagem.",
        pergunta: "Quais assuntos despertam sua curiosidade por possibilidades e hipóteses? Quando exemplos concretos são mais úteis para você?"
      }
    },
    decisoria: {
      nome: "Decisória", titulo: "Escolhas e alternativas",
      baixo: {
        texto: "Suas respostas se aproximaram da preferência por impressões iniciais e experiências anteriores em certas escolhas. Isso não significa que você deixe de analisar alternativas quando necessário.",
        pergunta: "Em quais decisões costuma confiar na primeira impressão? Quando prefere examinar critérios e consequências?"
      },
      medio: {
        texto: "Sua pontuação ficou na faixa central da escala Decisória. Esse valor, sozinho, não permite determinar como você utiliza impressão inicial e análise estruturada em cada contexto.",
        pergunta: "Em quais situações você compara alternativas cuidadosamente? Quando costuma se apoiar mais na experiência?"
      },
      alto: {
        texto: "Suas respostas se aproximaram da preferência por examinar alternativas antes de decidir. Em algumas situações, comparar critérios e consequências pode ser uma abordagem com a qual você se identifica. Isso não determina a qualidade das suas decisões.",
        pergunta: "Em quais situações você prefere comparar alternativas detalhadamente? Quando costuma confiar mais em sua experiência ou impressão inicial?"
      }
    },
    organizacional: {
      nome: "Organizacional", titulo: "Rotina e projetos",
      baixo: {
        texto: "Suas respostas se aproximaram da preferência por manter opções abertas e definir etapas durante as atividades. Isso não significa falta de organização ou comprometimento.",
        pergunta: "Em quais atividades você prefere decidir os próximos passos durante o processo? Quando gosta de planejar antes?"
      },
      medio: {
        texto: "Sua pontuação ficou na faixa central da escala Organizacional. Isso resume suas respostas às situações apresentadas, mas não determina como você planeja ou adapta suas atividades em diferentes contextos.",
        pergunta: "Em quais atividades você prefere estabelecer etapas antecipadamente? Em quais situações gosta de manter liberdade para decidir durante o processo?"
      },
      alto: {
        texto: "Suas respostas se aproximaram da preferência por preparar atividades e definir etapas antecipadamente. Essa preferência não é uma medida de produtividade, disciplina ou responsabilidade.",
        pergunta: "Quais tarefas você gosta de planejar com antecedência? Em que situações prefere deixar os próximos passos em aberto?"
      }
    },
    comportamental: {
      nome: "Comportamental", titulo: "Imprevistos e respostas",
      baixo: {
        texto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por agir prontamente diante de imprevistos. Isso não significa impulsividade, agressividade ou falta de autocontrole.",
        pergunta: "Quando algo inesperado acontece, em quais situações você prefere agir imediatamente? Quando costuma fazer uma pausa?"
      },
      medio: {
        texto: "Sua pontuação ficou na faixa central da escala Comportamental. Esse valor não permite concluir, por si só, se você costuma agir imediatamente ou fazer uma pausa em situações específicas.",
        pergunta: "Quando algo inesperado acontece, em quais situações você prefere agir imediatamente? Em quais costuma reservar um momento para compreender melhor o que aconteceu?"
      },
      alto: {
        texto: "Nas situações apresentadas, suas respostas se aproximaram da preferência por fazer uma pausa antes de agir. Isso não comprova maior equilíbrio emocional ou maturidade.",
        pergunta: "Em quais situações prefere entender o que aconteceu antes de agir? Quando opta por responder prontamente?"
      }
    }
  };

  function mostrarCotidiano(scores, versao, demonstracao) {
    // O questionário mais antigo avaliava polos diferentes em certas dimensões.
    // Não atribuiremos a ele interpretações baseadas nos itens posteriores.
    if (versao === 1) return;
    const reflexao = document.querySelector(".result-reflection");
    if (!reflexao || document.getElementById("perfil-cotidiano")) return;

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
    // Registros anteriores ou sem revisão conhecida não recebem a leitura do instrumento atual.
    const revisaoAnterior = versao === 3 && resultado.revisaoInstrumento !== 2 && !demonstracao;
    for (const chave of ORDEM) {
      const config = DIMENSOES[versao][chave];
      const card = document.querySelector(`[data-dimension="${chave}"]`);
      const numero = document.getElementById(`score-${chave}`);
      const preenchimento = document.getElementById(`fill-${chave}`);
      const descricao = document.getElementById(`description-${chave}`);
      if (!card || !numero || !preenchimento || !descricao) continue;

      numero.textContent = String(scores[chave]);
      preenchimento.style.width = `${scores[chave]}%`;
      descricao.textContent = revisaoAnterior
        ? "Pontuação preservada de uma aplicação anterior. A interpretação específica desta dimensão não está disponível para esta revisão do questionário."
        : interpretar(config, scores[chave]);
      if (chave === "social" && !revisaoAnterior) {
        descricao.textContent += " Esta pontuação resume preferências em situações sociais específicas. Ela não define se você é antissocial, tímido ou introvertido.";
      }
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
    if (revisaoAnterior) {
      const leitura = document.getElementById("overview-combination");
      const orientacao = document.getElementById("overview-guidance");
      if (leitura) leitura.textContent = "Este perfil foi preservado de uma aplicação anterior. Não é possível reconstruir uma interpretação equivalente usando as perguntas atuais.";
      if (orientacao) orientacao.textContent = "Consulte as pontuações como registro histórico. Evite compará-las diretamente com resultados mais recentes.";
    } else {
      mostrarVisaoGeral(scores, versao, demonstracao);
      mostrarCotidiano(scores, versao, demonstracao);
    }
    if (demonstracao) {
      statusEl.textContent = "DEMONSTRAÇÃO — Exemplo fictício com pontuações possíveis. Não é seu perfil.";
    } else {
      statusEl.textContent = "Resultado da sua exploração. Indicadores experimentais de autoconhecimento.";
      if (resultado.origem === "salvo") {
        statusEl.textContent += " Perfil recuperado deste navegador.";
      }
      if (revisaoAnterior) {
        statusEl.textContent += " Este resultado foi criado com uma revisão anterior ou não identificada do questionário. Suas pontuações foram preservadas, mas as interpretações atuais não se aplicam automaticamente. Não compare diretamente com resultados recentes.";
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
    painel.className = "result-save-panel";
    const titulo = document.createElement("h2");
    titulo.textContent = "Salvar meu perfil";
    titulo.className = "result-save-title";
    painel.appendChild(titulo);

    const descricao = document.createElement("p");
    descricao.textContent = "O salvamento é opcional e fica apenas neste navegador. " +
      "Ao salvar, guardamos seu perfil mais recente e uma entrada no histórico com cinco pontuações e a data. " +
      "Não há cadastro nem sincronização entre dispositivos. O histórico preserva explorações anteriores.";
    descricao.className = "result-save-description";
    painel.appendChild(descricao);

    const mensagem = document.createElement("p");
    mensagem.setAttribute("role", "status");
    mensagem.setAttribute("aria-live", "polite");
    mensagem.className = "result-save-message";
    mensagem.textContent = salvoDaVersao
      ? `Perfil salvo neste navegador em ${textoData(salvoDaVersao.salvoEm)}.`
      : "Este perfil ainda não foi salvo neste navegador.";
    painel.appendChild(mensagem);

    const acoes = document.createElement("div");
    acoes.className = "result-save-actions";

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
        if (!window.confirm("Deseja excluir o perfil principal salvo? As explorações guardadas no histórico não serão apagadas.")) return;
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
      const historico = window.PersonaHistorico;
      if (!historico || typeof historico.adicionar !== "function") {
        mensagem.textContent = "O histórico ainda não foi carregado. Atualize a página e tente novamente.";
        return;
      }

      const anterior = carregarSalvo(chave, versao === 3 ? [3] : [1, 2]);
      const mesmaExploracao = anterior &&
        anterior.historicoId === resultado.historicoId &&
        anterior.revisaoInstrumento === resultado.revisaoInstrumento &&
        ORDEM.every(dim => anterior.pontuacoes[dim] === resultado.pontuacoes[dim]);
      if (anterior && !mesmaExploracao &&
          !window.confirm("Deseja tornar esta exploração seu perfil mais recente? A exploração anterior continuará no histórico, caso tenha sido salva nele.")) {
        return;
      }

      const id = resultado.historicoId || criarIdExploracao();
      let registroExistente;
      let salvoEm;
      let gravacao;
      try {
        registroExistente = historico.obter(id);
        salvoEm = registroExistente
          ? registroExistente.salvoEm
          : (resultado.salvoEm
            ? new Date(resultado.salvoEm).toISOString()
            : new Date().toISOString());
        gravacao = historico.adicionar({
          id, versao, pontuacoes: resultado.pontuacoes,
          revisaoInstrumento: resultado.revisaoInstrumento,
          salvoEm, origem: resultado.origem
        });
      } catch (erro) {
        mensagem.textContent = "Não foi possível guardar esta exploração no histórico. " +
          "Seu perfil anterior não foi alterado. " + (erro && erro.message ? erro.message : "");
        return;
      }

      try {
        localStorage.setItem(chave, JSON.stringify({
          formato: 1, version: versao, totalPerguntas: versao === 1 ? 20 : 30,
          scores: resultado.pontuacoes, salvoEm, historicoId: id,
          ...(resultado.revisaoInstrumento === undefined ? {} :
            { revisaoInstrumento: resultado.revisaoInstrumento })
        }));
        resultado.historicoId = id;
        resultado.salvoEm = salvoEm;
        const quantidade = historico.listar().length;
        mensagem.textContent = gravacao.criado
          ? `Perfil salvo! Você tem ${quantidade} ${quantidade === 1 ? "exploração guardada" : "explorações guardadas"} no histórico.`
          : `Perfil preservado. Esta exploração já estava no histórico (${quantidade} ${quantidade === 1 ? "registro" : "registros"}).`;
        salvar.textContent = "Atualizar perfil salvo";
        atualizarExcluir();
      } catch {
        mensagem.textContent = "A exploração foi guardada no histórico, mas não foi possível atualizar " +
          "seu perfil principal. Verifique as permissões de armazenamento.";
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

  // Compartilhamento opcional: imagens geradas localmente a partir do resultado real.
  function mostrarCompartilhamento(resultado) {
    const gerador = window.PersonaCompartilhamento;
    const ancora = document.getElementById("result-status");
    if (!gerador || !ancora || !resultado || resultado.origem === "demonstracao") return;

    const secao = document.createElement("section");
    secao.className = "result-share";
    secao.setAttribute("aria-label", "Compartilhar meu perfil");
    secao.style.marginTop = "32px";
    secao.style.padding = "26px";
    secao.style.border = "1px solid var(--border)";
    secao.style.background = "var(--surface)";

    // Painel nativo: fechado inicialmente e acessível por teclado/toque.
    const painel = document.createElement("details");
    painel.className = "result-share-details";
    const titulo = document.createElement("summary");
    titulo.textContent = "Compartilhar meu perfil";
    titulo.style.fontSize = "24px";
    titulo.style.fontWeight = "700";
    titulo.style.cursor = "pointer";
    titulo.style.padding = "4px 0";

    const explicacao = document.createElement("p");
    explicacao.textContent = "Escolha o que deseja mostrar. A imagem é criada no seu navegador, sem publicar suas respostas automaticamente.";
    explicacao.style.color = "var(--muted)";
    explicacao.style.lineHeight = "1.7";

    const rotulo = document.createElement("label");
    rotulo.textContent = "Formato da imagem";
    rotulo.htmlFor = "persona-share-format";
    rotulo.style.display = "block";
    rotulo.style.marginTop = "20px";

    const formato = document.createElement("select");
    formato.id = "persona-share-format";
    formato.style.display = "block";
    formato.style.width = "100%";
    formato.style.maxWidth = "340px";
    formato.style.padding = "12px";
    formato.style.marginTop = "8px";
    formato.style.background = "#171022";
    formato.style.color = "#f7f4ff";
    formato.style.border = "1px solid #65478b";
    [["completo", "Completo — cinco dimensões"],
      ["resumido", "Resumido — dois destaques"]].forEach(([valor, nome]) => {
      const opcao = document.createElement("option");
      opcao.value = valor;
      opcao.textContent = nome;
      formato.appendChild(opcao);
    });

    const visualizacao = document.createElement("div");
    visualizacao.style.maxWidth = "280px";
    visualizacao.style.marginTop = "22px";

    const acoes = document.createElement("div");
    acoes.style.display = "flex";
    acoes.style.flexWrap = "wrap";
    acoes.style.gap = "12px";
    acoes.style.marginTop = "20px";

    const baixar = document.createElement("button");
    baixar.type = "button";
    baixar.className = "secondary-button";
    baixar.textContent = "Baixar imagem";

    const compartilhar = document.createElement("button");
    compartilhar.type = "button";
    compartilhar.className = "secondary-button";
    compartilhar.textContent = "Compartilhar";

    const aviso = document.createElement("p");
    aviso.setAttribute("role", "status");
    aviso.setAttribute("aria-live", "polite");
    aviso.style.color = "var(--muted)";
    aviso.style.marginTop = "14px";
    aviso.textContent = "O perfil resumido destaca pontuações, não habilidades superiores.";

    let canvas;
    function atualizar() {
      try {
        canvas = gerador.gerar({ pontuacoes: resultado.pontuacoes, formato: formato.value });
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", formato.value === "completo"
          ? "Prévia do cartão com cinco dimensões."
          : "Prévia do cartão com duas dimensões em destaque.");
        visualizacao.replaceChildren(canvas);
        aviso.textContent = "Prévia gerada somente neste dispositivo.";
      } catch (erro) {
        canvas = null;
        visualizacao.replaceChildren();
        aviso.textContent = "Não foi possível gerar a imagem neste navegador.";
      }
      baixar.disabled = !canvas;
      compartilhar.disabled = !canvas;
    }

    async function executar(acao) {
      if (!canvas) return;
      baixar.disabled = true;
      compartilhar.disabled = true;
      try {
        const blob = await gerador.criarBlob(canvas);
        const nome = `persona-perfil-${formato.value}.png`;
        if (acao === "baixar") {
          gerador.baixar(blob, nome);
          aviso.textContent = "Imagem preparada para download.";
        } else {
          const disponivel = await gerador.compartilhar(blob, nome);
          if (!disponivel) {
            gerador.baixar(blob, nome);
            aviso.textContent = "Compartilhamento direto indisponível. A imagem foi preparada para download.";
          } else {
            aviso.textContent = "Compartilhamento solicitado ao dispositivo.";
          }
        }
      } catch (erro) {
        aviso.textContent = erro && erro.name === "AbortError"
          ? "Compartilhamento cancelado."
          : "Não foi possível concluir a ação. Tente novamente.";
      } finally {
        baixar.disabled = !canvas;
        compartilhar.disabled = !canvas;
      }
    }

    formato.addEventListener("change", atualizar);
    baixar.addEventListener("click", () => executar("baixar"));
    compartilhar.addEventListener("click", () => executar("compartilhar"));
    acoes.append(baixar, compartilhar);
    const conteudo = document.createElement("div");
    conteudo.append(explicacao, rotulo, formato, visualizacao, acoes, aviso);
    conteudo.style.paddingTop = "16px";
    painel.append(titulo, conteudo);
    secao.appendChild(painel);
    const jornada = document.querySelector(".result-journey-link");
    if (jornada) jornada.insertAdjacentElement("beforebegin", secao);
    else ancora.insertAdjacentElement("afterend", secao);
    // A prévia só é gerada quando o visitante decide abrir o painel.
    // Ao recolher, preservamos o canvas e o formato selecionado.
    painel.addEventListener("toggle", () => {
      if (painel.open && !canvas) atualizar();
    });
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
    // Mantém a compatibilidade com links antigos sem parâmetro.
    // O questionário atual utiliza resultado.html?versao=3.
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
  mostrarCompartilhamento(resultado);
})();
