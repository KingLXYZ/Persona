
/* =========================================
   PERSONA — SISTEMA DE RESULTADOS
   Versão experimental
========================================= */

// Esta chave será utilizada para transferir
// os resultados do questionário para esta página.

const STORAGE_KEY = "persona_resultado_v1";

/* =========================================
   CONFIGURAÇÃO DAS DIMENSÕES
========================================= */

const dimensions = {

    social: {
        nome: "Social",

        baixo:
            "Suas respostas sugerem maior preferência por interações em grupos menores e momentos de reserva. Isso não significa dificuldade para estabelecer conexões.",

        medio:
            "Suas respostas sugerem flexibilidade social. Você pode preferir ambientes movimentados ou momentos de reserva, dependendo da situação.",

        alto:
            "Suas respostas indicam maior disposição para iniciar conversas, compartilhar experiências e participar de interações sociais."
    },

    cognitiva: {
        nome: "Cognitiva",

        baixo:
            "Suas respostas apontam maior atenção a exemplos concretos, informações observáveis e aplicações práticas.",

        medio:
            "Suas respostas sugerem interesse tanto por informações concretas quanto por possibilidades e interpretações mais abstratas.",

        alto:
            "Suas respostas apontam maior interesse em explorar possibilidades, relacionar ideias e reconhecer padrões."
    },

    decisoria: {
        nome: "Decisória",

        baixo:
            "Suas respostas destacam maior atenção ao impacto das escolhas sobre as pessoas e aos valores envolvidos nas decisões.",

        medio:
            "Suas respostas sugerem que você considera tanto evidências e argumentos quanto valores e consequências humanas.",

        alto:
            "Suas respostas destacam maior atenção à coerência dos argumentos, às evidências e à comparação de alternativas."
    },

    organizacional: {
        nome: "Organizacional",

        baixo:
            "Suas respostas sugerem preferência por adaptar as atividades conforme as situações se desenvolvem, mantendo liberdade para mudar os planos.",

        medio:
            "Suas respostas sugerem uma combinação de planejamento e flexibilidade, dependendo das necessidades do momento.",

        alto:
            "Suas respostas indicam maior preferência por organizar etapas, definir objetivos e estabelecer planos antes de agir."
    },

    comportamental: {
        nome: "Comportamental",

        baixo:
            "Suas respostas se aproximam de uma tendência a reagir de maneira mais imediata diante de contratempos e situações inesperadas.",

        medio:
            "Suas respostas sugerem variação entre reações imediatas e momentos de observação antes de agir.",

        alto:
            "Suas respostas apontam maior preferência por observar situações e avaliar alternativas antes de reagir sob pressão."
    }

};

/* =========================================
   ELEMENTOS DA PÁGINA
========================================= */

const statusElement =
    document.getElementById("result-status");

const yearElement =
    document.getElementById("current-year");

/* =========================================
   VALIDAR RESULTADOS
========================================= */

function validScores(scores) {

    if (!scores || typeof scores !== "object") {
        return false;
    }

    return Object.keys(dimensions).every(dimension => {

        const value = scores[dimension];

        return (
            typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
        );

    });

}

/* =========================================
   INTERPRETAR PONTUAÇÃO
========================================= */

function getDescription(dimension, score) {

    const config = dimensions[dimension];

    if (score < 35) {
        return config.baixo;
    }

    if (score > 65) {
        return config.alto;
    }

    return config.medio;

}

/* =========================================
   EXIBIR RESULTADOS
========================================= */

function renderResults(scores, isDemo = false) {

    Object.keys(dimensions).forEach(dimension => {

        const score = scores[dimension];

        const scoreElement =
            document.getElementById(
                `score-${dimension}`
            );

        const fillElement =
            document.getElementById(
                `fill-${dimension}`
            );

        const descriptionElement =
            document.getElementById(
                `description-${dimension}`
            );

        const meterElement = fillElement.parentElement;

        // Exibir pontuação.

        scoreElement.textContent = score;

        // Preencher barra.

        fillElement.style.width = `${score}%`;

        // Exibir interpretação correspondente.

        descriptionElement.textContent =
            getDescription(dimension, score);

        // Informações para acessibilidade.

        meterElement.setAttribute("role", "meter");
        meterElement.setAttribute(
            "aria-label",
            `Indicador exploratório: ${dimensions[dimension].nome}`
        );
        meterElement.setAttribute("aria-valuemin", "0");
        meterElement.setAttribute("aria-valuemax", "100");
        meterElement.setAttribute(
            "aria-valuenow",
            String(score)
        );

    });

    if (isDemo) {

        statusElement.textContent =
            "MODO DE DEMONSTRAÇÃO — Os valores apresentados são fictícios e servem apenas para visualizar o funcionamento da página.";

    } else {

        statusElement.textContent =
            "Sua exploração foi carregada. Os indicadores abaixo representam tendências nas respostas fornecidas ao questionário.";

    }

}

/* =========================================
   CARREGAR RESULTADOS SALVOS
========================================= */

function loadSavedResults() {

    try {

        const savedData =
            sessionStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return null;
        }

        const parsedData = JSON.parse(savedData);

        if (
            parsedData.version !== 1 ||
            !validScores(parsedData.scores)
        ) {
            return null;
        }

        return parsedData.scores;

    } catch (error) {

        return null;

    }

}

/* =========================================
   MODO DE DEMONSTRAÇÃO
========================================= */

// Para visualizar pontuações fictícias,
// abra resultado.html?exemplo=1
//
// Esse modo não cria resultados pessoais.

const demoScores = {
    social: 35,
    cognitiva: 75,
    decisoria: 60,
    organizacional: 85,
    comportamental: 55
};

/* =========================================
   INICIALIZAÇÃO
========================================= */

function initializeResults() {

    // Atualizar o ano do rodapé.

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

    // Verificar se o modo de demonstração foi ativado.

    const parameters =
        new URLSearchParams(window.location.search);

    const isDemo =
        parameters.get("exemplo") === "1";

    if (isDemo) {

        renderResults(demoScores, true);
        return;

    }

    // Procurar resultados reais da sessão.

    const savedScores = loadSavedResults();

    if (savedScores) {

        renderResults(savedScores);

    } else {

        statusElement.textContent =
            "Nenhum resultado disponível nesta sessão. Conclua o questionário para visualizar a análise do seu perfil.";

    }

}

initializeResults();
