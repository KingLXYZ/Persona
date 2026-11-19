
/* PERSONA — Questionário experimental (30 perguntas).
   Não é teste psicológico validado.
   Ativo em quiz.html.
   Preserva o progresso durante a sessão do navegador.
   Envia os resultados para resultado.html.
*/
(() => {
  "use strict";

  const VERSAO = 3;
  const CHAVE_RESULTADO = "persona_resultado_v3";
  const CHAVE_PROGRESSO = "persona_progresso_v3";

  const dimensoes = [
    "social",
    "cognitiva",
    "decisoria",
    "organizacional",
    "comportamental"
  ];

  const alternativas = [
    "Discordo totalmente",
    "Discordo parcialmente",
    "Nem concordo nem discordo",
    "Concordo parcialmente",
    "Concordo totalmente"
  ];

  // A pontuação invertida mantém os polos das dimensões.
  const perguntas = [
    {
      id: "SOC-001",
      texto: "Quando estou com pessoas que ainda não conheço, costumo começar uma conversa.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-001",
      texto: "Quando começo a estudar um assunto, gosto de compreender a ideia geral antes de examinar seus detalhes.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-001",
      texto: "Quando preciso escolher entre opções com vantagens diferentes, prefiro compará-las usando critérios claros.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-001",
      texto: "Antes de começar uma tarefa com várias etapas, prefiro definir a ordem em que vou realizá-las.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-001",
      texto: "Quando algo inesperado acontece durante uma atividade, prefiro entender a situação antes de tomar uma atitude.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-002",
      texto: "Ao entrar em um grupo que já está conversando, prefiro ouvir por um tempo antes de participar.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-002",
      texto: "Para entender um conceito novo, prefiro começar por um exemplo concreto de como ele funciona.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-002",
      texto: "Em decisões simples do cotidiano, costumo escolher a opção que me parece melhor logo de início.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-002",
      texto: "Ao realizar uma atividade nova, prefiro decidir os próximos passos conforme avanço.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-002",
      texto: "Quando surge um contratempo, costumo tentar uma solução logo de início.",
      dimensao: "comportamental",
      invertida: true
    },
    {
      id: "SOC-003",
      texto: "Em atividades de grupo, costumo apresentar minhas ideias sem esperar que me convidem a falar.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-003",
      texto: "Quando observo situações diferentes, gosto de procurar ideias ou princípios que elas tenham em comum.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-003",
      texto: "Mesmo quando uma alternativa me agrada de imediato, prefiro examinar seus pontos contrários antes de decidir.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-003",
      texto: "Quando tenho várias atividades durante a semana, gosto de organizar antecipadamente quando farei cada uma.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-003",
      texto: "Ao receber uma observação inesperada durante uma conversa, costumo pensar por um momento antes de responder.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-004",
      texto: "Quando quero conversar com alguém, geralmente espero que essa pessoa comece.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-004",
      texto: "Quando conheço uma teoria, minha primeira curiosidade costuma ser sobre como ela funciona na prática.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-004",
      texto: "Em situações que já vivi muitas vezes, costumo confiar na minha experiência para decidir sem comparar cada opção detalhadamente.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-004",
      texto: "Nos meus momentos de lazer, prefiro deixar a programação aberta para decidir o que fazer na hora.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-004",
      texto: "Quando alguém me faz uma pergunta de surpresa, costumo responder com a primeira ideia que me ocorre.",
      dimensao: "comportamental",
      invertida: true
    },
    {
      id: "SOC-005",
      texto: "Quando uma conversa em grupo perde o ritmo, costumo sugerir um novo assunto.",
      dimensao: "social",
      invertida: false
    },
    {
      id: "COG-005",
      texto: "Gosto de explorar possibilidades hipotéticas, mesmo quando ainda não sei como poderiam ser aplicadas.",
      dimensao: "cognitiva",
      invertida: false
    },
    {
      id: "DEC-005",
      texto: "Quando uma decisão envolve consequências futuras, gosto de comparar diferentes cenários antes de escolher.",
      dimensao: "decisoria",
      invertida: false
    },
    {
      id: "ORG-005",
      texto: "Quando uma atividade exige materiais ou informações, prefiro deixá-los preparados antes de começar.",
      dimensao: "organizacional",
      invertida: false
    },
    {
      id: "COM-005",
      texto: "Quando percebo que um plano deixou de funcionar, prefiro parar por um instante antes de definir o próximo passo.",
      dimensao: "comportamental",
      invertida: false
    },
    {
      id: "SOC-006",
      texto: "Em encontros sociais, prefiro que outras pessoas me incluam nas conversas em vez de me aproximar por iniciativa própria.",
      dimensao: "social",
      invertida: true
    },
    {
      id: "COG-006",
      texto: "Quando explico uma ideia a alguém, costumo recorrer primeiro a situações e exemplos do cotidiano.",
      dimensao: "cognitiva",
      invertida: true
    },
    {
      id: "DEC-006",
      texto: "Ao avaliar duas opções parecidas, costumo dar mais peso à impressão geral que cada uma me transmite.",
      dimensao: "decisoria",
      invertida: true
    },
    {
      id: "ORG-006",
      texto: "Em projetos pessoais, prefiro ter liberdade para modificar a ordem das etapas ao longo do caminho.",
      dimensao: "organizacional",
      invertida: true
    },
    {
      id: "COM-006",
      texto: "Em mudanças de última hora, costumo agir primeiro e ajustar minha resposta conforme a situação evolui.",
      dimensao: "comportamental",
      invertida: true
    }
  ];

  // Elementos da interface.
  const perguntaEl = document.getElementById("quiz-question");
  const alternativasEl = document.getElementById("quiz-options");
  const contadorEl = document.getElementById("quiz-counter");
  const progressoEl = document.getElementById("quiz-progress-fill");
  const barraEl = document.querySelector(".quiz-progress");
  const instrucaoEl = document.querySelector(".quiz-instruction");
  const voltarEl = document.getElementById("quiz-back");
  const continuarEl = document.getElementById("quiz-next");

  const elementos = [
    perguntaEl,
    alternativasEl,
    contadorEl,
    progressoEl,
    barraEl,
    instrucaoEl,
    voltarEl,
    continuarEl
  ];

  if (elementos.some(elemento => !elemento)) {
    console.error(
      "PERSONA: elementos necessários não encontrados em quiz.html."
    );
    return;
  }

  let atual = 0;
  let respostas = Object.fromEntries(perguntas.map(pergunta => [pergunta.id, null]));
  let erroAtivo = false;
  let armazenamentoDisponivel = true;

  // Acessibilidade das alternativas.
  alternativasEl.setAttribute("role", "radiogroup");
  alternativasEl.setAttribute("aria-labelledby", perguntaEl.id);
  perguntaEl.setAttribute("tabindex", "-1");

  function mostrarErro(mensagem, recuperavel = true) {
    erroAtivo = true;

    contadorEl.textContent = "Não foi possível continuar";
    perguntaEl.textContent = "Encontramos um problema.";
    instrucaoEl.textContent = mensagem;

    alternativasEl.replaceChildren();

    voltarEl.textContent = recuperavel
      ? "Rever respostas"
      : "Indisponível";

    voltarEl.disabled = !recuperavel;
    continuarEl.disabled = true;

    perguntaEl.focus();
  }

  // Verifica a estrutura antes de iniciar.
  function validarQuestionario() {
    const contagens = Object.fromEntries(
      dimensoes.map(d => [
        d,
        { total: 0, invertidas: 0 }
      ])
    );

    if (perguntas.length !== 30) {
      throw new Error("Quantidade incorreta de perguntas.");
    }

    const ids = new Set();

    perguntas.forEach(pergunta => {
      if (
        typeof pergunta.id !== "string" ||
        !/^(SOC|COG|DEC|ORG|COM)-\d{3}$/.test(pergunta.id) ||
        ids.has(pergunta.id)
      ) {
        throw new Error("Identificador de pergunta inválido ou duplicado.");
      }

      ids.add(pergunta.id);

      if (!Object.hasOwn(contagens, pergunta.dimensao)) {
        throw new Error("Dimensão desconhecida.");
      }

      if (
        typeof pergunta.texto !== "string" ||
        !pergunta.texto.trim() ||
        typeof pergunta.invertida !== "boolean"
      ) {
        throw new Error("Pergunta inválida.");
      }

      contagens[pergunta.dimensao].total++;

      if (pergunta.invertida) {
        contagens[pergunta.dimensao].invertidas++;
      }
    });

    const estruturaInvalida = dimensoes.some(d => {
      return (
        contagens[d].total !== 6 ||
        contagens[d].invertidas !== 3
      );
    });

    if (estruturaInvalida) {
      throw new Error(
        "Distribuição incorreta das dimensões."
      );
    }
  }

  // Salva as respostas durante a sessão.
  function salvarProgresso() {
    if (!armazenamentoDisponivel) return false;

    try {
      sessionStorage.setItem(
        CHAVE_PROGRESSO,
        JSON.stringify({
          version: VERSAO,
          totalPerguntas: perguntas.length,
          atual,
          respostas
        })
      );

      return true;
    } catch (erro) {
      armazenamentoDisponivel = false;

      console.warn(
        "PERSONA: não foi possível salvar o progresso.",
        erro
      );

      return false;
    }
  }

  // Recupera somente dados compatíveis.
  function restaurarProgresso() {
    let bruto;

    try {
      bruto = sessionStorage.getItem(CHAVE_PROGRESSO);
    } catch (erro) {
      armazenamentoDisponivel = false;
      console.warn(
        "PERSONA: armazenamento indisponível.",
        erro
      );
      return;
    }

    if (!bruto) return;

    try {
      const dados = JSON.parse(bruto);

      const versaoValida = dados.version === VERSAO;

      const ids = perguntas.map(pergunta => pergunta.id);
      const formatoAntigo = Array.isArray(dados.respostas);
      const tamanhoValido =
        dados.totalPerguntas === perguntas.length &&
        (formatoAntigo
          ? dados.respostas.length === perguntas.length
          : dados.respostas !== null &&
            typeof dados.respostas === "object" &&
            !Array.isArray(dados.respostas) &&
            Object.keys(dados.respostas).length === perguntas.length &&
            ids.every(id => Object.hasOwn(dados.respostas, id)));

      const valores = tamanhoValido
        ? (formatoAntigo ? dados.respostas : ids.map(id => dados.respostas[id]))
        : [];

      const respostasValidas =
        tamanhoValido &&
        valores.every(resposta => (
          resposta === null ||
          (
            Number.isInteger(resposta) &&
            resposta >= 1 &&
            resposta <= 5
          )
        ));

      const indiceValido =
        Number.isInteger(dados.atual) &&
        dados.atual >= 0 &&
        dados.atual < perguntas.length;

      if (
        !versaoValida ||
        !tamanhoValido ||
        !respostasValidas ||
        !indiceValido
      ) {
        throw new Error("Progresso incompatível.");
      }

      // Converte o progresso antigo por posição para o formato por ID.
      respostas = Object.fromEntries(
        ids.map((id, indice) => [id, valores[indice]])
      );
      atual = dados.atual;

    } catch (erro) {
      console.warn(
        "PERSONA: progresso anterior ignorado.",
        erro
      );

      try {
        sessionStorage.removeItem(CHAVE_PROGRESSO);
      } catch {
        armazenamentoDisponivel = false;
      }
    }
  }

  function atualizarProgresso() {
    const respondidas = Object.values(respostas).filter(
      resposta => resposta !== null
    ).length;

    const porcentagem = Math.round(
      (respondidas / perguntas.length) * 100
    );

    progressoEl.style.width = `${porcentagem}%`;

    barraEl.setAttribute(
      "aria-valuenow",
      String(porcentagem)
    );
  }

  // Mantém a seleção acessível pelo teclado.
  function atualizarRadios() {
    const selecionado = respostas[perguntas[atual].id];

    alternativasEl
      .querySelectorAll(".quiz-option")
      .forEach((botao, indice) => {
        const marcado = indice + 1 === selecionado;

        botao.classList.toggle("selected", marcado);
        botao.setAttribute(
          "aria-checked",
          String(marcado)
        );

        const entraNoTab = selecionado === null
          ? indice === 0
          : marcado;

        botao.tabIndex = entraNoTab ? 0 : -1;
      });
  }

  function selecionarResposta(valor) {
    respostas[perguntas[atual].id] = valor;

    atualizarRadios();
    continuarEl.disabled = false;
    atualizarProgresso();

    salvarProgresso();
  }

  const TECLAS_NAVEGACAO = {
    ArrowRight: 1,
    ArrowDown: 1,
    ArrowLeft: -1,
    ArrowUp: -1
  };

  function mostrarPergunta(moverFoco = false) {
    erroAtivo = false;

    perguntaEl.textContent = perguntas[atual].texto;

    contadorEl.textContent =
      `Pergunta ${atual + 1} de ${perguntas.length}`;

    instrucaoEl.textContent =
      "Escolha a alternativa que mais se aproxima da sua maneira de pensar ou agir.";

    alternativasEl.replaceChildren();

    alternativas.forEach((texto, indice) => {
      const valor = indice + 1;

      const botao = document.createElement("button");

      botao.type = "button";
      botao.className = "quiz-option";
      botao.setAttribute("role", "radio");
      botao.textContent = texto;

      botao.addEventListener("click", () => {
        selecionarResposta(valor);
      });

      botao.addEventListener("keydown", evento => {
        const passo = TECLAS_NAVEGACAO[evento.key];

        if (!passo) return;

        evento.preventDefault();

        const novoIndice =
          (indice + passo + alternativas.length) %
          alternativas.length;

        selecionarResposta(novoIndice + 1);

        alternativasEl.children[novoIndice].focus();
      });

      alternativasEl.appendChild(botao);
    });

    atualizarRadios();

    // Restaura o texto após uma tela de erro.
    voltarEl.textContent = "Voltar";
    voltarEl.disabled = atual === 0;

    continuarEl.disabled = respostas[perguntas[atual].id] === null;

    continuarEl.textContent =
      atual === perguntas.length - 1
        ? "Concluir →"
        : "Continuar →";

    atualizarProgresso();

    if (moverFoco) {
      perguntaEl.focus();
    }
  }

  function calcularPontuacoes() {
    const totais = Object.fromEntries(
      dimensoes.map(d => [
        d,
        { soma: 0, quantidade: 0 }
      ])
    );

    perguntas.forEach((pergunta, indice) => {
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

  // Retorna à primeira pergunta sem resposta.
  function reverRespostas() {
    const primeiraPendente = perguntas.findIndex(
      pergunta => respostas[pergunta.id] === null
    );

    if (primeiraPendente !== -1) {
      atual = primeiraPendente;
    }

    mostrarPergunta(true);
    salvarProgresso();
  }

  voltarEl.addEventListener("click", () => {
    if (erroAtivo) {
      reverRespostas();
      return;
    }

    if (atual > 0) {
      atual--;
    }

    mostrarPergunta(true);
    salvarProgresso();
  });

  continuarEl.addEventListener("click", () => {
    if (respostas[perguntas[atual].id] === null) return;

    if (atual < perguntas.length - 1) {
      atual++;
      mostrarPergunta(true);
      salvarProgresso();
      return;
    }

    const primeiraPendente = perguntas.findIndex(
      pergunta => respostas[pergunta.id] === null
    );

    if (primeiraPendente !== -1) {
      atual = primeiraPendente;
      mostrarPergunta(true);
      salvarProgresso();
      return;
    }

    try {
      const resultado = {
        version: VERSAO,
        totalPerguntas: perguntas.length,
        scores: calcularPontuacoes()
      };

      sessionStorage.setItem(
        CHAVE_RESULTADO,
        JSON.stringify(resultado)
      );

      // O resultado foi salvo; o progresso já
      // não é necessário para esta conclusão.
      try {
        sessionStorage.removeItem(CHAVE_PROGRESSO);
      } catch (erro) {
        console.warn(
          "PERSONA: não foi possível limpar o progresso.",
          erro
        );
      }

      window.location.assign(
        "resultado.html?versao=3"
      );

    } catch (erro) {
      console.error(
        "PERSONA: falha ao concluir questionário.",
        erro
      );

      mostrarErro(
        "Não foi possível salvar o resultado. Verifique as permissões de armazenamento do navegador e tente novamente."
      );
    }
  });

  // Inicialização protegida contra erros.
  try {
    validarQuestionario();
    restaurarProgresso();
    mostrarPergunta();

  } catch (erro) {
    console.error(
      "PERSONA: falha na inicialização.",
      erro
    );

    mostrarErro(
      "O questionário está temporariamente indisponível. Tente novamente mais tarde.",
      false
    );
  }
})();
