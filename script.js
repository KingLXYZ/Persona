
/* =========================================
   PERSONA — Página inicial
   Acesso ao perfil salvo neste navegador
========================================= */

// Ano automático no rodapé.

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// A página inicial permanece igual para quem
// ainda não salvou um perfil.

document.addEventListener("DOMContentLoaded", () => {

    const chave = "persona_perfil_salvo_v1";

    const dimensoes = [
        "social",
        "cognitiva",
        "decisoria",
        "organizacional",
        "comportamental"
    ];

    /* =====================================
       VALIDAR PERFIL SALVO
    ===================================== */

    function perfilValido(dados) {

        if (!dados || dados.formato !== 1) {
            return false;
        }

        if (dados.version !== 1 && dados.version !== 2) {
            return false;
        }

        const quantidadeEsperada =
            dados.version === 2 ? 30 : 20;

        if (dados.totalPerguntas !== quantidadeEsperada) {
            return false;
        }

        if (!dados.scores || typeof dados.scores !== "object") {
            return false;
        }

        return dimensoes.every(dimensao => {

            const valor = dados.scores[dimensao];

            return Number.isInteger(valor) &&
                   valor >= 0 &&
                   valor <= 100;
        });
    }

    /* =====================================
       PROCURAR RESULTADO NO NAVEGADOR
    ===================================== */

    let perfil = null;

    try {

        perfil = JSON.parse(
            localStorage.getItem(chave)
        );

    } catch (erro) {

        // Armazenamento indisponível.
        return;
    }

    if (!perfilValido(perfil)) {
        return;
    }

    /* =====================================
       ATUALIZAR BOTÃO PRINCIPAL
    ===================================== */

    const botaoPrincipal = document.querySelector(
        ".hero-content .primary-button"
    );

    if (!botaoPrincipal) {
        return;
    }

    botaoPrincipal.href = "resultado.html";

    botaoPrincipal.replaceChildren(
        document.createTextNode("Ver meu perfil "),
        document.createElement("span")
    );

    botaoPrincipal.querySelector("span").textContent = "→";

    /* =====================================
       CRIAR BOTÃO PARA REFAZER
    ===================================== */

    const botaoRefazer = document.createElement("a");

    botaoRefazer.href = "quiz.html";

    botaoRefazer.className = "secondary-button";

    botaoRefazer.textContent = "Refazer questionário →";

    /* =====================================
       ORGANIZAR OS DOIS BOTÕES
    ===================================== */

    const acoes = document.createElement("div");

    acoes.className = "hero-actions";

    acoes.style.display = "flex";
    acoes.style.flexWrap = "wrap";
    acoes.style.gap = "12px";
    acoes.style.alignItems = "center";

    botaoPrincipal.replaceWith(acoes);

    acoes.append(
        botaoPrincipal,
        botaoRefazer
    );

    /* =====================================
       MOSTRAR AVISO DE PERFIL SALVO
    ===================================== */

    const nota = document.querySelector(
        ".hero-content .hero-note"
    );

    if (nota) {

        const linha = nota.querySelector(".note-line");

        const mensagem = document.createElement("span");

        mensagem.textContent =
            "Seu perfil está salvo neste navegador.";

        if (linha) {

            nota.replaceChildren(linha, mensagem);

        } else {

            nota.replaceChildren(mensagem);
        }
    }

});
