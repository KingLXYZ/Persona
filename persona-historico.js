/* ============================================================
   PERSONA — Armazenamento local do histórico de explorações

   Módulo independente. NÃO salva nada automaticamente.
   O site deve chamar adicionar() somente após autorização
   explícita do visitante.

   Identificadores das versões são somente dados técnicos;
   não devem ser exibidos no conteúdo público do PERSONA.
   ============================================================ */
(() => {
  "use strict";

  const CHAVE = "persona_historico_v1";
  const FORMATO = 1;
  const DIMENSOES = [
    "social", "cognitiva", "decisoria", "organizacional", "comportamental"
  ];

  function pontuacoesValidas(pontuacoes) {
    return pontuacoes !== null &&
      typeof pontuacoes === "object" &&
      !Array.isArray(pontuacoes) &&
      DIMENSOES.every(chave =>
        Number.isInteger(pontuacoes[chave]) &&
        pontuacoes[chave] >= 0 && pontuacoes[chave] <= 100
      );
  }

  function copiarPontuacoes(pontuacoes) {
    return Object.fromEntries(DIMENSOES.map(chave => [chave, pontuacoes[chave]]));
  }

  function dataValida(valor) {
    return typeof valor === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(valor) &&
      Number.isFinite(Date.parse(valor));
  }

  function metadadosValidos(versao, totalPerguntas) {
    // Formatos de questionários já utilizados no PERSONA.
    return Number.isInteger(versao) && [1, 2, 3].includes(versao) &&
      totalPerguntas === (versao === 1 ? 20 : 30);
  }

  function registroValido(registro) {
    return registro && typeof registro === "object" && !Array.isArray(registro) &&
      typeof registro.id === "string" && registro.id.length >= 4 && registro.id.length <= 150 &&
      metadadosValidos(registro.versao, registro.totalPerguntas) &&
      pontuacoesValidas(registro.pontuacoes) && dataValida(registro.salvoEm);
  }

  function lerDocumento() {
    // Não cria chave nem altera dados durante a leitura.
    const bruto = localStorage.getItem(CHAVE);
    if (bruto === null) return { formato: FORMATO, registros: [] };

    let dados;
    try {
      dados = JSON.parse(bruto);
    } catch {
      throw new Error("O histórico local não pôde ser interpretado. Nenhum dado foi substituído.");
    }

    if (!dados || dados.formato !== FORMATO || !Array.isArray(dados.registros) ||
        !dados.registros.every(registroValido)) {
      throw new Error("O histórico local possui dados incompatíveis. Nenhum dado foi substituído.");
    }

    const ids = new Set(dados.registros.map(registro => registro.id));
    if (ids.size !== dados.registros.length) {
      throw new Error("Há identificadores duplicados no histórico. Nenhum dado foi substituído.");
    }
    return dados;
  }

  function criarId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `exploracao-${crypto.randomUUID()}`;
    }
    return `exploracao-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function copiarRegistro(registro) {
    return {
      id: registro.id,
      versao: registro.versao,
      totalPerguntas: registro.totalPerguntas,
      pontuacoes: copiarPontuacoes(registro.pontuacoes),
      salvoEm: registro.salvoEm
    };
  }

  /**
   * Obtém cópias dos registros, do mais recente para o mais antigo.
   * Não modifica o armazenamento.
   */
  function listar() {
    return lerDocumento().registros.map(copiarRegistro)
      .sort((a, b) => Date.parse(b.salvoEm) - Date.parse(a.salvoEm));
  }

  /** Busca uma exploração pelo identificador interno. */
  function obter(id) {
    const registro = lerDocumento().registros.find(item => item.id === id);
    return registro ? copiarRegistro(registro) : null;
  }

  /**
   * Registra UMA exploração após o visitante optar por salvá-la.
   * Entrada: { versao, pontuacoes, salvoEm?, id?, origem? }
   * - id opcional permite impedir duplicatas de uma mesma conclusão;
   * - salvoEm opcional permite preservar a data original de um perfil importado;
   * - exemplos fictícios não podem entrar no histórico.
   *
   * Retorna { id, criado }.
   */
  function adicionar(resultado) {
    if (!resultado || resultado.origem === "demonstracao" || resultado.demonstracao === true) {
      throw new Error("Somente explorações reais podem ser salvas no histórico.");
    }
    const versao = resultado.versao;
    const totalPerguntas = versao === 1 ? 20 : 30;
    const pontuacoes = resultado.pontuacoes;
    const salvoEm = resultado.salvoEm === undefined
      ? new Date().toISOString() : resultado.salvoEm;

    if (!metadadosValidos(versao, totalPerguntas) ||
        !pontuacoesValidas(pontuacoes) || !dataValida(salvoEm)) {
      throw new Error("O resultado não possui os dados necessários para o histórico.");
    }

    const documento = lerDocumento();
    const id = resultado.id === undefined ? criarId() : resultado.id;
    const novo = { id, versao, totalPerguntas, pontuacoes: copiarPontuacoes(pontuacoes), salvoEm };
    if (!registroValido(novo)) throw new Error("Identificador inválido para a exploração.");

    const existente = documento.registros.find(item => item.id === id);
    if (existente) {
      const mesmasPontuacoes = DIMENSOES.every(chave => existente.pontuacoes[chave] === pontuacoes[chave]);
      if (!mesmasPontuacoes || existente.versao !== versao || existente.salvoEm !== salvoEm) {
        throw new Error("Já existe uma exploração diferente com este identificador.");
      }
      return { id, criado: false };
    }

    // Uma nova chave é gravada apenas nesta ação explícita.
    documento.registros.push(novo);
    localStorage.setItem(CHAVE, JSON.stringify(documento));
    return { id, criado: true };
  }

  /** Remove somente o registro solicitado; não toca nos perfis atuais. */
  function excluir(id) {
    const documento = lerDocumento();
    const restantes = documento.registros.filter(item => item.id !== id);
    if (restantes.length === documento.registros.length) return false;
    documento.registros = restantes;
    if (restantes.length === 0) {
      localStorage.removeItem(CHAVE);
    } else {
      localStorage.setItem(CHAVE, JSON.stringify(documento));
    }
    return true;
  }

  /** Apaga somente o histórico. A confirmação fica a cargo da interface. */
  function excluirTudo() {
    localStorage.removeItem(CHAVE);
  }

  window.PersonaHistorico = Object.freeze({
    listar, obter, adicionar, excluir, excluirTudo
  });
})();
