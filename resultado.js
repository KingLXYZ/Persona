
/* =========================================
   PERSONA — RESULTADOS EXPERIMENTAIS
   Compatibilidade com 20 e 30 perguntas
========================================= */

// Cada versão utiliza uma chave diferente.
const RESULT_KEYS = {
    1: "persona_resultado_v1",
    2: "persona_resultado_v2"
};

/* =========================================
   DEFINIÇÕES DAS DIMENSÕES
========================================= */

const commonDimensions = {
    cognitiva: {
        nome: "Cognitiva",
        esquerda: "Concreta",
        direita: "Abstrata",
        baixo:
            "Suas respostas se aproximaram mais da preferência por fatos, exemplos concretos e aplicações práticas nas situações apresentadas.",
        medio:
            "Suas respostas ficaram próximas do centro da escala. Isso pode refletir preferências diferentes conforme a situação ou respostas variadas entre as afirmações.",
        alto:
            "Suas respostas se aproximaram mais da preferência por hipóteses, possibilidades e relações entre ideias nas situações apresentadas."
    },

    organizacional: {
        nome: "Organizacional",
        esquerda: "Flexibilidade",
        direita: "Planejamento",
        baixo:
            "Suas respostas se aproximaram mais da preferência por manter opções abertas e ajustar os planos durante as atividades.",
        medio:
            "Suas respostas ficaram próximas do centro da escala, sem indicar uma preferência clara neste conjunto de afirmações.",
        alto:
            "Suas respostas se aproximaram mais da preferência por definir etapas, prazos e planos com antecedência."
    },

    comportamental: {
        nome: "Comportamental",
        esquerda: "Reação imediata",
        direita: "Pausa para avaliar",
        baixo:
            "Nas situações descritas, suas respostas indicaram maior tendência relatada a responder de maneira imediata diante de imprevistos.",
        medio:
            "Suas respostas variaram ou ficaram próximas do centro da escala de reação imediata e pausa para avaliar.",
        alto:
            "Nas situações descritas, suas respostas indicaram maior tendência relatada a fazer uma pausa e considerar opções antes de agir."
    }
};

/* =========================================
   DIMENSÃO SOCIAL
========================================= */

const socialV1 = {
    nome: "Social",
    esquerda: "Reserva",
    direita: "Expansividade",

    baixo:
        "Neste conjunto de perguntas, suas respostas se aproximaram mais de preferências por momentos reservados e grupos menores.",

    medio:
        "Suas respostas ficaram próximas do centro da escala social. Isso não permite afirmar que você se comporta da mesma forma em todos os contextos.",

    alto:
        "Neste conjunto de perguntas, suas respostas se aproximaram mais da disposição para iniciar interações e compartilhar experiências."
};

const socialV2 = {
    nome: "Social",
    esquerda: "Observação inicial",
    direita: "Iniciativa social",

    baixo:
        "Nas situações apresentadas, suas respostas se aproximaram mais da preferência por observar antes de iniciar interações.",

    medio:
        "Suas respostas ficaram próximas do centro da escala. Isso pode refletir preferências variáveis conforme a situação.",

    alto:
        "Nas situações apresentadas, suas respostas se aproximaram mais da iniciativa de conversar e participar espontaneamente."
};

/* =========================================
   DIMENSÃO DECISÓRIA
========================================= */

// A versão 1 utilizava valores e análise.
// A versão 2 utilizará impressão inicial
// e análise estruturada.
//
// As pontuações não são diretamente comparáveis.

const decisoriaV1 = {
    nome: "Decisória",
    esquerda: "Valores e relações",
    direita: "Análise de argumentos",

    baixo:
        "Nas perguntas anteriores, suas respostas deram mais peso a valores e consequências para as pessoas. Isso não significa ausência de análise lógica.",

    medio:
        "Suas respostas ficaram próximas do centro da escala anterior. Ela não permite concluir um equilíbrio entre lógica e consideração pelas pessoas.",

    alto:
        "Nas perguntas anteriores, suas respostas deram mais peso à análise de argumentos e evidências. Isso não significa menor consideração pelas pessoas."
};

const decisoriaV2 = {
    nome: "Decisória",
    esquerda: "Impressão inicial",
    direita: "Análise estruturada",

    baixo:
        "Nas situações apresentadas, suas respostas se aproximaram mais da preferência por seguir uma impressão inicial ao escolher.",

    medio:
        "Suas respostas ficaram próximas do centro da escala. Isso pode refletir variação entre situações, sem indicar uma preferência definida.",

    alto:
        "Nas situações apresentadas, suas respostas se aproximaram mais da preferência por comparar critérios, alternativas e possíveis consequências."
};

/* =========================================
   CONFIGURAÇÃO DAS VERSÕES
========================================= */

