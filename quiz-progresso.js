/* Persistência do progresso do questionário Persona.
   Mantém o formato de sessão e as regras de compatibilidade existentes. */
(() => {
  "use strict";

  function criar({ perguntas, perguntasPorId, revisoesPerguntas,
    versao, revisaoInstrumento, chaveProgresso, armazenamento,
    obterEstado, atualizarEstado }) {
    const VERSAO = versao;
    const REVISAO_INSTRUMENTO = revisaoInstrumento;
    const CHAVE_PROGRESSO = chaveProgresso;
    const sessionStorage = armazenamento;

  // Salva as respostas durante a sessão.
  function salvarProgresso() {
    const { atual, ordem, respostas, armazenamentoDisponivel } = obterEstado();
    if (!armazenamentoDisponivel) return false;

    try {
      sessionStorage.setItem(
        CHAVE_PROGRESSO,
        JSON.stringify({
          version: VERSAO,
          totalPerguntas: perguntas.length,
          revisaoInstrumento: REVISAO_INSTRUMENTO,
          revisoesPerguntas,
          atual,
          ordem,
          respostas
        })
      );

      return true;
    } catch (erro) {
      atualizarEstado({ armazenamentoDisponivel: false });

      console.warn(
        "PERSONA: não foi possível salvar o progresso.",
        erro
      );

      return false;
    }
  }

  // Migra apenas respostas com ID e revisão individual compatíveis.
  // Revisões metodológicas diferentes exigem análise antes de qualquer migração.
  function restaurarProgresso() {
    let { atual, ordem, respostas } = obterEstado();
    let bruto;
    try {
      bruto = sessionStorage.getItem(CHAVE_PROGRESSO);
    } catch (erro) {
      atualizarEstado({ armazenamentoDisponivel: false });
      console.warn("PERSONA: armazenamento indisponível.", erro);
      return;
    }
    if (!bruto) return;

    try {
      const dados = JSON.parse(bruto);
      const ids = perguntas.map(pergunta => pergunta.id);
      const legado = Array.isArray(dados.respostas);
      const respostasObjeto = dados.respostas !== null &&
        typeof dados.respostas === "object" &&
        !Array.isArray(dados.respostas);
      const revisoesObjeto = dados.revisoesPerguntas !== null &&
        typeof dados.revisoesPerguntas === "object" &&
        !Array.isArray(dados.revisoesPerguntas);
      const semMetadados = dados.revisaoInstrumento === undefined &&
        dados.revisoesPerguntas === undefined;
      const indiceValido = Number.isInteger(dados.atual) &&
        dados.atual >= 0 &&
        dados.atual < dados.totalPerguntas;

      if (
        dados.version !== VERSAO ||
        !Number.isInteger(dados.totalPerguntas) ||
        dados.totalPerguntas < 1 ||
        !indiceValido ||
        (!legado && !respostasObjeto) ||
        (!semMetadados && (
          dados.revisaoInstrumento !== REVISAO_INSTRUMENTO ||
          !revisoesObjeto
        ))
      ) {
        throw new Error("Progresso incompatível com a revisão do instrumento.");
      }

      // Sem metadados, somente o formato integral conhecido pode ser recuperado.
      if (semMetadados && (
        dados.totalPerguntas !== perguntas.length ||
        (legado && dados.respostas.length !== perguntas.length) ||
        (!legado && (
          Object.keys(dados.respostas).length !== ids.length ||
          !ids.every(id => Object.hasOwn(dados.respostas, id))
        ))
      )) {
        throw new Error("Progresso legado incompatível.");
      }

      if (legado && !semMetadados) {
        throw new Error("Respostas posicionais sem garantia de correspondência.");
      }

      const idsAnteriores = semMetadados
        ? ids
        : Object.keys(dados.revisoesPerguntas);
      const ordemAnterior = dados.ordem === undefined
        ? idsAnteriores.slice()
        : dados.ordem;

      if (
        !Array.isArray(ordemAnterior) ||
        ordemAnterior.length !== dados.totalPerguntas ||
        new Set(ordemAnterior).size !== ordemAnterior.length ||
        !ordemAnterior.every(id => idsAnteriores.includes(id)) ||
        (!semMetadados && (
          idsAnteriores.length !== dados.totalPerguntas ||
          !idsAnteriores.every(id =>
            Number.isInteger(dados.revisoesPerguntas[id]) &&
            dados.revisoesPerguntas[id] >= 1 &&
            Object.hasOwn(dados.respostas, id)
          )
        ))
      ) {
        throw new Error("Ordem ou identificadores incompatíveis.");
      }

      const anteriores = legado
        ? Object.fromEntries(ids.map((id, i) => [id, dados.respostas[i]]))
        : dados.respostas;
      if (!idsAnteriores.every(id => (
        anteriores[id] === null ||
        (Number.isInteger(anteriores[id]) &&
          anteriores[id] >= 1 && anteriores[id] <= 5)
      ))) {
        throw new Error("Respostas armazenadas inválidas.");
      }

      let respostasRevisadas = 0;
      respostas = Object.fromEntries(ids.map(id => {
        const compativel = Object.hasOwn(anteriores, id) &&
          (semMetadados || dados.revisoesPerguntas[id] === revisoesPerguntas[id]);
        if (!compativel && Object.hasOwn(anteriores, id) &&
            anteriores[id] !== null) respostasRevisadas++;
        return [id, compativel ? anteriores[id] : null];
      }));

      // Preserva a sequência existente e insere novas perguntas ao final.
      ordem = ordemAnterior.filter(id => perguntasPorId.has(id));
      ids.forEach(id => {
        if (!ordem.includes(id)) ordem.push(id);
      });

      const idAtualAnterior = ordemAnterior[dados.atual];
      atual = ordem.indexOf(idAtualAnterior);
      if (atual < 0) atual = 0;

      if (respostasRevisadas > 0) {
        const pendente = ordem.findIndex(id => respostas[id] === null);
        if (pendente !== -1) atual = pendente;
        atualizarEstado({ avisoMigracao: `O questionário foi atualizado. ${respostasRevisadas} resposta(s) precisam ser refeitas; as demais foram preservadas.` });
      }

      atualizarEstado({ atual, ordem, respostas, progressoRestaurado: true });
      // Atualiza os metadados da tentativa após recuperar o progresso.
      salvarProgresso();
    } catch (erro) {
      // Preserva a tentativa incompatível em vez de apagá-la.
      console.warn("PERSONA: progresso preservado, mas incompatível.", erro);
      atualizarEstado({ progressoIncompativel: true });
    }
  }


    return Object.freeze({ salvarProgresso, restaurarProgresso });
  }

  window.PersonaQuizProgresso = Object.freeze({ criar });
})();
