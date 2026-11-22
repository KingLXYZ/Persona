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

  function gerar({ pontuacoes, formato = "completo" }) {
    if (!validar(pontuacoes)) throw new Error("Pontuações inválidas.");
    if (!["completo", "resumido"].includes(formato)) {
      throw new Error("Formato de cartão não reconhecido.");
    }

    // Formato vertical adequado para salvar e compartilhar em Stories.
    const largura = 1080;
    const altura = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Este navegador não suporta geração de imagem.");

    const fundo = ctx.createLinearGradient(0, 0, largura, altura);
    fundo.addColorStop(0, "#09090D");
    fundo.addColorStop(0.6, "#171022");
    fundo.addColorStop(1, "#251538");
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, largura, altura);

    ctx.strokeStyle = "#3C2A55";
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, largura - 116, altura - 116);

    ctx.fillStyle = "#BA93FF";
    ctx.font = "700 38px sans-serif";
    ctx.fillText("P.", 110, 166);
    ctx.fillStyle = "#F7F4FF";
    ctx.font = "700 36px sans-serif";
    ctx.fillText("PERSONA", 175, 166);

    ctx.fillStyle = "#A89ABF";
    ctx.font = "500 25px sans-serif";
    ctx.fillText("ALÉM DA SUPERFÍCIE", 110, 245);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 66px sans-serif";
    ctx.fillText(formato === "completo" ? "Meu perfil" : "Meu perfil em destaque", 110, 375);

    ctx.fillStyle = "#C0B3D0";
    ctx.font = "30px sans-serif";
    ctx.fillText(formato === "completo"
      ? "Cinco perspectivas sobre minhas respostas"
      : "Duas dimensões em destaque", 110, 440);

    const valores = DIMENSOES.map(([chave, nome], ordem) => ({
      chave, nome, ordem, valor: pontuacoes[chave]
    }));
    const exibidos = formato === "completo" ? valores :
      valores.slice().sort((a, b) => b.valor - a.valor || a.ordem - b.ordem).slice(0, 2);

    const inicio = formato === "completo" ? 585 : 690;
    const intervalo = formato === "completo" ? 210 : 340;
    exibidos.forEach((item, indice) => {
      const y = inicio + indice * intervalo;
      ctx.fillStyle = "#EAE3F6";
      ctx.font = "600 39px sans-serif";
      ctx.fillText(item.nome, 110, y);
      ctx.fillStyle = "#C39BFF";
      ctx.font = "700 45px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(String(item.valor), 965, y);
      ctx.textAlign = "left";

      ctx.fillStyle = "#392D4A";
      ctx.fillRect(110, y + 42, 855, 16);
      ctx.fillStyle = "#A77AF2";
      ctx.fillRect(110, y + 42, 855 * item.valor / 100, 16);
    });

    ctx.fillStyle = "#C8BDD6";
    ctx.font = "26px sans-serif";
    ctx.fillText("Indicadores exploratórios de 0 a 100", 110, 1700);
    ctx.fillStyle = "#AFA2C1";
    ctx.font = "24px sans-serif";
    ctx.fillText("Questionário experimental, não validado.", 110, 1750);
    ctx.fillText("As pontuações não representam habilidades ou diagnósticos.", 110, 1790);
    ctx.fillStyle = "#C39BFF";
    ctx.font = "25px sans-serif";
    ctx.fillText("kinglxyz.github.io/Persona", 110, 1840);
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
