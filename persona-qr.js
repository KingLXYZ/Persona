/* ==========================================================
   PERSONA — transferência local de um perfil por QR Code
   - Sem cadastro, banco de dados, servidor de transferência
     ou serviços de QR Code externos.
   - O fragmento do link transporta dados NÃO criptografados.
   - A importação depende de confirmação explícita.
   - Não altera o perfil principal existente no dispositivo.
   ========================================================== */
(() => {
  "use strict";

  const FRAGMENTO = "#persona-transfer=";
  const CAMPOS = ["social", "cognitiva", "decisoria", "organizacional", "comportamental"];
  const NOMES = ["Social", "Cognitiva", "Decisória", "Organizacional", "Comportamental"];
  const ARQUIVO_SESSAO = { 1: "persona_resultado_v1", 2: "persona_resultado_v2", 3: "persona_resultado_v3" };
  const dataFormato = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
  let importado = null;

  function el(tag, cls, texto) {
    const no = document.createElement(tag);
    if (cls) no.className = cls;
    if (texto !== undefined) no.textContent = texto;
    return no;
  }
  function botao(texto, classe, acao) {
    const btn = el("button", classe, texto);
    btn.type = "button";
    btn.addEventListener("click", acao);
    return btn;
  }
  function mensagem(texto) {
    const no = document.getElementById("journey-message");
    if (no) no.textContent = texto;
  }
  function validar(registro) {
    return registro && typeof registro === "object" && !Array.isArray(registro) &&
      typeof registro.id === "string" && registro.id.length >= 4 && registro.id.length <= 150 &&
      [1,2,3].includes(registro.versao) &&
      (registro.revisaoInstrumento === undefined ||
        (registro.versao === 3 && Number.isInteger(registro.revisaoInstrumento) && registro.revisaoInstrumento >= 1)) &&
      typeof registro.salvoEm === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(registro.salvoEm) &&
      Number.isFinite(Date.parse(registro.salvoEm)) &&
      Array.isArray(registro.valores) && registro.valores.length === 5 &&
      registro.valores.every(v => Number.isInteger(v) && v >= 0 && v <= 100);
  }
  function empacotar(registro) {
    // Campos curtos: QR menor e mais fácil de escanear.
    const dados = { i: registro.id, v: registro.versao, t: registro.salvoEm, p: CAMPOS.map(k => registro.pontuacoes[k]) };
    if (registro.revisaoInstrumento !== undefined) dados.r = registro.revisaoInstrumento;
    return btoa(JSON.stringify(dados)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function desempacotar(token) {
    if (!/^[A-Za-z0-9_-]{40,1300}$/.test(token)) throw new Error("Código inválido ou muito longo.");
    const s = token.replace(/-/g, "+").replace(/_/g, "/");
    let o;
    try { o = JSON.parse(atob(s)); } catch { throw new Error("Não foi possível interpretar o QR Code."); }
    const dados = { id: o && o.i, versao: o && o.v, salvoEm: o && o.t, valores: o && o.p, revisaoInstrumento: o && o.r };
    if (!validar(dados)) throw new Error("O QR Code não contém um perfil compatível.");
    return {
      id: dados.id, versao: dados.versao, salvoEm: dados.salvoEm,
      ...(dados.revisaoInstrumento === undefined ? {} : { revisaoInstrumento: dados.revisaoInstrumento }),
      pontuacoes: Object.fromEntries(CAMPOS.map((k,i) => [k, dados.valores[i]]))
    };
  }
  function qrCanvas(url) {
    const codigo = new PERSONA_QR_LIB.QRCode(-1, PERSONA_QR_LIB.ErrorCorrect.M);
    codigo.addData(url);
    codigo.make();
    const n = codigo.getModuleCount();
    const margem = 4;
    const unidade = Math.max(3, Math.ceil(320 / (n + margem * 2)));
    const canvas = el("canvas", "persona-qr-img");
    canvas.width = (n + margem * 2) * unidade;
    canvas.height = canvas.width;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Código QR para abrir seu perfil no outro dispositivo");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Este navegador não conseguiu desenhar o código.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    for (let y=0; y<n; y++) for (let x=0; x<n; x++) {
      if (codigo.isDark(y,x)) ctx.fillRect((x+margem)*unidade, (y+margem)*unidade, unidade, unidade);
    }
    return canvas;
  }
  function dialogo(titulo) {
    const d = el("dialog", "persona-qr-dialog");
    d.setAttribute("aria-label", titulo);
    const h = el("h2", "", titulo);
    d.appendChild(h);
    d.addEventListener("close", () => { d.remove(); });
    document.body.appendChild(d);
    if (typeof d.showModal === "function") d.showModal();
    else { d.open = true; }
    return d;
  }
  function mostrarQR() {
    if (!window.PersonaHistorico || !window.PersonaHistorico.listar) {
      mensagem("O sistema de histórico não está disponível.");
      return;
    }
    try {
      const registros = window.PersonaHistorico.listar();
      if (!registros.length) {
        mensagem("Salve primeiro um resultado em Meu perfil para transferi-lo pelo QR Code.");
        return;
      }
      const recente = registros[0];
      const url = new URL("minha-jornada.html", document.baseURI);
      url.search = "";
      url.hash = FRAGMENTO + empacotar(recente);
      const d = dialogo("Enviar perfil por QR Code");
      d.appendChild(el("p", "", `Perfil salvo em ${dataFormato.format(new Date(recente.salvoEm))}. Escaneie este código com a câmera do outro dispositivo.`));
      d.appendChild(qrCanvas(url.href));
      d.appendChild(el("p", "", "O código contém suas cinco pontuações e a data, sem criptografia. Compartilhe apenas com quem deseja mostrar seu perfil."));
      const link = el("input", "persona-qr-link");
      link.type = "text";
      link.readOnly = true;
      link.setAttribute("aria-label", "Link do seu perfil para copiar");
      link.value = url.href;
      link.addEventListener("focus", () => link.select());
      d.appendChild(link);
      const status = el("p", "persona-qr-status");
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      const acoes = el("div", "persona-qr-actions");
      acoes.append(
        botao("Copiar link", "persona-qr-btn", async () => {
          try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("sem permissão");
            await navigator.clipboard.writeText(url.href);
            status.textContent = "Link copiado. Ele contém os dados do perfil; não compartilhe publicamente.";
          } catch {
            link.focus(); link.select();
            status.textContent = "Link selecionado. Use Copiar no navegador para copiá-lo.";
          }
        }),
        botao("Fechar", "persona-qr-ghost", () => d.close())
      );
      d.append(status, acoes);
    } catch (e) {
      mensagem("Não foi possível gerar o QR Code. Nenhum dado foi alterado. " + (e.message || ""));
      document.querySelectorAll("dialog.persona-qr-dialog").forEach(d => d.close());
    }
  }
  function irParaPerfil(registro) {
    try {
      sessionStorage.setItem(ARQUIVO_SESSAO[registro.versao], JSON.stringify({
        version: registro.versao, totalPerguntas: registro.versao === 1 ? 20 : 30,
        scores: registro.pontuacoes, historicoId: registro.id,
        ...(registro.revisaoInstrumento === undefined ? {} : { revisaoInstrumento: registro.revisaoInstrumento })
      }));
    } catch {
      mensagem("O navegador bloqueou a visualização temporária deste perfil.");
      return;
    }
    location.assign(`resultado.html?versao=${registro.versao}`);
  }
  function previsualizacao(registro) {
    const grid = el("div", "persona-qr-preview");
    CAMPOS.forEach((k,i) => {
      grid.append(el("span", "", NOMES[i]), el("strong", "", `${registro.pontuacoes[k]}/100`));
    });
    return grid;
  }
  function receberQR() {
    if (!location.hash.startsWith(FRAGMENTO)) return;
    const token = location.hash.slice(FRAGMENTO.length);
    // Fragmentos não são enviados no HTTP, mas também evitamos
    // deixá-los no histórico do navegador após sua leitura.
    try { history.replaceState(history.state, "", location.pathname + location.search); } catch {}
    let registro;
    try { registro = desempacotar(token); }
    catch (e) { mensagem("Link de transferência inválido: " + e.message); return; }
    const d = dialogo("Receber perfil no PERSONA");
    d.appendChild(el("p", "", `Resultado de ${dataFormato.format(new Date(registro.salvoEm))}. Confira as pontuações antes de salvar neste dispositivo.`));
    d.appendChild(previsualizacao(registro));
    d.appendChild(el("p", "", "Importar salva este resultado somente na Minha jornada deste navegador. Não apaga seus resultados anteriores nem atualiza automaticamente o perfil principal."));
    if (registro.versao === 1) d.appendChild(el("p", "", "Este resultado veio de um questionário anterior; não compare diretamente as pontuações com as atuais."));
    const status = el("p", "persona-qr-status");
    status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    const acoes = el("div", "persona-qr-actions");
    const cancelar = botao("Cancelar", "persona-qr-ghost", () => d.close());
    const confirmar = botao("Salvar na Minha jornada", "persona-qr-btn", () => {
      try {
        if (!window.PersonaHistorico || typeof window.PersonaHistorico.adicionar !== "function") {
          throw new Error("Histórico local indisponível.");
        }
        const resultado = window.PersonaHistorico.adicionar(registro);
        importado = registro;
        status.textContent = resultado.criado
          ? "Perfil importado! Ele está salvo neste dispositivo."
          : "Este perfil já estava salvo neste dispositivo.";
        acoes.replaceChildren(
          botao("Ver perfil completo", "persona-qr-btn", () => irParaPerfil(registro)),
          botao("Ver Minha jornada", "persona-qr-ghost", () => location.reload())
        );
      } catch (e) {
        status.textContent = "Não foi possível salvar este perfil. Nenhum registro existente foi apagado. " + (e.message || "");
      }
    });
    acoes.append(confirmar, cancelar);
    d.append(status, acoes);
    d.addEventListener("close", () => { if (importado) location.reload(); });
  }
  function iniciar() {
    if (!document.querySelector("#journey-list")) return;
    const lista = document.getElementById("journey-list");
    const section = lista.closest("section");
    if (section && !document.getElementById("persona-qr-box")) {
      const box = el("div", "persona-qr-box");
      box.id = "persona-qr-box";
      box.append(
        el("h3", "", "Seu perfil, em outro dispositivo."),
        el("p", "", "Transfira a exploração salva mais recente para o celular ou computador. Sem cadastro e sem enviar seus dados a um servidor de transferência."),
        botao("Gerar QR Code", "persona-qr-btn", mostrarQR)
      );
      section.insertBefore(box, document.getElementById("journey-message"));
    }
    receberQR();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
})();
