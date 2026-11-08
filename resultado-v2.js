
/* =========================================
   PERSONA — RESULTADOS E ARMAZENAMENTO
   Compatível com as versões 1 e 2
========================================= */

(() => {
    "use strict";

    const CHAVES = {
        1: "persona_resultado_v1",
        2: "persona_resultado_v2"
    };

    const CHAVE_SALVA = "persona_perfil_salvo_v1";

    /* =====================================
       DEFINIÇÕES DAS DIMENSÕES
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
       ELEMENTOS DA PÁGINA
    ===================================== */

    const statusEl =
        document.getElementById("result-status");

    const anoEl =
        document.getElementById("current-year");

    if (anoEl) {
        anoEl.textContent = String(new Date().getFullYear());
    }

    if (!statusEl) {
        console.error("PERSONA: result-status não encontrado.");
        return;
    }

    /* =====================================
       VALIDAÇÃO DAS PONTUAÇÕES
    ===================================== */

    function pontuacoesValidas(pontuacoes) {

        if (
            pontuacoes === null ||
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
       CARREGAR RESULTADO TEMPORÁRIO
    ===================================== */

    function carregarVersao(versao) {

        try {
            const bruto = sessionStorage.getItem(
                CHAVES[versao]
            );

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
                versao: versao,
                pontuacoes: dados.scores
            };

        } catch (erro) {
            return null;
        }
    }

    /* =====================================
       RECUPERAR PERFIL SALVO
    ===================================== */

    function carregarPerfilSalvo() {

        try {
            const bruto = localStorage.getItem(
                CHAVE_SALVA
            );

            if (!bruto) return null;

            const dados = JSON.parse(bruto);

            if (
                !dados ||
                dados.formato !== 1 ||
                ![1, 2].includes(dados.version) ||
                !pontuacoesValidas(dados.scores)
            ) {
                return null;
            }

            if (
                dados.version === 2 &&
                dados.totalPerguntas !== 30
            ) {
                return null;
            }

            if (
                typeof dados.salvoEm !== "string" ||
                !Number.isFinite(Date.parse(dados.salvoEm))
            ) {
                return null;
            }

            return {
                versao: dados.version,
                pontuacoes: dados.scores,
                salvoEm: dados.salvoEm
            };

        } catch (erro) {
            return null;
        }
    }

    function dataLegivel(dataISO) {

        return new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short"
        }).format(new Date(dataISO));
    }

    /* =====================================
       INTERPRETAR DIMENSÕES
    ===================================== */

    function interpretar(configuracao, pontuacao) {

        if (pontuacao < 35) {
            return configuracao.baixo;
        }

        if (pontuacao > 65) {
            return configuracao.alto;
        }

        return configuracao.medio;
    }

    /* =====================================
       VISÃO GERAL INTEGRADA
    ===================================== */

    function mostrarVisaoGeral(
        pontuacoes,
        versao,
        demonstracao
    ) {

        const leitura =
            document.getElementById("overview-combination");

        const orientacao =
            document.getElementById("overview-guidance");

        if (!leitura || !orientacao) return;

        const dados = Object.entries(
            DIMENSOES[versao]
        ).map(([chave, config]) => {

            const valor = pontuacoes[chave];

            const polo = valor < 35
                ? config.esquerda
                : valor > 65
                    ? config.direita
                    : null;

            return {
                nome: config.nome,
                valor: valor,
                polo: polo,
                distancia: Math.abs(valor - 50)
            };
        });

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
                "As demais pontuações ficaram na faixa central deste conjunto de afirmações.";

        } else {

            leitura.textContent =
                abertura +
                "as cinco pontuações ficaram na faixa central (35 a 65). " +
                "Isso não prova equilíbrio entre os polos: as respostas podem variar conforme a situação.";
        }

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
                "Os indicadores não foram validados cientificamente.";
        }
    }

    /* =====================================
       MOSTRAR CINCO DIMENSÕES
    ===================================== */

    function mostrarResultados(
        pontuacoes,
        versao,
        demonstracao = false
    ) {

        Object.entries(DIMENSOES[versao]).forEach(
            ([chave, config]) => {

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

                const rotulos = card.querySelectorAll(
                    ".result-scale span"
                );

                if (rotulos.length === 2) {
                    rotulos[0].textContent =
                        config.esquerda;

                    rotulos[1].textContent =
                        config.direita;
                }

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
            }
        );

        mostrarVisaoGeral(
            pontuacoes,
            versao,
            demonstracao
        );

        statusEl.textContent = demonstracao
            ? "DEMONSTRAÇÃO — Valores fictícios da versão de 30 perguntas."
            : versao === 1
                ? "Resultado experimental da versão 1 (20 perguntas)."
                : "Resultado experimental da versão 2 (30 perguntas).";
    }

    /* =====================================
       CONTROLES DE ARMAZENAMENTO
    ===================================== */

    function mostrarControlesDeSalvamento(
        resultado,
        origem
    ) {

        if (!resultado) return;

        const painel = document.createElement("section");

        painel.setAttribute(
            "aria-label",
            "Guardar e excluir resultados"
        );

        Object.assign(painel.style, {
            marginTop: "20px",
            padding: "22px",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            background: "var(--surface)"
        });

        const titulo = document.createElement("h2");

        titulo.textContent = "Guardar meu perfil";

        Object.assign(titulo.style, {
            fontSize: "18px",
            letterSpacing: "-0.02em",
            lineHeight: "1.4"
        });

        painel.appendChild(titulo);

        const descricao = document.createElement("p");

        descricao.textContent =
            "Você decide se quer guardar este resultado. " +
            "Serão salvas apenas as cinco pontuações, a versão " +
            "do questionário e a data. Os dados ficam neste " +
            "navegador e dispositivo, sem sincronização com uma conta.";

        Object.assign(descricao.style, {
            color: "var(--muted)",
            fontSize: "13px",
            lineHeight: "1.8",
            marginTop: "10px"
        });

        painel.appendChild(descricao);

        const mensagem = document.createElement("p");

        mensagem.setAttribute("role", "status");
        mensagem.setAttribute("aria-live", "polite");

        Object.assign(mensagem.style, {
            color: "var(--purple-light)",
            fontSize: "12px",
            marginTop: "14px",
            lineHeight: "1.7"
        });

        const salvo = carregarPerfilSalvo();

        if (salvo) {

            mensagem.textContent =
                `Há um perfil salvo neste navegador desde ${dataLegivel(salvo.salvoEm)}.`;

        } else if (origem === "sessao") {

            mensagem.textContent =
                "Este perfil ainda não está salvo permanentemente.";
        }

        painel.appendChild(mensagem);

        const acoes = document.createElement("div");

        Object.assign(acoes.style, {
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "18px"
        });

        /* BOTÃO SALVAR */

        const salvar = document.createElement("button");

        salvar.type = "button";
        salvar.className = "primary-button";

        salvar.textContent = salvo
            ? "Atualizar perfil salvo"
            : "Salvar neste navegador";

        salvar.addEventListener("click", () => {

            const anterior = carregarPerfilSalvo();

            if (
                anterior &&
                !window.confirm(
                    "Já existe um perfil salvo. Deseja substituí-lo por este resultado?"
                )
            ) {
                return;
            }

            try {

                localStorage.setItem(
                    CHAVE_SALVA,
                    JSON.stringify({
                        formato: 1,
                        version: resultado.versao,
                        totalPerguntas:
                            resultado.versao === 2 ? 30 : 20,
                        scores: resultado.pontuacoes,
                        salvoEm: new Date().toISOString()
                    })
                );

                mensagem.textContent =
                    "Perfil salvo! Você poderá consultá-lo novamente neste navegador, mesmo depois de fechar a aba.";

                salvar.textContent =
                    "Atualizar perfil salvo";

                exibirExcluir();

            } catch (erro) {

                mensagem.textContent =
                    "Não foi possível salvar. Verifique se o navegador permite armazenamento local.";
            }
        });

        acoes.appendChild(salvar);

        /* BOTÃO EXCLUIR */

        let excluir = null;

        function exibirExcluir() {

            if (excluir || !carregarPerfilSalvo()) {
                return;
            }

            excluir = document.createElement("button");

            excluir.type = "button";
            excluir.className = "secondary-button";
            excluir.textContent = "Excluir resultado salvo";

            excluir.addEventListener("click", () => {

                const confirmou = window.confirm(
                    "Excluir o perfil salvo e os resultados temporários desta aba? Esta ação não pode ser desfeita."
                );

                if (!confirmou) return;

                try {

                    localStorage.removeItem(CHAVE_SALVA);

                    sessionStorage.removeItem(CHAVES[1]);
                    sessionStorage.removeItem(CHAVES[2]);

                    window.location.reload();

                } catch (erro) {

                    mensagem.textContent =
                        "Não foi possível excluir os dados.";
                }
            });

            acoes.appendChild(excluir);
        }

        exibirExcluir();

        painel.appendChild(acoes);

        statusEl.insertAdjacentElement(
            "afterend",
            painel
        );
    }

    /* =====================================
       INICIALIZAÇÃO
    ===================================== */

    const parametros = new URLSearchParams(
        window.location.search
    );

    const demonstracao =
        parametros.get("exemplo") === "1";

    if (demonstracao) {

        // Demonstração não pode ser salva.

        mostrarResultados({
            social: 35,
            cognitiva: 75,
            decisoria: 60,
            organizacional: 85,
            comportamental: 55
        }, 2, true);

    } else {

        const sessaoAtual = carregarVersao(2);

        const perfilSalvo = carregarPerfilSalvo();

        const sessaoAntiga = carregarVersao(1);

        const resultado =
            sessaoAtual || perfilSalvo || sessaoAntiga;

        if (resultado) {

            const origem = resultado === perfilSalvo
                ? "salvo"
                : "sessao";

            mostrarResultados(
                resultado.pontuacoes,
                resultado.versao
            );

            if (origem === "salvo") {

                statusEl.textContent +=
                    " Perfil recuperado do armazenamento deste navegador.";
            }

            mostrarControlesDeSalvamento(
                resultado,
                origem
            );

        } else {

            statusEl.textContent =
                "Nenhum resultado disponível. Conclua o questionário e clique em Salvar neste navegador para consultar seu perfil depois.";

            const leitura = document.getElementById(
                "overview-combination"
            );

            if (leitura) {

                leitura.textContent =
                    "Conclua o questionário para visualizar a leitura conjunta das dimensões.";
            }
        }
    }

})();
