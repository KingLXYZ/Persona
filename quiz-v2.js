/* PERSONA — Questionário experimental v2 (30 perguntas).
   Não é teste psicológico validado. */
(() => {
  "use strict";

  const VERSAO = 2;
  const CHAVE_RESULTADO = "persona_resultado_v2";
  const dimensoes = ["social", "cognitiva", "decisoria", "organizacional", "comportamental"];
  const alternativas = [
    "Discordo totalmente",
    "Discordo parcialmente",
    "Nem concordo nem discordo",
    "Concordo parcialmente",
    "Concordo totalmente"
  ];

  // false: concordância aproxima do polo direito; true: pontuação invertida.
  const perguntas = [
    { texto: "Em um grupo de pessoas desconhecidas, costumo tomar a iniciativa de conversar.", dimensao: "social", invertida: false },
    { texto: "Ao conhecer um assunto, gosto de imaginar possibilidades além do que foi apresentado.", dimensao: "cognitiva", invertida: false },
    { texto: "Antes de decidir entre alternativas, costumo estabelecer critérios para compará-las.", dimensao: "decisoria", invertida: false },
    { texto: "Antes de iniciar uma tarefa importante, prefiro definir as etapas que seguirei.", dimensao: "organizacional", invertida: false },
    { texto: "Quando algo inesperado acontece, costumo fazer uma pausa antes de responder.", dimensao: "comportamental", invertida: false },
    { texto: "Em encontros com pessoas novas, prefiro observar o ambiente antes de entrar nas conversas.", dimensao: "social", invertida: true },
    { texto: "Para entender um tema novo, prefiro começar por exemplos concretos e observáveis.", dimensao: "cognitiva", invertida: true },
    { texto: "Em escolhas cotidianas, geralmente confio na minha primeira impressão das opções.", dimensao: "decisoria", invertida: true },
    { texto: "Prefiro descobrir a sequência de uma atividade enquanto a realizo.", dimensao: "organizacional", invertida: true },
    { texto: "Diante de um imprevisto, minha primeira tendência é agir imediatamente.", dimensao: "comportamental", invertida: true },
    { texto: "Em atividades coletivas, geralmente tomo a iniciativa de interagir com outras pessoas.", dimensao: "social", invertida: false },
    { texto: "Gosto de discutir hipóteses mesmo antes de saber como poderiam ser aplicadas.", dimensao: "cognitiva", invertida: false },
    { texto: "Quando minha impressão inicial contradiz novas evidências, costumo reconsiderar minha escolha.", dimensao: "decisoria", invertida: false },
    { texto: "Mesmo sem cobranças externas, gosto de estabelecer prazos para minhas metas.", dimensao: "organizacional", invertida: false },
    { texto: "Ao receber uma crítica inesperada, procuro entender o que foi dito antes de responder.", dimensao: "comportamental", invertida: false },
    { texto: "Quando ninguém inicia uma conversa, geralmente prefiro aguardar.", dimensao: "social", invertida: true },
    { texto: "Ao aprender algo, minha primeira preocupação costuma ser entender sua aplicação prática.", dimensao: "cognitiva", invertida: true },
    { texto: "Quando duas opções parecem igualmente boas, prefiro seguir minha impressão geral a compará-las detalhadamente.", dimensao: "decisoria", invertida: true },
    { texto: "Em minhas atividades pessoais, prefiro manter a programação aberta a mudanças.", dimensao: "organizacional", invertida: true },
    { texto: "Em situações de pressão, costumo responder no momento e refletir sobre minha reação depois.", dimensao: "comportamental", invertida: true },
    { texto: "Ao participar de um grupo, costumo compartilhar minhas ideias espontaneamente.", dimensao: "social", invertida: false },
    { texto: "Quando penso em um problema, gosto de explorar diferentes cenários futuros.", dimensao: "cognitiva", invertida: false },
    { texto: "Quando existem várias opções, costumo comparar suas possíveis consequências antes de escolher.", dimensao: "decisoria", invertida: false },
    { texto: "Quando os planos mudam, gosto de reorganizar as próximas etapas.", dimensao: "organizacional", invertida: false },
    { texto: "Quando um plano falha, procuro avaliar as opções disponíveis antes de tomar uma atitude.", dimensao: "comportamental", invertida: false },
    { texto: "Em reuniões informais, normalmente prefiro participar depois que outras pessoas começam a conversar.", dimensao: "social", invertida: true },
    { texto: "Ao avaliar uma ideia, costumo concentrar minha atenção primeiro no que pode ser verificado no presente.", dimensao: "cognitiva", invertida: true },
    { texto: "Quando tenho várias opções razoáveis, costumo escolher a que inicialmente me parece melhor, sem fazer uma comparação extensa.", dimensao: "decisoria", invertida: true },
    { texto: "Quando tenho um dia livre, prefiro decidir minhas atividades conforme o momento.", dimensao: "organizacional", invertida: true },
    { texto: "Quando uma situação muda repentinamente, costumo expressar minha reação antes de pensar muito sobre ela.", dimensao: "comportamental", invertida: true }
  ];

  const perguntaEl = document.getElementById("quiz-question");
  const alternativasEl = document.getElementById("quiz-options");
  const contadorEl = document.getElementById("quiz-counter");
  const progressoEl = document.getElementById("quiz-progress-fill");
  const barraEl = document.querySelector(".quiz-progress");
  const instrucaoEl = document.querySelector(".quiz-instruction");
  const voltarEl = document.getElementById("quiz-back");
  const continuarEl = document.getElementById("quiz-next");

  const elementos = [perguntaEl, alternativasEl, contadorEl, progressoEl, barraEl, instrucaoEl, voltarEl, continuarEl];
  if (elementos.some(elemento => !elemento)) {
    console.error("PERSONA: elementos necessários não encontrados em quiz.html.");
    return;
  }

  const contagens = Object.fromEntries(dimensoes.map(d => [d, { total: 0, invertidas: 0 }]));
  perguntas.forEach(pergunta => {
    if (!contagens[pergunta.dimensao]) throw new Error("Dimensão desconhecida no questionário.");
    contagens[pergunta.dimensao].total++;
    if (pergunta.invertida) contagens[pergunta.dimensao].invertidas++;
  });
  if (perguntas.length !== 30 || dimensoes.some(d => contagens[d].total !== 6 || contagens[d].invertidas !== 3)) {
    throw new Error("O banco de perguntas da versão 2 está incompleto.");
  }

  let atual = 0;
  let respostas = Array(perguntas.length).fill(null);

  function atualizarProgresso() {
    const respondidas = respostas.filter(resposta => resposta !== null).length;
    const porcentagem = Math.round((respondidas / perguntas.length) * 100);
    progressoEl.style.width = `${porcentagem}%`;
    barraEl.setAttribute("aria-valuenow", String(porcentagem));
  }

  function selecionarResposta(valor) {
    respostas[atual] = valor;
    alternativasEl.querySelectorAll(".quiz-option").forEach((botao, indice) => {
      const marcado = indice + 1 === valor;
      botao.classList.toggle("selected", marcado);
      botao.setAttribute("aria-pressed", String(marcado));
    });
    continuarEl.disabled = false;
    atualizarProgresso();
  }

  function mostrarPergunta() {
    perguntaEl.textContent = perguntas[atual].texto;
    contadorEl.textContent = `Pergunta ${atual + 1} de ${perguntas.length}`;
    instrucaoEl.textContent = "Escolha a alternativa que mais se aproxima da sua maneira de pensar ou agir.";
    alternativasEl.replaceChildren();

    alternativas.forEach((texto, indice) => {
      const valor = indice + 1;
      const botao = document.createElement("button");
      const marcado = respostas[atual] === valor;
      botao.type = "button";
      botao.className = "quiz-option";
      botao.textContent = texto;
      botao.classList.toggle("selected", marcado);
      botao.setAttribute("aria-pressed", String(marcado));
      botao.addEventListener("click", () => selecionarResposta(valor));
      alternativasEl.appendChild(botao);
    });

    voltarEl.disabled = atual === 0;
    continuarEl.disabled = respostas[atual] === null;
    continuarEl.textContent = atual === perguntas.length - 1 ? "Concluir →" : "Continuar →";
    atualizarProgresso();
  }

  function calcularPontuacoes() {
    const totais = Object.fromEntries(dimensoes.map(d => [d, { soma: 0, quantidade: 0 }]));
    perguntas.forEach((pergunta, indice) => {
      const resposta = respostas[indice];
      const valor = pergunta.invertida ? 6 - resposta : resposta;
      totais[pergunta.dimensao].soma += valor;
      totais[pergunta.dimensao].quantidade++;
    });
    return Object.fromEntries(dimensoes.map(d => {
      const media = totais[d].soma / totais[d].quantidade;
      return [d, Math.round(((media - 1) / 4) * 100)];
    }));
  }

  function mostrarErro(mensagem) {
    contadorEl.textContent = "Não foi possível concluir";
    perguntaEl.textContent = "Não foi possível abrir seus resultados.";
    instrucaoEl.textContent = mensagem;
    alternativasEl.replaceChildren();
    voltarEl.disabled = false;
    voltarEl.textContent = "Rever respostas";
    continuarEl.disabled = true;
  }

  voltarEl.addEventListener("click", () => {
    if (atual > 0) atual--;
    mostrarPergunta();
  });

  continuarEl.addEventListener("click", () => {
    if (respostas[atual] === null) return;
    if (atual < perguntas.length - 1) {
      atual++;
      mostrarPergunta();
      return;
    }

    if (!respostas.every(resposta => resposta !== null)) {
      mostrarErro("Ainda existem perguntas sem resposta. Reabra o questionário para responder a todas.");
      return;
    }

    try {
      sessionStorage.setItem(CHAVE_RESULTADO, JSON.stringify({
        version: VERSAO,
        totalPerguntas: perguntas.length,
        scores: calcularPontuacoes()
      }));
      window.location.assign("resultado.html");
    } catch (error) {
      console.error("PERSONA: falha ao salvar o resultado.", error);
      mostrarErro("O navegador não permitiu salvar o resultado nesta sessão. Verifique as permissões de armazenamento e tente novamente.");
    }
  });

  mostrarPergunta();
})();
