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

  // Registros antigos não possuem revisão explícita: continuam válidos como legado.
  function revisaoValida(registro) {
    return registro.revisaoInstrumento === undefined ||
      (registro.versao === 3 && Number.isInteger(registro.revisaoInstrumento) &&
       registro.revisaoInstrumento >= 1);
  }

  function registroValido(registro) {
    return registro && typeof registro === "object" && !Array.isArray(registro) &&
      typeof registro.id === "string" && registro.id.length >= 4 && registro.id.length <= 150 &&
      metadadosValidos(registro.versao, registro.totalPerguntas) &&
      revisaoValida(registro) && pontuacoesValidas(registro.pontuacoes) && dataValida(registro.salvoEm);
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
      ...(registro.revisaoInstrumento === undefined ? {} : { revisaoInstrumento: registro.revisaoInstrumento }),
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
    // A leitura tolera registros isolados inválidos, sem regravar o arquivo.
    const bruto = localStorage.getItem(CHAVE);
    if (bruto === null) return [];
    let dados;
    try {
      dados = JSON.parse(bruto);
    } catch {
      throw new Error("O histórico local não pôde ser interpretado.");
    }
    if (!dados || dados.formato !== FORMATO || !Array.isArray(dados.registros)) {
      throw new Error("O formato do histórico é incompatível.");
    }
    const ids = new Set();
    return dados.registros.filter(registro => {
      if (!registroValido(registro) || ids.has(registro.id)) return false;
      ids.add(registro.id);
      return true;
    }).map(copiarRegistro)
      .sort((a, b) => Date.parse(b.salvoEm) - Date.parse(a.salvoEm));
  }

  function quantidadeIgnorada() {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto === null) return 0;
    const dados = JSON.parse(bruto);
    if (!dados || dados.formato !== FORMATO || !Array.isArray(dados.registros)) return 0;
    return dados.registros.length - listar().length;
  }

  /**
   * Remove somente entradas inválidas ou com IDs repetidos, mediante confirmação
   * na interface. Antes de alterar o histórico, guarda uma cópia integral do JSON.
   * Formatos inteiramente ilegíveis/incompatíveis não são modificados.
   */
  function removerInvalidos() {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto === null) return { removidos: 0, preservados: 0, backup: null };

    let dados;
    try {
      dados = JSON.parse(bruto);
    } catch {
      throw new Error("Histórico ilegível: não é seguro remover registros automaticamente.");
    }
    if (!dados || dados.formato !== FORMATO || !Array.isArray(dados.registros)) {
      throw new Error("Formato do histórico incompatível: os dados foram preservados.");
    }

    const ids = new Set();
    const validos = dados.registros.filter(registro => {
      if (!registroValido(registro) || ids.has(registro.id)) return false;
      ids.add(registro.id);
      return true;
    });
    const removidos = dados.registros.length - validos.length;
    if (removidos === 0) return { removidos: 0, preservados: validos.length, backup: null };

    // Não altera o original se não conseguir criar o backup.
    const backup = `persona_backup_historico_${Date.now()}`;
    localStorage.setItem(backup, bruto);
    // Preserva o documento original mesmo quando a gravação falhar.
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ formato: FORMATO, registros: validos }));
    } catch (erro) {
      throw new Error("Backup criado, mas não foi possível atualizar o histórico.");
    }
    return { removidos, preservados: validos.length, backup };
  }

  /** Busca uma exploração pelo identificador interno. */
  function obter(id) {
    const registro = lerDocumento().registros.find(item => item.id === id);
    return registro ? copiarRegistro(registro) : null;
  }

  /**
   * Registra UMA exploração após o visitante optar por salvá-la.
   * Entrada: { versao, pontuacoes, revisaoInstrumento?, salvoEm?, id?, origem? }
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
    const revisaoInstrumento = resultado.revisaoInstrumento;
    const salvoEm = resultado.salvoEm === undefined
      ? new Date().toISOString() : resultado.salvoEm;

    if (!metadadosValidos(versao, totalPerguntas) ||
        !pontuacoesValidas(pontuacoes) || !dataValida(salvoEm)) {
      throw new Error("O resultado não possui os dados necessários para o histórico.");
    }

    const documento = lerDocumento();
    const id = resultado.id === undefined ? criarId() : resultado.id;
    const novo = {
      id, versao, totalPerguntas, pontuacoes: copiarPontuacoes(pontuacoes), salvoEm,
      ...(revisaoInstrumento === undefined ? {} : { revisaoInstrumento })
    };
    if (!registroValido(novo)) throw new Error("Identificador inválido para a exploração.");

    const existente = documento.registros.find(item => item.id === id);
    if (existente) {
      const mesmasPontuacoes = DIMENSOES.every(chave => existente.pontuacoes[chave] === pontuacoes[chave]);
      if (!mesmasPontuacoes || existente.versao !== versao || existente.salvoEm !== salvoEm ||
          existente.revisaoInstrumento !== revisaoInstrumento) {
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
    listar, quantidadeIgnorada, removerInvalidos, obter, adicionar, excluir, excluirTudo
  });
})();
