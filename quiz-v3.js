
/* PERSONA — Questionário experimental (30 perguntas).
   Não é teste psicológico validado.
   Ativo em quiz.html.
   Preserva o progresso durante a sessão do navegador.
   Envia os resultados para resultado.html.
*/
(() => {
  "use strict";

  const VERSAO = 3;
  // Revisão metodológica interna, independente da versão de armazenamento.
  const REVISAO_INSTRUMENTO = 2;
  const CHAVE_RESULTADO = "persona_resultado_v3";
  const CHAVE_PROGRESSO = "persona_progresso_v3";

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

  // Mostra uma mensagem visível se um dos módulos não tiver carregado.
  if (!window.PersonaQuizDados ||
      !window.PersonaQuizPontuacao ||
      typeof window.PersonaQuizPontuacao.calcularPontuacoes !== "function" ||
      !window.PersonaQuizProgresso ||
      typeof window.PersonaQuizProgresso.criar !== "function" ||
      !window.PersonaQuizInterface ||
      typeof window.PersonaQuizInterface.criar !== "function") {
    contadorEl.textContent = "Questionário indisponível";
    perguntaEl.textContent = "Não foi possível carregar o questionário.";
    instrucaoEl.textContent = "Alguns arquivos necessários não foram carregados. Atualize a página ou tente novamente mais tarde.";
    continuarEl.disabled = true;
    console.error("PERSONA: módulos necessários ausentes ou incompletos.");
    return;
  }

  const { dimensoes, alternativas, perguntas } = window.PersonaQuizDados;
  if (!Array.isArray(perguntas) || !Array.isArray(dimensoes) || !Array.isArray(alternativas)) {
    contadorEl.textContent = "Questionário indisponível";
    perguntaEl.textContent = "Não foi possível carregar o questionário.";
    instrucaoEl.textContent = "Os dados do questionário estão incompletos. Tente novamente mais tarde.";
    console.error("PERSONA: estrutura dos dados não reconhecida.");
    return;
  }

  let atual = 0;
  let respostas = Object.fromEntries(perguntas.map(pergunta => [pergunta.id, null]));
  let ordem = perguntas.map(pergunta => pergunta.id);
  const perguntasPorId = new Map(perguntas.map(pergunta => [pergunta.id, pergunta]));
  const revisoesPerguntas = Object.fromEntries(
    perguntas.map(pergunta => [pergunta.id, pergunta.revisao])
  );

  // Sorteia a ordem evitando perguntas da mesma dimensão em sequência.
  function sortearOrdem() {
    const restantes = perguntas.slice();
    const sorteadas = [];

    while (restantes.length) {
      const anterior = sorteadas.length
        ? perguntasPorId.get(sorteadas[sorteadas.length - 1]).dimensao
        : null;
      const candidatas = restantes.filter(pergunta =>
        pergunta.dimensao !== anterior
      );
      const opcoes = candidatas.length ? candidatas : restantes;
      const escolhida = opcoes[Math.floor(Math.random() * opcoes.length)];
      sorteadas.push(escolhida.id);
      restantes.splice(restantes.indexOf(escolhida), 1);
    }

    return sorteadas;
  }

  function perguntaAtual() {
    return perguntasPorId.get(ordem[atual]);
  }

  function primeiraPendente() {
    return ordem.findIndex(id => respostas[id] === null);
  }
  let erroAtivo = false;
  let armazenamentoDisponivel = true;
  let progressoRestaurado = false;
  let progressoIncompativel = false;
  let avisoMigracao = "";

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
        typeof pergunta.invertida !== "boolean" ||
        !Number.isInteger(pergunta.revisao) ||
        pergunta.revisao < 1
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

  // A propriedade sessionStorage pode lançar SecurityError antes de qualquer operação.
  let armazenamentoSessao;
  try {
    armazenamentoSessao = window.sessionStorage;
  } catch (erro) {
    console.warn("PERSONA: acesso ao armazenamento de sessão bloqueado.", erro);
    mostrarErro("O navegador bloqueou o armazenamento necessário para continuar e salvar o resultado. Verifique as permissões do site e atualize a página.", false);
    return;
  }

  const controleProgresso = window.PersonaQuizProgresso.criar({
    perguntas, perguntasPorId, revisoesPerguntas,
    versao: VERSAO, revisaoInstrumento: REVISAO_INSTRUMENTO,
    chaveProgresso: CHAVE_PROGRESSO, armazenamento: armazenamentoSessao,
    obterEstado: () => ({ atual, ordem, respostas, armazenamentoDisponivel }),
    atualizarEstado: alteracoes => {
      if (Object.hasOwn(alteracoes, "atual")) atual = alteracoes.atual;
      if (Object.hasOwn(alteracoes, "ordem")) ordem = alteracoes.ordem;
      if (Object.hasOwn(alteracoes, "respostas")) respostas = alteracoes.respostas;
      if (Object.hasOwn(alteracoes, "armazenamentoDisponivel")) armazenamentoDisponivel = alteracoes.armazenamentoDisponivel;
      if (Object.hasOwn(alteracoes, "progressoRestaurado")) progressoRestaurado = alteracoes.progressoRestaurado;
      if (Object.hasOwn(alteracoes, "progressoIncompativel")) progressoIncompativel = alteracoes.progressoIncompativel;
      if (Object.hasOwn(alteracoes, "avisoMigracao")) avisoMigracao = alteracoes.avisoMigracao;
    }
  });
  const { salvarProgresso, restaurarProgresso } = controleProgresso;

  const interfaceQuiz = window.PersonaQuizInterface.criar({
    perguntaEl, alternativasEl, progressoEl, barraEl
  });

  function atualizarProgresso() {
    const respondidas = Object.values(respostas).filter(resposta => resposta !== null).length;
    interfaceQuiz.atualizarProgresso(respondidas, perguntas.length);
  }

  function atualizarRadios() {
    interfaceQuiz.atualizarRadios(respostas[perguntaAtual().id]);
  }

  function selecionarResposta(valor) {
    respostas[perguntaAtual().id] = valor;

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

    perguntaEl.textContent = perguntaAtual().texto;

    contadorEl.textContent =
      `Pergunta ${atual + 1} de ${perguntas.length}`;

    instrucaoEl.textContent =
      "Escolha a alternativa que mais se aproxima da sua maneira de pensar ou agir." +
      (avisoMigracao ? " " + avisoMigracao : "");

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

    continuarEl.disabled = respostas[perguntaAtual().id] === null;

    continuarEl.textContent =
      atual === perguntas.length - 1
        ? "Concluir →"
        : "Continuar →";

    atualizarProgresso();

    if (moverFoco) {
      perguntaEl.focus();
    }
  }

  // Retorna à primeira pergunta sem resposta.
  function reverRespostas() {
    const pendente = primeiraPendente();

    if (pendente !== -1) {
      atual = pendente;
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

  const reiniciarEl = document.getElementById("quiz-restart");
  if (reiniciarEl) {
    reiniciarEl.addEventListener("click", () => {
      if (!window.confirm(
        "Começar de novo? As respostas desta tentativa serão apagadas. Os resultados já salvos em Minha Jornada não serão afetados."
      )) return;

      try {
        armazenamentoSessao.removeItem(CHAVE_PROGRESSO);
        window.location.reload();
      } catch (erro) {
        console.error("PERSONA: não foi possível reiniciar a tentativa.", erro);
        instrucaoEl.textContent =
          "Não foi possível apagar a tentativa. Verifique as permissões de armazenamento do navegador.";
      }
    });
  }

  continuarEl.addEventListener("click", () => {
    if (respostas[perguntaAtual().id] === null) return;

    if (atual < perguntas.length - 1) {
      atual++;
      mostrarPergunta(true);
      salvarProgresso();
      return;
    }

    const pendente = primeiraPendente();

    if (pendente !== -1) {
      atual = pendente;
      mostrarPergunta(true);
      salvarProgresso();
      return;
    }

    try {
      const resultado = {
        version: VERSAO,
        totalPerguntas: perguntas.length,
        scores: window.PersonaQuizPontuacao.calcularPontuacoes(dimensoes, perguntas, respostas)
      };

      armazenamentoSessao.setItem(
        CHAVE_RESULTADO,
        JSON.stringify(resultado)
      );

      // O resultado foi salvo; o progresso já
      // não é necessário para esta conclusão.
      try {
        armazenamentoSessao.removeItem(CHAVE_PROGRESSO);
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
    if (progressoIncompativel) {
      mostrarErro(
        "Existe uma tentativa salva incompatível com esta revisão do questionário. Seus dados foram preservados neste navegador e não serão substituídos automaticamente.",
        false
      );
      if (reiniciarEl) reiniciarEl.hidden = false;
    } else {
      // Somente uma tentativa sem progresso anterior recebe novo sorteio.
      if (!progressoRestaurado) {
        ordem = sortearOrdem();
        salvarProgresso();
      }
      mostrarPergunta();
    }

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
