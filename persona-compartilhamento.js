/* PERSONA — Gerador local de cartões PNG.
   Módulo independente: não lê nem modifica o histórico.
   A integração à página de resultados será feita separadamente.
*/
(() => {
  "use strict";

  const DIMENSOES = [
    ["social", "Social"],
    ["cognitiva", "Cognitiva"],
    ["decisoria", "Decisória"],
    ["organizacional", "Organizacional"],
    ["comportamental", "Comportamental"]
  ];

  function validar(pontuacoes) {
    return pontuacoes && typeof pontuacoes === "object" &&
      DIMENSOES.every(([chave]) =>
        Number.isInteger(pontuacoes[chave]) &&
        pontuacoes[chave] >= 0 && pontuacoes[chave] <= 100);
  }

  // Estética híbrida: composição editorial com geometria futurista discreta.
  // As cinco pontuações continuam sendo apresentadas sem interpretações clínicas.
  function gerar({ pontuacoes, formato = "completo" }) {
    if (!validar(pontuacoes)) throw new Error("Pontuações inválidas.");
    if (!["completo", "resumido"].includes(formato)) {
      throw new Error("Formato de cartão não reconhecido.");
    }

    const largura = 1080;
    const altura = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Este navegador não suporta geração de imagem.");

    const cor = {
      fundo: "#09090e", fundoFinal: "#171021", branco: "#f5f2fb",
      roxo: "#bd9af9", roxoForte: "#9563e7", cinza: "#b7abc8",
      linha: "#453452", trilho: "#33283f"
    };

    function texto(conteudo, x, y, tamanho, peso = 400, preenchimento = cor.branco, alinhamento = "left") {
      ctx.fillStyle = preenchimento;
      ctx.font = `${peso} ${tamanho}px "Manrope", system-ui, sans-serif`;
      ctx.textAlign = alinhamento;
      ctx.fillText(conteudo, x, y);
      ctx.textAlign = "left";
    }

    function linha(x1, y1, x2, y2, preenchimento = cor.linha, espessura = 1) {
      ctx.beginPath();
      ctx.strokeStyle = preenchimento;
      ctx.lineWidth = espessura;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function circulo(x, y, raio, preenchimento) {
      ctx.beginPath();
      ctx.arc(x, y, raio, 0, Math.PI * 2);
      ctx.fillStyle = preenchimento;
      ctx.fill();
    }

    const fundo = ctx.createLinearGradient(0, 0, largura, altura);
    fundo.addColorStop(0, cor.fundo);
    fundo.addColorStop(0.7, "#100d17");
    fundo.addColorStop(1, cor.fundoFinal);
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, largura, altura);

    // Motivo geométrico no canto: linhas sutis, sem brilho excessivo.
    ctx.save();
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = "#4c3567";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(950, 240, 125 + i * 44, Math.PI * 0.82, Math.PI * 1.86);
      ctx.stroke();
    }
    ctx.restore();

    linha(92, 86, 988, 86);
    linha(92, 1832, 988, 1832);
    linha(92, 86, 92, 117, cor.roxo, 3);
    linha(988, 1802, 988, 1832, cor.roxo, 3);

    texto("P.", 112, 190, 58, 800, cor.roxo);
    texto("PERSONA", 193, 183, 32, 750);
    texto("EXPLORAÇÃO DE SI", 112, 250, 21, 600, cor.cinza);
    texto("01 / PERFIL", 112, 365, 20, 700, cor.roxo);

    const completo = formato === "completo";
    texto(completo ? "Meu perfil" : "Em destaque", 108, 474, 88, 750);
    texto(completo ? "Cinco dimensões. Diferentes perspectivas." :
      "Duas dimensões do meu perfil.", 112, 532, 27, 400, cor.cinza);
    linha(112, 585, 968, 585);

    const valores = DIMENSOES.map(([chave, nome], ordem) => ({
      chave, nome, ordem, valor: pontuacoes[chave]
    }));
    const exibidos = completo ? valores :
      valores.slice().sort((a, b) => b.valor - a.valor || a.ordem - b.ordem).slice(0, 2);

    const inicio = completo ? 696 : 770;
    const intervalo = completo ? 198 : 365;
    exibidos.forEach((item, indice) => {
      const y = inicio + indice * intervalo;
      texto(String(indice + 1).padStart(2, "0"), 112, y, 21, 650, cor.roxo);
      texto(item.nome, 173, y, completo ? 38 : 46, 600);
      texto(`${item.valor}`, 968, y + 1, completo ? 56 : 66, 700, cor.branco, "right");
      texto("/100", 968, y + 32, 18, 400, cor.cinza, "right");

      const barraY = y + 58;
      ctx.fillStyle = cor.trilho;
      ctx.fillRect(112, barraY, 856, 10);
      const larguraAtiva = 856 * item.valor / 100;
      if (larguraAtiva > 0) {
        const gradiente = ctx.createLinearGradient(112, 0, 968, 0);
        gradiente.addColorStop(0, cor.roxoForte);
        gradiente.addColorStop(1, cor.roxo);
        ctx.fillStyle = gradiente;
        ctx.fillRect(112, barraY, larguraAtiva, 10);
        circulo(112 + larguraAtiva, barraY + 5, 7, cor.roxo);
      }
      linha(112, barraY + 42, 968, barraY + 42, "#2a2234");
    });

    // Espaço de respiro editorial e identificação metodológica permanente.
    linha(112, 1590, 968, 1590);
    texto("LEITURA EXPLORATÓRIA", 112, 1640, 21, 700, cor.roxo);
    texto("Indicadores de 0 a 100; não medem capacidades.", 112, 1690, 25, 400, cor.cinza);
    texto("Questionário experimental, não validado.", 112, 1733, 24, 400, cor.cinza);
    texto("Não representa diagnóstico psicológico.", 112, 1774, 24, 400, cor.cinza);

    texto("kinglxyz.github.io/Persona", 112, 1880, 23, 550, cor.roxo);
    texto("P.", 968, 1890, 36, 800, cor.roxo, "right");
    return canvas;
  }

  function criarBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) :
        reject(new Error("Não foi possível gerar a imagem.")), "image/png");
    });
  }

  function baixar(blob, nome = "persona-meu-perfil.png") {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function compartilhar(blob, nome = "persona-meu-perfil.png") {
    if (!navigator.share || !navigator.canShare || typeof File === "undefined") {
      return false;
    }
    const arquivo = new File([blob], nome, { type: "image/png" });
    if (!navigator.canShare({ files: [arquivo] })) return false;
    await navigator.share({ files: [arquivo], title: "Meu perfil no Persona" });
    return true;
  }

  window.PersonaCompartilhamento = Object.freeze({
    gerar, criarBlob, baixar, compartilhar
  });
})();