const DIMENSIONS_BY_VERSION = {
    1: {
        social: socialV1,
        cognitiva: commonDimensions.cognitiva,
        decisoria: decisoriaV1,
        organizacional: commonDimensions.organizacional,
        comportamental: commonDimensions.comportamental
    },

    2: {
        social: socialV2,
        cognitiva: commonDimensions.cognitiva,
        decisoria: decisoriaV2,
        organizacional: commonDimensions.organizacional,
        comportamental: commonDimensions.comportamental
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
   VALIDAR PONTUAÇÕES
========================================= */

function validScores(scores) {

    if (
        !scores ||
        typeof scores !== "object" ||
        Array.isArray(scores)
    ) {
        return false;
    }

    return Object.keys(
        DIMENSIONS_BY_VERSION[2]
    ).every(dimension => {

        const value = scores[dimension];

        return (
            Number.isInteger(value) &&
            value >= 0 &&
            value <= 100
        );

    });
}

/* =========================================
   LER UMA VERSÃO SALVA
========================================= */

function readVersion(version) {

    try {

        const stored = sessionStorage.getItem(
            RESULT_KEYS[version]
        );

        if (!stored) {
            return null;
        }

        const data = JSON.parse(stored);

        if (
            !data ||
            data.version !== version ||
            !validScores(data.scores)
        ) {
            return null;
        }

        // A nova versão terá 30 perguntas.

        if (
            version === 2 &&
            data.totalPerguntas !== 30
        ) {
            return null;
        }

        return {
            version: version,
            scores: data.scores
        };

    } catch (error) {

        return null;

    }
}

/* =========================================
   CARREGAR RESULTADOS
========================================= */

function loadResults() {

    // Priorizar a versão mais recente.

    return readVersion(2) || readVersion(1);

}

/* =========================================
   INTERPRETAÇÃO DAS PONTUAÇÕES
========================================= */

function getDescription(config, score) {

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

function renderResults(scores, version, isDemo = false) {

    const dimensions =
        DIMENSIONS_BY_VERSION[version];

    Object.keys(dimensions).forEach(dimension => {

        const config = dimensions[dimension];
        const score = scores[dimension];

        const card = document.querySelector(
            `[data-dimension="${dimension}"]`
        );

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

        if (
            !card ||
            !scoreElement ||
            !fillElement ||
            !descriptionElement
        ) {
            return;
        }

        // Mostrar o número.

        scoreElement.textContent = String(score);

        // Atualizar a barra.

        fillElement.style.width = `${score}%`;

        // Mostrar a interpretação.

        descriptionElement.textContent =
            getDescription(config, score);

        // Atualizar os extremos da escala.

        const scaleLabels = card.querySelectorAll(
            ".result-scale span"
        );

        if (scaleLabels.length === 2) {

            scaleLabels[0].textContent =
                config.esquerda;

            scaleLabels[1].textContent =
                config.direita;

        }

        // Acessibilidade.

        const meter = fillElement.parentElement;

        meter.setAttribute("role", "meter");

        meter.setAttribute(
            "aria-label",
            `Indicador exploratório: ${config.nome}`
        );

        meter.setAttribute("aria-valuemin", "0");
        meter.setAttribute("aria-valuemax", "100");

        meter.setAttribute(
            "aria-valuenow",
            String(score)
        );

    });

    // Identificar a origem do resultado.

    if (isDemo) {

        statusElement.textContent =
            "DEMONSTRAÇÃO — Valores fictícios da versão de 30 perguntas. Este exemplo não representa seu perfil.";

    } else if (version === 1) {

        statusElement.textContent =
            "Resultado experimental da versão 1 (20 perguntas). A nova versão terá 30 perguntas e critérios revisados. As pontuações entre versões não são diretamente comparáveis.";

    } else {

        statusElement.textContent =
            "Resultado experimental da versão 2 (30 perguntas). Os indicadores descrevem suas respostas a estas afirmações, não medidas clínicas ou definitivas da personalidade.";

    }
}

/* =========================================
   RESULTADOS FICTÍCIOS
========================================= */

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

    // Atualizar o ano.

    if (yearElement) {

        yearElement.textContent =
            String(new Date().getFullYear());

    }

    // Verificar modo de demonstração.

    const params = new URLSearchParams(
        window.location.search
    );

    if (params.get("exemplo") === "1") {

        renderResults(demoScores, 2, true);
        return;

    }

    // Buscar resultados armazenados.

    const result = loadResults();

    if (result) {

        renderResults(
            result.scores,
            result.version
        );

    } else if (statusElement) {

        statusElement.textContent =
            "Nenhum resultado disponível nesta sessão. Conclua o questionário para visualizar seu perfil.";

    }
}

// Iniciar.
initializeResults();
