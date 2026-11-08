
/* =========================================
   PERSONA — QUESTIONÁRIO EXPERIMENTAL
   Versão 2: 30 afirmações, 5 dimensões
========================================= */

const QUIZ_VERSION = 2;
const RESULT_KEY = "persona_resultado_v2";

const dimensions = {
    social: "Social",
    cognitiva: "Cognitiva",
    decisoria: "Decisória",
    organizacional: "Organizacional",
    comportamental: "Comportamental"
};

const answerOptions = [
    "Discordo totalmente",
    "Discordo parcialmente",
    "Nem concordo nem discordo",
    "Concordo parcialmente",
    "Concordo totalmente"
];

// "invertida: true" inverte a pontuação (1 ↔ 5, 2 ↔ 4).
// As perguntas são originais e ainda não foram validadas cientificamente.

const questions = [
    {
        texto: "Em um grupo de pessoas desconhecidas, costumo tomar a iniciativa de conversar.",
        dimensao: "social",
        invertida: false
    },
    {
        texto: "Ao conhecer um assunto, gosto de imaginar possibilidades além do que foi apresentado.",
        dimensao: "cognitiva",
        invertida: false
    },
    {
        texto: "Antes de decidir entre alternativas, costumo estabelecer critérios para compará-las.",
        dimensao: "decisoria",
        invertida: false
    },
    {
        texto: "Antes de iniciar uma tarefa importante, prefiro definir as etapas que seguirei.",
        dimensao: "organizacional",
        invertida: false
    },
    {
        texto: "Quando algo inesperado acontece, costumo fazer uma pausa antes de responder.",
        dimensao: "comportamental",
        invertida: false
    },
    {
        texto: "Em encontros com pessoas novas, prefiro observar o ambiente antes de entrar nas conversas.",
        dimensao: "social",
        invertida: true
    },
    {
        texto: "Para entender um tema novo, prefiro começar por exemplos concretos e observáveis.",
        dimensao: "cognitiva",
        invertida: true
    },
    {
        texto: "Em escolhas cotidianas, geralmente confio na minha primeira impressão das opções.",
        dimensao: "decisoria",
        invertida: true
    },
    {
        texto: "Prefiro descobrir a sequência de uma atividade enquanto a realizo.",
        dimensao: "organizacional",
        invertida: true
    },
    {
        texto: "Diante de um imprevisto, minha primeira tendência é agir imediatamente.",
        dimensao: "comportamental",
        invertida: true
    },
    {
        texto: "Em atividades coletivas, geralmente tomo a iniciativa de interagir com outras pessoas.",
        dimensao: "social",
        invertida: false
    },
    {
        texto: "Gosto de discutir hipóteses mesmo antes de saber como poderiam ser aplicadas.",
        dimensao: "cognitiva",
        invertida: false
    },
    {
        texto: "Quando minha impressão inicial contradiz novas evidências, costumo reconsiderar minha escolha.",
        dimensao: "decisoria",
        invertida: false
    },
    {
        texto: "Mesmo sem cobranças externas, gosto de estabelecer prazos para minhas metas.",
        dimensao: "organizacional",
        invertida: false
    },
    {
        texto: "Ao receber uma crítica inesperada, procuro entender o que foi dito antes de responder.",
        dimensao: "comportamental",
        invertida: false
    },
    {
        texto: "Quando ninguém inicia uma conversa, geralmente prefiro aguardar.",
        dimensao: "social",
        invertida: true
    },
    {
        texto: "Ao aprender algo, minha primeira preocupação costuma ser entender sua aplicação prática.",
        dimensao: "cognitiva",
        invertida: true
    },
    {
        texto: "Quando duas opções parecem igualmente boas, prefiro seguir minha impressão geral a compará-las detalhadamente.",
        dimensao: "decisoria",
        invertida: true
    },
    {
        texto: "Em minhas atividades pessoais, prefiro manter a programação aberta a mudanças.",
        dimensao: "organizacional",
        invertida: true
    },
    {
        texto: "Em situações de pressão, costumo responder no momento e refletir sobre minha reação depois.",
        dimensao: "comportamental",
        invertida: true
    },
    {
        texto: "Ao participar de um grupo, costumo compartilhar minhas ideias espontaneamente.",
        dimensao: "social",
        invertida: false
    },
    {
        texto: "Quando penso em um problema, gosto de explorar diferentes cenários futuros.",
        dimensao: "cognitiva",
        invertida: false
    },
    {
        texto: "Quando existem várias opções, costumo comparar suas possíveis consequências antes de escolher.",
        dimensao: "decisoria",
        invertida: false
    },
    {
        texto: "Quando os planos mudam, gosto de reorganizar as próximas etapas.",
        dimensao: "organizacional",
        invertida: false
    },
    {
        texto: "Quando um plano falha, procuro avaliar as opções disponíveis antes de tomar uma atitude.",
        dimensao: "comportamental",
        invertida: false
    },
    {
        texto: "Em reuniões informais, normalmente prefiro participar depois que outras pessoas começam a conversar.",
        dimensao: "social",
        invertida: true
    },
    {
        texto: "Ao avaliar uma ideia, costumo concentrar minha atenção primeiro no que pode ser verificado no presente.",
        dimensao: "cognitiva",
        invertida: true
    },
    {
        texto: "Quando tenho várias opções razoáveis, costumo escolher a que inicialmente me parece melhor, sem fazer uma comparação extensa.",
        dimensao: "decisoria",
        invertida: true
    },
    {
        texto: "Quando tenho um dia livre, prefiro decidir minhas atividades conforme o momento.",
        dimensao: "organizacional",
        invertida: true
    },
    {
        texto: "Quando uma situação muda repentinamente, costumo expressar minha reação antes de pensar muito sobre ela.",
        dimensao: "comportamental",
        invertida: true
    }
];

