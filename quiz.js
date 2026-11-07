
/* =========================================
   PERSONA — QUESTIONÁRIO INTERATIVO
========================================= */

// Perguntas demonstrativas.
// Futuramente, teremos perguntas para
// as cinco dimensões da personalidade.

const questions = [
    {
        question:
            "Quando você precisa tomar uma decisão importante, o que costuma fazer primeiro?",

        options: [
            "Analiso as possibilidades e consequências.",
            "Considero como a decisão afetará as pessoas.",
            "Procuro equilibrar os dois aspectos."
        ]
    },

    {
        question:
            "Quando surge uma ideia nova, como você costuma explorá-la?",

        options: [
            "Imagino suas possibilidades futuras.",
            "Procuro exemplos práticos e concretos.",
            "Combino possibilidades e aplicações reais."
        ]
    },

    {
        question:
            "Ao conhecer pessoas novas, qual situação parece mais natural para você?",

        options: [
            "Observar e conversar aos poucos.",
            "Iniciar conversas espontaneamente.",
            "Depende do ambiente e do momento."
        ]
    }
];

/* =========================================
   ELEMENTOS DA PÁGINA
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

let answers = Array(questions.length).fill(null);

let quizFinished = false;

/* =========================================
   EXIBIR PERGUNTA
========================================= */

function showQuestion() {

    if (quizFinished) {
        showCompletion();
        return;
    }

    const current = questions[currentQuestion];

    questionElement.textContent = current.question;

    counterElement.textContent =
        `Pergunta ${currentQuestion + 1} de ${questions.length}`;

    instructionElement.textContent =
        "Escolha a alternativa que mais se aproxima da sua maneira de pensar ou agir.";

    optionsElement.hidden = false;
    optionsElement.replaceChildren();

    current.options.forEach((optionText, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = optionText;

        const selected = answers[currentQuestion] === index;

        button.classList.toggle("selected", selected);

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

        button.addEventListener("click", () => {
            selectAnswer(index);
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
   SELECIONAR ALTERNATIVA
========================================= */

function selectAnswer(index) {

    answers[currentQuestion] = index;

    const buttons = optionsElement.querySelectorAll(
        ".quiz-option"
    );

    buttons.forEach((button, buttonIndex) => {

        const selected = buttonIndex === index;

        button.classList.toggle("selected", selected);

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

    });

    nextButton.disabled = false;
}

/* =========================================
   ATUALIZAR PROGRESSO
========================================= */

function updateProgress() {

    const percentage = quizFinished
        ? 100
        : Math.round(
            (currentQuestion / questions.length) * 100
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
   CONCLUSÃO
========================================= */

function showCompletion() {

    counterElement.textContent =
        "Exploração concluída";

    questionElement.textContent =
        "Você concluiu sua primeira exploração.";

    instructionElement.textContent =
        "Esta versão demonstra o funcionamento do questionário. Na próxima etapa, construiremos as dimensões e a análise dos resultados.";

    optionsElement.replaceChildren();
    optionsElement.hidden = true;

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
