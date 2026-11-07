
/* =========================================
   PERSONA — QUESTIONÁRIO DE PERSONALIDADE
   Versão experimental: 20 perguntas
========================================= */

// As cinco dimensões que serão analisadas.

const dimensions = {
    social: "Social",
    cognitiva: "Cognitiva",
    decisoria: "Decisória",
    organizacional: "Organizacional",
    comportamental: "Comportamental"
};

// Escala utilizada em todas as perguntas.

const answerOptions = [
    "Discordo totalmente",
    "Discordo parcialmente",
    "Nem concordo nem discordo",
    "Concordo parcialmente",
    "Concordo totalmente"
];

/* =========================================
   BANCO DE PERGUNTAS
========================================= */

// Cada pergunta possui:
// texto: afirmação apresentada ao usuário
// dimensao: dimensão avaliada
// invertida: indica se a pontuação será invertida

const questions = [

    {
        texto: "Em um grupo novo, costumo iniciar conversas espontaneamente.",
        dimensao: "social",
        invertida: false
    },

    {
        texto: "Ao conhecer uma ideia, gosto de imaginar possibilidades que ainda não foram exploradas.",
        dimensao: "cognitiva",
        invertida: false
    },

    {
        texto: "Em decisões difíceis, costumo organizar argumentos e avaliar sua coerência antes de escolher.",
        dimensao: "decisoria",
        invertida: false
    },

    {
        texto: "Antes de começar algo importante, gosto de definir as etapas que vou seguir.",
        dimensao: "organizacional",
        invertida: false
    },

    {
        texto: "Quando algo inesperado acontece, costumo observar a situação antes de reagir.",
        dimensao: "comportamental",
        invertida: false
    },

    {
        texto: "Depois de passar bastante tempo com muitas pessoas, geralmente prefiro ficar sozinho por um período.",
        dimensao: "social",
        invertida: true
    },

    {
        texto: "Aprendo melhor quando começo por exemplos concretos, antes de explorar teorias.",
        dimensao: "cognitiva",
        invertida: true
    },

    {
        texto: "Quando uma escolha afeta outras pessoas, considero primeiro como elas vão se sentir.",
        dimensao: "decisoria",
        invertida: true
    },

    {
        texto: "Prefiro decidir como realizar uma atividade conforme ela acontece.",
        dimensao: "organizacional",
        invertida: true
    },

    {
        texto: "Diante de um contratempo, minha reação inicial costuma ser imediata e intensa.",
        dimensao: "comportamental",
        invertida: true
    },

    {
        texto: "Quando algo me entusiasma, sinto vontade de compartilhar a experiência com várias pessoas.",
        dimensao: "social",
        invertida: false
    },

    {
        texto: "Frequentemente relaciono assuntos diferentes para encontrar padrões ou novas ideias.",
        dimensao: "cognitiva",
        invertida: false
    },

    {
        texto: "Ao considerar diferentes escolhas, costumo verificar quais evidências apoiam cada possibilidade.",
        dimensao: "decisoria",
        invertida: false
    },

    {
        texto: "Mesmo sem cobranças externas, costumo estabelecer prazos ou rotinas para meus objetivos.",
        dimensao: "organizacional",
        invertida: false
    },

    {
        texto: "Mesmo sob pressão, geralmente consigo avaliar alternativas antes de agir.",
        dimensao: "comportamental",
        invertida: false
    },

    {
        texto: "Em momentos de lazer, prefiro encontros com poucas pessoas a eventos movimentados.",
        dimensao: "social",
        invertida: true
    },

    {
        texto: "Ao analisar um problema, minha atenção vai primeiro para os detalhes observáveis, não para cenários hipotéticos.",
        dimensao: "cognitiva",
        invertida: true
    },

    {
        texto: "Ao escolher, prefiro considerar o que é importante para as pessoas envolvidas antes de comparar vantagens e desvantagens.",
        dimensao: "decisoria",
        invertida: true
    },

    {
        texto: "Um roteiro aberto, sem etapas fixas, costuma funcionar melhor para mim do que um planejamento detalhado.",
        dimensao: "organizacional",
        invertida: true
    },

    {
        texto: "Quando um plano falha, costumo reagir primeiro e pensar nos próximos passos depois.",
        dimensao: "comportamental",
        invertida: true
    }

];

/* =========================================
   ELEMENTOS DO HTML
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

/* =========================================
   ESTADO DO QUESTIONÁRIO
========================================= */

let currentQuestion = 0;

// null representa uma pergunta ainda não respondida.

let answers = Array(questions.length).fill(null);

let quizFinished = false;

// Pontuações calculadas ao concluir.
// Nesta versão ainda não serão exibidas.

let calculatedScores = null;

/* =========================================
   EXIBIR PERGUNTA
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

    answerOptions.forEach((optionText, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = optionText;

        const answerValue = index + 1;

        const selected =
            answers[currentQuestion] === answerValue;

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

    const buttons =
        optionsElement.querySelectorAll(".quiz-option");

    buttons.forEach((button, index) => {

        const selected = index + 1 === value;

        button.classList.toggle("selected", selected);

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

    });

    nextButton.disabled = false;

    updateProgress();
}

/* =========================================
   BARRA DE PROGRESSO
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
   AVANÇAR
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

    } else {

        const allAnswered =
            answers.every(answer => answer !== null);

        if (!allAnswered) {
            return;
        }

        calculatedScores = calculateScores();

        quizFinished = true;

        showCompletion();
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
   CALCULAR PONTUAÇÕES
========================================= */

// Cada resposta vai de 1 até 5.
//
// Em afirmações invertidas:
// 1 vira 5
// 2 vira 4
// 3 continua 3
// 4 vira 2
// 5 vira 1
//
// Cada dimensão terá quatro pontuações.
// A soma será convertida para uma escala
// experimental entre 0 e 100.

function calculateScores() {

    const totals = {};
    const results = {};

    Object.keys(dimensions).forEach(dimension => {

        totals[dimension] = {
            soma: 0,
            quantidade: 0
        };

    });

    questions.forEach((question, index) => {

        const answer = answers[index];

        if (answer === null) {
            return;
        }

        const score = question.invertida
            ? 6 - answer
            : answer;

        totals[question.dimensao].soma += score;

        totals[question.dimensao].quantidade++;

    });

    Object.keys(dimensions).forEach(dimension => {

        const total = totals[dimension];

        if (total.quantidade === 0) {
            results[dimension] = null;
            return;
        }

        const average =
            total.soma / total.quantidade;

        // Normalização da média de 1–5 para 0–100.

        const percentage =
            Math.round(((average - 1) / 4) * 100);

        results[dimension] = percentage;

    });

    return results;
}

/* =========================================
   TELA DE CONCLUSÃO
========================================= */

function showCompletion() {

    counterElement.textContent =
        "20 de 20 perguntas respondidas";

    questionElement.textContent =
        "Você concluiu sua exploração.";

    instructionElement.textContent =
        "Suas respostas foram processadas nesta sessão. Estamos preparando a experiência detalhada de resultados para a próxima etapa do PERSONA.";

    optionsElement.replaceChildren();
    optionsElement.style.display = "none";

    backButton.disabled = false;
    backButton.textContent = "Rever respostas";

    nextButton.disabled = false;
    nextButton.textContent = "Recomeçar ↻";

    updateProgress();
}

/* =========================================
   RECOMEÇAR QUESTIONÁRIO
========================================= */

function restartQuiz() {

    currentQuestion = 0;

    answers = Array(questions.length).fill(null);

    quizFinished = false;
    calculatedScores = null;

    showQuestion();
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

showQuestion();