/* =========================================
   ELEMENTOS DO HTML EXISTENTE
========================================= */

const questionElement =
    document.getElementById("quiz-question");

const optionsElement =
    document.getElementById("quiz-options");

const counterElement =
    document.getElementById("quiz-counter");

const progressElement =
    document.getElementById("quiz-progress-fill");

const progressContainer =
    document.querySelector(".quiz-progress");

const instructionElement =
    document.querySelector(".quiz-instruction");

const backButton =
    document.getElementById("quiz-back");

const nextButton =
    document.getElementById("quiz-next");

let currentQuestion = 0;

let answers = Array(questions.length).fill(null);

let quizFinished = false;

/* =========================================
   MOSTRAR PERGUNTA
========================================= */

function showQuestion() {

    if (quizFinished) {
        showCompletion();
        return;
    }

    const current = questions[currentQuestion];

    questionElement.textContent = current.texto;

    counterElement.textContent =
        `Pergunta ${currentQuestion + 1} de ${questions.length}`;

    instructionElement.textContent =
        "Escolha a alternativa que mais se aproxima da sua maneira de pensar ou agir.";

    optionsElement.style.display = "";
    optionsElement.replaceChildren();

    answerOptions.forEach((label, index) => {

        const answerValue = index + 1;
        const button = document.createElement("button");

        const selected =
            answers[currentQuestion] === answerValue;

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = label;

        button.classList.toggle("selected", selected);

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

        button.addEventListener("click", () => {
            selectAnswer(answerValue);
        });

        optionsElement.appendChild(button);
    });

    backButton.disabled = currentQuestion === 0;
    backButton.textContent = "Voltar";

    nextButton.disabled =
        answers[currentQuestion] === null;

    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "Concluir →"
            : "Continuar →";

    updateProgress();
}

/* =========================================
   SELECIONAR RESPOSTA
========================================= */

function selectAnswer(value) {

    answers[currentQuestion] = value;

    optionsElement.querySelectorAll(".quiz-option")
        .forEach((button, index) => {

            const selected = index + 1 === value;

            button.classList.toggle(
                "selected",
                selected
            );

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });

    nextButton.disabled = false;

    updateProgress();
}

/* =========================================
   ATUALIZAR PROGRESSO
========================================= */

function updateProgress() {

    const answeredCount =
        answers.filter(answer => answer !== null).length;

    const percentage = quizFinished
        ? 100
        : Math.round(
            (answeredCount / questions.length) * 100
        );

    progressElement.style.width = `${percentage}%`;

    progressContainer.setAttribute(
        "aria-valuenow",
        String(percentage)
    );
}

/* =========================================
   CALCULAR PONTUAÇÕES
========================================= */

// Cada resposta vale de 1 a 5.
// Perguntas invertidas usam: 6 - resposta.
// A média é normalizada para 0–100.

function calculateScores() {

    const totals = {};
    const scores = {};

    Object.keys(dimensions).forEach(dimension => {

        totals[dimension] = {
            soma: 0,
            quantidade: 0
        };

    });

    questions.forEach((question, index) => {

        const answer = answers[index];

        const value = question.invertida
            ? 6 - answer
            : answer;

        totals[question.dimensao].soma += value;

        totals[question.dimensao].quantidade++;

    });

    Object.keys(dimensions).forEach(dimension => {

        const total = totals[dimension];

        const average =
            total.soma / total.quantidade;

        scores[dimension] =
            Math.round(((average - 1) / 4) * 100);

    });

    return scores;
}

/* =========================================
   AVANÇAR E CONCLUIR
========================================= */

nextButton.addEventListener("click", () => {

    if (quizFinished) {
        restartQuiz();
        return;
    }

    if (answers[currentQuestion] === null) {
        return;
    }

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;
        showQuestion();
        return;

    }

    if (!answers.every(answer => answer !== null)) {
        return;
    }

    const scores = calculateScores();

    try {

        sessionStorage.setItem(
            RESULT_KEY,
            JSON.stringify({
                version: QUIZ_VERSION,
                totalPerguntas: questions.length,
                scores: scores
            })
        );

        window.location.assign("resultado.html");

    } catch (error) {

        quizFinished = true;
        showCompletion();

        instructionElement.textContent =
            "Não foi possível salvar seus resultados nesta sessão. Verifique se o navegador permite armazenamento e tente novamente.";

    }

});

/* =========================================
   VOLTAR
========================================= */

backButton.addEventListener("click", () => {

    if (quizFinished) {

        quizFinished = false;
        currentQuestion = questions.length - 1;

        showQuestion();
        return;

    }

    if (currentQuestion > 0) {

        currentQuestion--;
        showQuestion();

    }

});

/* =========================================
   TELA DE CONCLUSÃO ALTERNATIVA
========================================= */

function showCompletion() {

    counterElement.textContent =
        "Exploração concluída";

    questionElement.textContent =
        "Você respondeu às 30 perguntas.";

    instructionElement.textContent =
        "O questionário foi concluído, mas não foi possível abrir a página de resultados.";

    optionsElement.replaceChildren();
    optionsElement.style.display = "none";

    backButton.disabled = false;
    backButton.textContent = "Rever respostas";

    nextButton.disabled = false;
    nextButton.textContent = "Recomeçar ↻";

    updateProgress();
}

/* =========================================
   RECOMEÇAR
========================================= */

function restartQuiz() {

    currentQuestion = 0;

    answers = Array(questions.length).fill(null);

    quizFinished = false;

    showQuestion();
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

showQuestion();
