/* PERSONA — histórico e controles de privacidade. */
document.addEventListener("DOMContentLoaded", () => {
      "use strict";
      const lista = document.getElementById("journey-list");
      const contador = document.getElementById("journey-count");
      const mensagem = document.getElementById("journey-message");
      const anoAtualEl = document.getElementById("current-year");
      if (anoAtualEl) anoAtualEl.textContent = String(new Date().getFullYear());
      const dimensoes = [
        { chave: "social", nome: "Social" },
        { chave: "cognitiva", nome: "Cognitiva" },
        { chave: "decisoria", nome: "Decisória" },
        { chave: "organizacional", nome: "Organizacional" },
        { chave: "comportamental", nome: "Comportamental" }
      ];
      const rotulosAtuais = {
        social: ["Observação inicial", "Iniciativa social"],
        cognitiva: ["Concreta", "Abstrata"],
        decisoria: ["Impressão inicial", "Análise estruturada"],
        organizacional: ["Flexibilidade", "Planejamento"],
        comportamental: ["Reação imediata", "Pausa para avaliar"]
      };
      const rotulosAnteriores = {
        social: ["Reserva", "Expansividade"],
        decisoria: ["Valores e relações", "Análise de argumentos"]
      };
      const dataFormatador = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });
      function elemento(tag, classe, texto) {
        const no = document.createElement(tag);
        if (classe) no.className = classe;
        if (texto !== undefined) no.textContent = texto;
        return no;
      }
      function formatarData(iso) { return dataFormatador.format(new Date(iso)); }
      function montarDimensao(info, registro) {
        const pontuacao = registro.pontuacoes[info.chave];
        const extremos = (registro.versao === 1 && rotulosAnteriores[info.chave])
          ? rotulosAnteriores[info.chave] : rotulosAtuais[info.chave];
        const bloco = elemento("div", "journey-score");
        const linha = elemento("div", "journey-score-line");
        const nome = elemento("span", "journey-score-name", info.nome);
        const numero = elemento("span", "journey-score-value", String(pontuacao));
        numero.appendChild(elemento("small", "", " / 100"));
        linha.append(nome, numero);
        const medidor = elemento("div", "journey-meter");
        medidor.setAttribute("role", "meter");
        medidor.setAttribute("aria-label", `Indicador exploratório ${info.nome}`);
        medidor.setAttribute("aria-valuemin", "0");
        medidor.setAttribute("aria-valuemax", "100");
        medidor.setAttribute("aria-valuenow", String(pontuacao));
        const atual = registro.versao === 3 && registro.revisaoInstrumento === 2;
        medidor.setAttribute("aria-valuetext", atual ? `${pontuacao} de 100, em uma escala de ${extremos[0]} a ${extremos[1]}.` : `${pontuacao} de 100. Registro de uma aplicação anterior.`);
        const preenchimento = elemento("div", "journey-fill");
        preenchimento.style.width = `${pontuacao}%`;
        medidor.appendChild(preenchimento);
        const extremosLinha = elemento("div", "journey-extremes");
        extremosLinha.append(elemento("span", "", extremos[0]), elemento("span", "", extremos[1]));
        bloco.append(linha, medidor, extremosLinha);
        return bloco;
      }
      function montarRegistro(registro, indice) {
        const data = formatarData(registro.salvoEm);
        const cartao = elemento("article", "journey-card");
        const cabecalho = elemento("div", "journey-card-header");
        const info = elemento("div");
        info.append(
          elemento("span", "journey-index", `EXPLORAÇÃO ${String(indice + 1).padStart(2, "0")}`),
          elemento("h3", "", indice === 0 ? "Exploração mais recente" : "Exploração salva"),
          elemento("p", "journey-date", `Salva em ${data}`)
        );
        cabecalho.appendChild(info);
        const detalhes = elemento("details", "journey-details");
        const sumario = elemento("summary", "", "Consultar cinco dimensões");
        sumario.setAttribute("aria-label", `Consultar cinco dimensões da exploração ${indice + 1}, salva em ${data}`);
        detalhes.appendChild(sumario);
        const grade = elemento("div", "journey-score-grid");
        dimensoes.forEach(dim => grade.appendChild(montarDimensao(dim, registro)));
        detalhes.appendChild(grade);
        if (registro.versao === 3 && registro.revisaoInstrumento !== 2) {
          detalhes.appendChild(elemento("p", "journey-action-note",
            "Registro de uma aplicação anterior ou cuja estrutura original não pôde ser identificada. Suas pontuações foram preservadas, mas não devem ser comparadas diretamente com as do questionário atual."));
        } else if (registro.versao < 3) {
          detalhes.appendChild(elemento("p", "journey-action-note",
            "Este registro pertence a um questionário anterior. Evite comparar diretamente suas pontuações com as de aplicações recentes."));
        }
        const acoes = elemento("div", "journey-actions");
        const excluir = elemento("button", "journey-delete", "Excluir esta exploração");
        excluir.type = "button";
        excluir.setAttribute("aria-label", `Excluir esta exploração, salva em ${data}`);
        excluir.addEventListener("click", () => {
          if (!window.confirm(`Excluir do histórico a exploração salva em ${data}?\n\nEsta ação não pode ser desfeita. O perfil salvo na página de resultados não será apagado.`)) return;
          try {
            const removido = window.PersonaHistorico.excluir(registro.id);
            if (removido) {
              atualizarLista(`A exploração de ${data} foi excluída do histórico.`);
            } else {
              atualizarLista("Esta exploração não estava mais no histórico.");
            }
            document.getElementById("journey-section-title").focus();
          } catch (erro) {
            mensagem.textContent = "Não foi possível excluir o registro. O histórico não foi modificado.";
          }
        });
        acoes.append(excluir, elemento("p", "journey-action-note", "A exclusão afeta apenas este registro do histórico."));
        detalhes.appendChild(acoes);
        cartao.append(cabecalho, detalhes);
        return cartao;
      }
      const recuperarInvalidos = document.getElementById("journey-remove-invalid");
      if (recuperarInvalidos) recuperarInvalidos.addEventListener("click", () => {
        const quantidade = window.PersonaHistorico?.quantidadeIgnorada?.() || 0;
        if (!quantidade) return;
        if (!window.confirm(`Remover ${quantidade} registro(s) inválido(s) do histórico?\n\nAntes da remoção, será criada uma cópia dos dados originais neste navegador. Esta ação não afeta perfis salvos.`)) return;
        try {
          const resultado = window.PersonaHistorico.removerInvalidos();
          atualizarLista(`${resultado.removidos} registro(s) inválido(s) removido(s). Uma cópia dos dados originais foi preservada neste navegador.`);
          document.getElementById("journey-section-title").focus();
        } catch (erro) {
          mensagem.textContent = "Não foi possível recuperar o histórico. Os registros originais foram preservados.";
        }
      });
      function atualizarLista(aviso = "") {
        mensagem.textContent = aviso;
        lista.replaceChildren();
        if (!window.PersonaHistorico || typeof window.PersonaHistorico.listar !== "function") {
          contador.textContent = "Histórico indisponível";
          mensagem.textContent = "Não foi possível carregar o histórico. Confira se o módulo persona-historico.js está publicado.";
          return;
        }
        try {
          const registros = window.PersonaHistorico.listar();
          contador.textContent = registros.length === 1 ? "1 exploração salva" : `${registros.length} explorações salvas`;
          const ignorados = window.PersonaHistorico.quantidadeIgnorada?.() || 0;
          if (recuperarInvalidos) recuperarInvalidos.hidden = ignorados === 0;
          if (ignorados > 0) {
            mensagem.textContent = `${ignorados} registro(s) inválido(s) não foram exibidos. Os dados originais foram preservados. Use a recuperação para criar uma cópia antes de removê-los.`;
          }
          if (registros.length === 0) {
            const vazio = elemento("div", "journey-empty");
            vazio.append(
              elemento("h3", "", "Sua jornada começa com uma exploração."),
              elemento("p", "", "Você ainda não tem explorações neste histórico. Responda ao questionário e escolha salvar o resultado na página do seu perfil.")
            );
            lista.appendChild(vazio);
            return;
          }
          registros.forEach((registro, indice) => lista.appendChild(montarRegistro(registro, indice)));
        } catch (erro) {
          contador.textContent = "Histórico indisponível";
          mensagem.textContent = "Não foi possível ler os registros salvos. Por segurança, nenhum dado foi alterado ou excluído.";
        }
      }
      const CHAVES_EXCLUSAO = new Set([
        "persona_resultado_v1", "persona_resultado_v2", "persona_resultado_v3",
        "persona_perfil_salvo_v1", "persona_perfil_salvo_v3",
        "persona_historico_v1", "persona_progresso_v3"
      ]);
      function excluirDadosPersona(armazenamento) {
        const chaves = Object.keys(armazenamento).filter(chave =>
          CHAVES_EXCLUSAO.has(chave) || /^persona_backup_historico_[0-9]+$/.test(chave)
        );
        chaves.forEach(chave => armazenamento.removeItem(chave));
      }
      const apagarTudo = document.getElementById("journey-clear-all");
      if (apagarTudo) apagarTudo.addEventListener("click", () => {
        const aviso = "Apagar TODOS os dados do PERSONA neste navegador?\n\nSerão excluídos o histórico, seus backups, os perfis salvos, o progresso e os resultados temporários. Esta ação não pode ser desfeita e não afeta outros dispositivos.";
        if (!window.confirm(aviso)) return;
        try {
          for (const armazenamento of [localStorage, sessionStorage]) {
            excluirDadosPersona(armazenamento);
          }
          atualizarLista("Os dados identificados do Persona foram excluídos do armazenamento local e desta sessão.");
        } catch {
          mensagem.textContent = "Não foi possível concluir a exclusão. Alguns dados podem ter sido removidos; confira as permissões de armazenamento.";
        }
      });
      atualizarLista();
    });
