/* PERSONA — Questionário experimental v3 (30 perguntas revisadas).
   Não é teste psicológico validado.
   Arquivo em preparação: não ativar em quiz.html antes da compatibilidade do resultado. */
(() => {
  "use strict";

  const VERSAO = 3;
  const CHAVE_RESULTADO = "persona_resultado_v3";
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
    { texto: "Quando estou com pessoas que ainda não conheço, costumo começar uma conversa.", dimensao: "social", invertida: false },
    { texto: "Quando começo a estudar um assunto, gosto de compreender a ideia geral antes de examinar seus detalhes.", dimensao: "cognitiva", invertida: false },
    { texto: "Quando preciso escolher entre opções com vantagens diferentes, prefiro compará-las usando critérios claros.", dimensao: "decisoria", invertida: false },
    { texto: "Antes de começar uma tarefa com várias etapas, prefiro definir a ordem em que vou realizá-las.", dimensao: "organizacional", invertida: false },
    { texto: "Quando algo inesperado acontece durante uma atividade, prefiro entender a situação antes de tomar uma atitude.", dimensao: "comportamental", invertida: false },
    { texto: "Ao entrar em um grupo que já está conversando, prefiro ouvir por um tempo antes de participar.", dimensao: "social", invertida: true },
    { texto: "Para entender um conceito novo, prefiro começar por um exemplo concreto de como ele funciona.", dimensao: "cognitiva", invertida: true },
    { texto: "Em decisões simples do cotidiano, costumo escolher a opção que me parece melhor logo de início.", dimensao: "decisoria", invertida: true },
    { texto: "Ao realizar uma atividade nova, prefiro decidir os próximos passos conforme avanço.", dimensao: "organizacional", invertida: true },
    { texto: "Quando surge um contratempo, costumo tentar uma solução logo de início.", dimensao: "comportamental", invertida: true },
    { texto: "Em atividades de grupo, costumo apresentar minhas ideias sem esperar que me convidem a falar.", dimensao: "social", invertida: false },
    { texto: "Quando observo situações diferentes, gosto de procurar ideias ou princípios que elas tenham em comum.", dimensao: "cognitiva", invertida: false },
    { texto: "Mesmo quando uma alternativa me agrada de imediato, prefiro examinar seus pontos contrários antes de decidir.", dimensao: "decisoria", invertida: false },
    { texto: "Quando tenho várias atividades durante a semana, gosto de organizar antecipadamente quando farei cada uma.", dimensao: "organizacional", invertida: false },
    { texto: "Ao receber uma observação inesperada durante uma conversa, costumo pensar por um momento antes de responder.", dimensao: "comportamental", invertida: false },
    { texto: "Quando quero conversar com alguém, geralmente espero que essa pessoa comece.", dimensao: "social", invertida: true },
    { texto: "Quando conheço uma teoria, minha primeira curiosidade costuma ser sobre como ela funciona na prática.", dimensao: "cognitiva", invertida: true },
    { texto: "Em situações que já vivi muitas vezes, costumo confiar na minha experiência para decidir sem comparar cada opção detalhadamente.", dimensao: "decisoria", invertida: true },
    { texto: "Nos meus momentos de lazer, prefiro deixar a programação aberta para decidir o que fazer na hora.", dimensao: "organizacional", invertida: true },
    { texto: "Quando alguém me faz uma pergunta de surpresa, costumo responder com a primeira ideia que me ocorre.", dimensao: "comportamental", invertida: true },
    { texto: "Quando uma conversa em grupo perde o ritmo, costumo sugerir um novo assunto.", dimensao: "social", invertida: false },
    { texto: "Gosto de explorar possibilidades hipotéticas, mesmo quando ainda não sei como poderiam ser aplicadas.", dimensao: "cognitiva", invertida: false },
    { texto: "Quando uma decisão envolve consequências futuras, gosto de comparar diferentes cenários antes de escolher.", dimensao: "decisoria", invertida: false },
    { texto: "Quando uma atividade exige materiais ou informações, prefiro deixá-los preparados antes de começar.", dimensao: "organizacional", invertida: false },
    { texto: "Quando percebo que um plano deixou de funcionar, prefiro parar por um instante antes de definir o próximo passo.", dimensao: "comportamental", invertida: false },
    { texto: "Em encontros sociais, prefiro que outras pessoas me incluam nas conversas em vez de me aproximar por iniciativa própria.", dimensao: "social", invertida: true },
    { texto: "Quando explico uma ideia a alguém, costumo recorrer primeiro a situações e exemplos do cotidiano.", dimensao: "cognitiva", invertida: true },
    { texto: "Ao avaliar duas opções parecidas, costumo dar mais peso à impressão geral que cada uma me transmite.", dimensao: "decisoria", invertida: true },
    { texto: "Em projetos pessoais, prefiro ter liberdade para modificar a ordem das etapas ao longo do caminho.", dimensao: "organizacional", invertida: true },
    { texto: "Em mudanças de última hora, costumo agir primeiro e ajustar minha resposta conforme a situação evolui.", dimensao: "comportamental", invertida: true }
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
    throw new Error("O banco de perguntas da versão 3 está incompleto.");
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
      window.location.assign("resultado.html?versao=3");
    } catch (error) {
      console.error("PERSONA: falha ao salvar o resultado.", error);
      mostrarErro("O navegador não permitiu salvar o resultado nesta sessão. Verifique as permissões de armazenamento e tente novamente.");
    }
  });

  mostrarPergunta();
})();
