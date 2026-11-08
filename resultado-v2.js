
/* =========================================
   PERSONA — SISTEMA DE RESULTADOS
   Versões 1 e 2 + Visão Geral
========================================= */

(() => {
    "use strict";

    const CHAVES = {
        1: "persona_resultado_v1",
        2: "persona_resultado_v2"
    };

    /* =====================================
       DIMENSÕES
    ===================================== */

    const comuns = {
        cognitiva: {
            nome: "Cognitiva",
            esquerda: "Concreta",
            direita: "Abstrata",
            baixo: "Suas respostas se aproximaram mais da preferência por exemplos concretos e aplicações práticas nas situações apresentadas.",
            medio: "Suas respostas ficaram próximas do centro desta escala. Isso pode refletir preferências diferentes conforme a situação.",
            alto: "Suas respostas se aproximaram mais da preferência por hipóteses, novas possibilidades e relações entre ideias."
        },

        organizacional: {
            nome: "Organizacional",
            esquerda: "Flexibilidade",
            direita: "Planejamento",
            baixo: "Suas respostas se aproximaram mais da preferência por manter possibilidades abertas e ajustar planos durante as atividades.",
            medio: "Suas respostas ficaram próximas do centro desta escala, sem evidenciar uma preferência definida neste conjunto de perguntas.",
            alto: "Suas respostas se aproximaram mais da preferência por organizar etapas, prazos e planos com antecedência."
        },

        comportamental: {
            nome: "Comportamental",
            esquerda: "Reação imediata",
            direita: "Pausa para avaliar",
            baixo: "Nas situações descritas, você relatou maior tendência a responder de maneira imediata diante de imprevistos.",
            medio: "Suas respostas se aproximaram do centro ou variaram entre reação imediata e pausa para avaliar.",
            alto: "Nas situações descritas, você relatou maior tendência a fazer uma pausa e considerar opções antes de responder."
        }
    };

    const socialV1 = {
        nome: "Social",
        esquerda: "Reserva",
        direita: "Expansividade",
        baixo: "Suas respostas se aproximaram mais de preferências por momentos reservados e interações em grupos menores.",
        medio: "Suas respostas ficaram próximas do centro da escala social utilizada na primeira versão.",
        alto: "Suas respostas se aproximaram mais da disposição para iniciar interações e compartilhar experiências."
    };

    const socialV2 = {
        nome: "Social",
        esquerda: "Observação inicial",
        direita: "Iniciativa social",
        baixo: "Nas situações propostas, suas respostas se aproximaram mais da preferência por observar antes de iniciar interações.",
        medio: "Suas respostas ficaram próximas do centro da escala. Isso pode refletir preferências diferentes conforme o contexto.",
        alto: "Nas situações propostas, suas respostas se aproximaram mais da iniciativa de conversar e participar espontaneamente."
    };

    const decisoriaV1 = {
        nome: "Decisória",
        esquerda: "Valores e relações",
        direita: "Análise de argumentos",
        baixo: "Na primeira versão, suas respostas deram mais peso a valores e consequências para as pessoas. Isso não significa ausência de análise lógica.",
        medio: "Suas respostas ficaram próximas do centro da escala antiga, que não permite concluir um equilíbrio entre lógica e consideração pelas pessoas.",
        alto: "Na primeira versão, suas respostas deram mais peso a argumentos e evidências. Isso não significa menor consideração pelas pessoas."
    };

    const decisoriaV2 = {
        nome: "Decisória",
        esquerda: "Impressão inicial",
        direita: "Análise estruturada",
        baixo: "Nas situações apresentadas, suas respostas se aproximaram mais da preferência por seguir uma impressão inicial ao escolher.",
        medio: "Suas respostas ficaram próximas do centro desta escala. Isso não define uma preferência constante em todas as situações.",
        alto: "Nas situações apresentadas, suas respostas se aproximaram mais da preferência por comparar critérios, alternativas e consequências."
    };

    const DIMENSOES = {
        1: {
            social: socialV1,
            cognitiva: comuns.cognitiva,
            decisoria: decisoriaV1,
            organizacional: comuns.organizacional,
            comportamental: comuns.comportamental
        },

        2: {
            social: socialV2,
            cognitiva: comuns.cognitiva,
            decisoria: decisoriaV2,
            organizacional: comuns.organizacional,
            comportamental: comuns.comportamental
        }
    };

    /* =====================================
       ELEMENTOS
    ===================================== */

    const statusEl =
        document.getElementById("result-status");

    const anoEl =
        document.getElementById("current-year");

    if (anoEl) {
        anoEl.textContent =
            String(new Date().getFullYear());
    }

    if (!statusEl) {
        console.error(
            "PERSONA: elemento result-status não encontrado."
        );
        return;
    }

    /* =====================================
       VALIDAR PONTUAÇÕES
    ===================================== */

    function pontuacoesValidas(pontuacoes) {

        if (
            !pontuacoes ||
            typeof pontuacoes !== "object" ||
            Array.isArray(pontuacoes)
        ) {
            return false;
        }

        return Object.keys(DIMENSOES[2]).every(chave => {

            const valor = pontuacoes[chave];

            return Number.isInteger(valor) &&
                   valor >= 0 &&
                   valor <= 100;
        });
    }

    /* =====================================
       CARREGAR RESULTADOS
    ===================================== */

    function carregarVersao(versao) {

        try {
            const bruto =
                sessionStorage.getItem(CHAVES[versao]);

            if (!bruto) return null;

            const dados = JSON.parse(bruto);

            if (
                !dados ||
                dados.version !== versao ||
                !pontuacoesValidas(dados.scores)
            ) {
                return null;
            }

            if (
                versao === 2 &&
                dados.totalPerguntas !== 30
            ) {
                return null;
            }

            return {
                versao,
                pontuacoes: dados.scores
            };

        } catch (erro) {
            return null;
        }
    }

    /* =====================================
       INTERPRETAÇÕES INDIVIDUAIS
    ===================================== */

    function interpretar(config, pontuacao) {

        if (pontuacao < 35) {
            return config.baixo;
        }

        if (pontuacao > 65) {
            return config.alto;
        }

        return config.medio;
    }

    /* =====================================
       VISÃO GERAL DO PERFIL
    ===================================== */

    function mostrarVisaoGeral(
        pontuacoes,
        versao,
        demonstracao
    ) {

        const leitura =
            document.getElementById(
                "overview-combination"
            );

        const orientacao =
            document.getElementById(
                "overview-guidance"
            );

        if (!leitura || !orientacao) {
            return;
        }

        const configuracoes = DIMENSOES[versao];

        const dados = Object.entries(
            configuracoes
        ).map(([chave, config]) => {

            const valor = pontuacoes[chave];

            const polo = valor < 35
                ? config.esquerda
                : valor > 65
                    ? config.direita
                    : null;

            return {
                nome: config.nome,
                valor,
                polo,
                distancia: Math.abs(valor - 50)
            };
        });

        // Identificar até duas tendências
        // mais afastadas do ponto central.

        const destaques = dados
            .filter(item => item.polo !== null)
            .sort((a, b) => b.distancia - a.distancia)
            .slice(0, 2);

        const abertura = demonstracao
            ? "Neste exemplo fictício, "
            : "Neste questionário, ";

        if (destaques.length === 2) {

            const [primeiro, segundo] = destaques;

            leitura.textContent =
                abertura +
                `a dimensão ${primeiro.nome} apresentou ${primeiro.valor}/100, mais próxima do polo “${primeiro.polo}”. ` +
                `A dimensão ${segundo.nome} apresentou ${segundo.valor}/100, mais próxima de “${segundo.polo}”. ` +
                "Essas preferências foram relatadas em situações diferentes; os resultados não demonstram que uma determine a outra.";

        } else if (destaques.length === 1) {

            const destaque = destaques[0];

            leitura.textContent =
                abertura +
                `a dimensão ${destaque.nome} apresentou ${destaque.valor}/100, mais próxima do polo “${destaque.polo}”. ` +
                "As demais pontuações ficaram na faixa central, sem uma direção claramente destacada.";

        } else {

            leitura.textContent =
                abertura +
                "as cinco pontuações ficaram na faixa central (35 a 65). " +
                "Isso não prova equilíbrio entre os polos: as escolhas podem variar de uma situação para outra.";
        }

        /* =================================
           ORIENTAÇÃO SOBRE OS RESULTADOS
        ================================= */

        const centrais = dados.filter(
            item => item.polo === null
        );

        const quantidade = versao === 2 ? 6 : 4;

        if (centrais.length > 0) {

            const nomes = centrais
                .map(item => item.nome)
                .join(", ");

            orientacao.textContent =
                `Na faixa central ficaram: ${nomes}. ` +
                "Uma posição próxima de 50 não demonstra equilíbrio nem ausência de preferências. " +
                `Estes indicadores resumem respostas a ${quantidade} afirmações por dimensão. ` +
                "Não são medidas clínicas e ainda não foram validados cientificamente.";

        } else {

            orientacao.textContent =
                "Todas as pontuações ficaram fora da faixa central, mas isso não determina características fixas. " +
                "Os indicadores resumem respostas a situações específicas e não foram validados cientificamente.";
        }
    }

    /* =====================================
       EXIBIR OS CINCO RESULTADOS
    ===================================== */

    function mostrarResultados(
        pontuacoes,
        versao,
        demonstracao = false
    ) {

        Object.entries(
            DIMENSOES[versao]
        ).forEach(([chave, config]) => {

            const card = document.querySelector(
                `[data-dimension="${chave}"]`
            );

            const numero = document.getElementById(
                `score-${chave}`
            );

            const preenchimento = document.getElementById(
                `fill-${chave}`
            );

            const descricao = document.getElementById(
                `description-${chave}`
            );

            if (
                !card ||
                !numero ||
                !preenchimento ||
                !descricao
            ) {
                return;
            }

            const pontuacao = pontuacoes[chave];

            numero.textContent = String(pontuacao);

            preenchimento.style.width =
                `${pontuacao}%`;

            descricao.textContent =
                interpretar(config, pontuacao);

            // Atualizar os rótulos da escala.

            const rotulos = card.querySelectorAll(
                ".result-scale span"
            );

            if (rotulos.length === 2) {
                rotulos[0].textContent =
                    config.esquerda;

                rotulos[1].textContent =
                    config.direita;
            }

            // Acessibilidade do medidor.

            const medidor =
                preenchimento.parentElement;

            medidor.setAttribute("role", "meter");

            medidor.setAttribute(
                "aria-label",
                `Indicador exploratório: ${config.nome}`
            );

            medidor.setAttribute(
                "aria-valuemin",
                "0"
            );

            medidor.setAttribute(
                "aria-valuemax",
                "100"
            );

            medidor.setAttribute(
                "aria-valuenow",
                String(pontuacao)
            );
        });

        // Atualizar a leitura conjunta.

        mostrarVisaoGeral(
            pontuacoes,
            versao,
            demonstracao
        );

        if (demonstracao) {

            statusEl.textContent =
                "DEMONSTRAÇÃO — Valores fictícios da versão de 30 perguntas. Não representam seu perfil.";

        } else if (versao === 1) {

            statusEl.textContent =
                "Resultado da versão 1 (20 perguntas). As pontuações não são diretamente comparáveis às da versão de 30 perguntas.";

        } else {

            statusEl.textContent =
                "Resultado experimental da versão 2 (30 perguntas). Os indicadores refletem apenas suas respostas neste questionário.";
        }
    }

    /* =====================================
       INICIALIZAÇÃO
    ===================================== */

    const parametros = new URLSearchParams(
        window.location.search
    );

    if (parametros.get("exemplo") === "1") {

        mostrarResultados({
            social: 35,
            cognitiva: 75,
            decisoria: 60,
            organizacional: 85,
            comportamental: 55
        }, 2, true);

    } else {

        const resultado =
            carregarVersao(2) ||
            carregarVersao(1);

        if (resultado) {

            mostrarResultados(
                resultado.pontuacoes,
                resultado.versao
            );

        } else {

            statusEl.textContent =
                "Nenhum resultado disponível nesta sessão. Conclua o questionário para visualizar seu perfil.";

            const leitura =
                document.getElementById(
                    "overview-combination"
                );

            if (leitura) {
                leitura.textContent =
                    "Conclua o questionário para visualizar a leitura conjunta das dimensões.";
            }
        }
    }

})();
