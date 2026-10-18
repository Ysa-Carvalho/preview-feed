(function () {
  "use strict";

  const C = Object.assign({
    FORMSPREE_ENDPOINT: "",
    NOME_PERFIL: "perfil",
    PROPORCAO_GRADE: "3 / 4",
    PASTA_ARTES: "artes",
    ARQUIVO_LEGENDAS: "legendas.txt",
    EXTENSOES: ["png", "jpg"],
    MAX_FALHAS_SEGUIDAS: 10,
    MAX_SLIDES: 20
  }, window.CONFIG || {});

  const $ = (id) => document.getElementById(id);
  const el = {
    grade: $("grade"), estado: $("estado"), progresso: $("progresso"),
    modal: $("modal"), titulo: $("modal-titulo"), fechar: $("fechar"),
    midia: $("midia"), trilho: $("trilho"), contador: $("contador"), bolinhas: $("bolinhas"),
    setaEsq: $("seta-esq"), setaDir: $("seta-dir"),
    legenda: $("legenda"), statusAtual: $("status-atual"),
    btnAprovar: $("btn-aprovar"), btnAjuste: $("btn-ajuste"),
    form: $("form-ajuste"), texto: $("texto-ajuste"), btnEnviar: $("btn-enviar-ajuste"),
    aviso: $("aviso")
  };

  // Um valor por carregamento da página: garante que artes trocadas apareçam
  // atualizadas, sem baixar a mesma imagem duas vezes na mesma visita.
  const VERSAO = Date.now();
  const CHAVE_RESPOSTAS = "previa-feed:respostas";

  let posts = [];
  let legendas = {};
  let atual = null;       // post aberto no modal
  let slideAtual = 0;

  // ------------------------------------------------------------------
  //  Descoberta das artes (o GitHub Pages não lista pastas, então
  //  testamos os nomes do padrão post-NN.png / post-NN-slide-K.png)
  // ------------------------------------------------------------------
  function carregarImagem(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function procurar(base) {
    const imgs = await Promise.all(C.EXTENSOES.map((ext) =>
      carregarImagem(`${C.PASTA_ARTES}/${base}.${ext}?v=${VERSAO}`)));
    const img = imgs.find(Boolean);
    return img ? { src: img.src, w: img.naturalWidth, h: img.naturalHeight } : null;
  }

  async function lerPost(n) {
    const nn = String(n).padStart(2, "0");
    const [unico, slide1] = await Promise.all([
      procurar(`post-${nn}`),
      procurar(`post-${nn}-slide-1`)
    ]);
    if (slide1) {
      const slides = [slide1];
      for (let k = 2; k <= C.MAX_SLIDES; k++) {
        const s = await procurar(`post-${nn}-slide-${k}`);
        if (!s) break;
        slides.push(s);
      }
      return { numero: n, rotulo: nn, slides };
    }
    return unico ? { numero: n, rotulo: nn, slides: [unico] } : null;
  }

  async function lerTodosOsPosts() {
    const LOTE = 8;
    const achados = [];
    let falhas = 0;
    for (let n = 1; falhas < C.MAX_FALHAS_SEGUIDAS; n += LOTE) {
      const lote = await Promise.all(Array.from({ length: LOTE }, (_, i) => lerPost(n + i)));
      for (const p of lote) {
        if (p) { achados.push(p); falhas = 0; } else { falhas++; }
      }
    }
    return achados;
  }

  // ------------------------------------------------------------------
  //  Legendas: blocos que começam com [01], [02]… numa linha sozinha
  // ------------------------------------------------------------------
  function interpretarLegendas(texto) {
    const mapa = {};
    let numero = null;
    let linhas = [];
    const guardar = () => { if (numero !== null) mapa[numero] = linhas.join("\n").trim(); };
    for (const linha of texto.replace(/\r/g, "").split("\n")) {
      const m = linha.trim().match(/^\[\s*(?:post\s*)?(\d+)\s*\]$/i);
      if (m) { guardar(); numero = parseInt(m[1], 10); linhas = []; }
      else if (numero !== null) linhas.push(linha);
    }
    guardar();
    return mapa;
  }

  async function lerLegendas() {
    try {
      const r = await fetch(`${C.ARQUIVO_LEGENDAS}?v=${VERSAO}`, { cache: "no-store" });
      if (!r.ok) throw new Error(r.status);
      return interpretarLegendas(await r.text());
    } catch (e) {
      console.warn("Não consegui ler o arquivo de legendas:", e);
      return {};
    }
  }

  // ------------------------------------------------------------------
  //  Respostas já dadas (lembradas só neste navegador)
  // ------------------------------------------------------------------
  function lerRespostas() {
    try { return JSON.parse(localStorage.getItem(CHAVE_RESPOSTAS)) || {}; }
    catch (e) { return {}; }
  }
  function salvarResposta(numero, resposta) {
    const todas = lerRespostas();
    todas[numero] = resposta;
    try { localStorage.setItem(CHAVE_RESPOSTAS, JSON.stringify(todas)); } catch (e) { /* sem armazenamento */ }
  }

  // ------------------------------------------------------------------
  //  Grade
  // ------------------------------------------------------------------
  const ICONE_CARROSSEL =
    '<svg class="ic-carrossel" viewBox="0 0 48 48" fill="#fff" aria-hidden="true"><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"/></svg>';

  function seloHtml(resposta) {
    if (!resposta) return "";
    return resposta.decisao === "Aprovado"
      ? '<span class="selo aprovado">✓ Aprovado</span>'
      : '<span class="selo ajuste">✎ Ajuste pedido</span>';
  }

  function desenharGrade() {
    const respostas = lerRespostas();
    el.grade.innerHTML = "";
    for (const p of posts) {
      const b = document.createElement("button");
      b.className = "tile";
      b.type = "button";
      b.setAttribute("aria-label",
        `Post ${p.rotulo}${p.slides.length > 1 ? `, carrossel com ${p.slides.length} slides` : ""}`);
      b.innerHTML =
        `<img src="${p.slides[0].src}" alt="">` +
        `<span class="num">${p.rotulo}</span>` +
        (p.slides.length > 1 ? ICONE_CARROSSEL : "") +
        seloHtml(respostas[p.numero]);
      b.addEventListener("click", () => abrir(p));
      el.grade.appendChild(b);
    }
    const feitos = posts.filter((p) => respostas[p.numero]).length;
    el.progresso.textContent = posts.length ? `${feitos} de ${posts.length} posts respondidos` : "";
  }

  // ------------------------------------------------------------------
  //  Modal
  // ------------------------------------------------------------------
  function preencherLegenda(texto) {
    el.legenda.innerHTML = "";
    if (!texto) {
      el.legenda.className = "legenda vazia";
      el.legenda.textContent = "Este post ainda não tem legenda.";
      return;
    }
    el.legenda.className = "legenda";
    const nome = document.createElement("strong");
    nome.textContent = C.NOME_PERFIL;
    el.legenda.append(nome);
    // Destaca #hashtags e @menções como no Instagram
    for (const parte of texto.split(/([#@][\p{L}\p{N}_.]+)/u)) {
      if (/^[#@][\p{L}\p{N}_.]+$/u.test(parte)) {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = parte;
        el.legenda.append(s);
      } else {
        el.legenda.append(document.createTextNode(parte));
      }
    }
  }

  function mostrarStatusAtual() {
    const r = lerRespostas()[atual.numero];
    if (!r) { el.statusAtual.hidden = true; return; }
    const quando = new Date(r.quando).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    el.statusAtual.innerHTML = `${seloHtml(r)} enviado em ${quando}. Você pode responder de novo se mudar de ideia.`;
    if (r.ajuste) {
      const t = document.createElement("span");
      t.className = "ajuste-texto";
      t.textContent = `“${r.ajuste}”`;
      el.statusAtual.append(t);
    }
    el.statusAtual.hidden = false;
  }

  function abrir(p) {
    atual = p;
    slideAtual = 0;
    el.titulo.textContent = `Post ${p.rotulo}`;

    const multi = p.slides.length > 1;
    el.midia.classList.toggle("multi", multi);
    el.midia.style.setProperty("--ar", `${p.slides[0].w} / ${p.slides[0].h}`);
    el.trilho.innerHTML = "";
    el.bolinhas.innerHTML = "";
    p.slides.forEach((s, i) => {
      const d = document.createElement("div");
      d.className = "slide";
      d.innerHTML = `<img src="${s.src}" alt="Post ${p.rotulo}, slide ${i + 1} de ${p.slides.length}" draggable="false">`;
      el.trilho.appendChild(d);
      const b = document.createElement("span");
      b.className = "bolinha";
      el.bolinhas.appendChild(b);
    });

    preencherLegenda(legendas[p.numero]);
    mostrarStatusAtual();
    fecharFormAjuste();

    el.modal.hidden = false;
    el.modal.scrollTop = 0;
    el.trilho.scrollLeft = 0;
    document.body.classList.add("travado");
    atualizarIndicadores();
    if (!(history.state && history.state.modal)) history.pushState({ modal: p.numero }, "");
    el.fechar.focus({ preventScroll: true });
  }

  function esconder() {
    el.modal.hidden = true;
    document.body.classList.remove("travado");
    atual = null;
  }

  // Fechar volta no histórico, para o botão "voltar" do celular também fechar o post
  function fechar() {
    if (history.state && history.state.modal) history.back();
    else esconder();
  }

  // ------------------------------------------------------------------
  //  Carrossel
  // ------------------------------------------------------------------
  function atualizarIndicadores() {
    const total = atual ? atual.slides.length : 0;
    el.contador.textContent = `${slideAtual + 1}/${total}`;
    [...el.bolinhas.children].forEach((b, i) => b.classList.toggle("ativa", i === slideAtual));
    el.setaEsq.disabled = slideAtual <= 0;
    el.setaDir.disabled = slideAtual >= total - 1;
  }

  function irPara(i, suave = true) {
    if (!atual) return;
    const alvo = Math.max(0, Math.min(atual.slides.length - 1, i));
    el.trilho.scrollTo({ left: alvo * el.trilho.clientWidth, behavior: suave ? "smooth" : "auto" });
  }

  el.trilho.addEventListener("scroll", () => {
    const w = el.trilho.clientWidth || 1;
    const i = Math.round(el.trilho.scrollLeft / w);
    if (i !== slideAtual) { slideAtual = i; atualizarIndicadores(); }
  }, { passive: true });

  el.setaEsq.addEventListener("click", () => irPara(slideAtual - 1));
  el.setaDir.addEventListener("click", () => irPara(slideAtual + 1));

  // Arrastar com o mouse no computador (no celular o dedo já desliza nativamente)
  let arraste = null;
  el.trilho.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || !atual || atual.slides.length < 2) return;
    arraste = { x: e.clientX, inicio: el.trilho.scrollLeft, slide: slideAtual };
    el.trilho.classList.add("arrastando");
    el.trilho.setPointerCapture(e.pointerId);
  });
  el.trilho.addEventListener("pointermove", (e) => {
    if (arraste) el.trilho.scrollLeft = arraste.inicio - (e.clientX - arraste.x);
  });
  function soltar(e) {
    if (!arraste) return;
    const dx = e.clientX - arraste.x;
    let i = arraste.slide;
    if (dx < -40) i++;
    else if (dx > 40) i--;
    arraste = null;
    el.trilho.classList.remove("arrastando");
    irPara(i);
  }
  el.trilho.addEventListener("pointerup", soltar);
  el.trilho.addEventListener("pointercancel", soltar);

  window.addEventListener("resize", () => { if (atual) irPara(slideAtual, false); });

  // ------------------------------------------------------------------
  //  Envio pelo Formspree
  // ------------------------------------------------------------------
  let avisoTimer;
  function avisar(msg, erro = false) {
    el.aviso.textContent = msg;
    el.aviso.classList.toggle("erro", erro);
    el.aviso.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => { el.aviso.hidden = true; }, erro ? 6000 : 3000);
  }

  function travarBotoes(sim) {
    el.btnAprovar.disabled = el.btnAjuste.disabled = el.btnEnviar.disabled = sim;
  }

  async function enviar(decisao, ajuste) {
    const p = atual;
    if (!C.FORMSPREE_ENDPOINT || C.FORMSPREE_ENDPOINT.includes("SEU_ID")) {
      avisar("O endpoint do Formspree ainda não foi configurado (arquivo config.js).", true);
      return;
    }
    const dados = {
      "Post": `Post ${p.rotulo}`,
      "Decisão": decisao,
      "Ajuste": ajuste || "—",
      "Tipo": p.slides.length > 1 ? `Carrossel (${p.slides.length} slides)` : "Post único",
      "Perfil": C.NOME_PERFIL,
      "_subject": `[${C.NOME_PERFIL}] Post ${p.rotulo}: ${decisao}`
    };
    travarBotoes(true);
    try {
      const r = await fetch(C.FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(dados)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      salvarResposta(p.numero, { decisao, ajuste: ajuste || "", quando: Date.now() });
      desenharGrade();
      avisar(decisao === "Aprovado" ? `Post ${p.rotulo} aprovado. Obrigado!` : `Pedido de ajuste do post ${p.rotulo} enviado.`);
      el.texto.value = "";
      fechar();
    } catch (e) {
      console.error(e);
      avisar("Não foi possível enviar. Confira a internet e tente de novo.", true);
    } finally {
      travarBotoes(false);
    }
  }

  function fecharFormAjuste() {
    el.form.hidden = true;
    el.btnAjuste.classList.remove("ativo");
  }

  el.btnAprovar.addEventListener("click", () => enviar("Aprovado"));
  el.btnAjuste.addEventListener("click", () => {
    const abrirForm = el.form.hidden;
    el.form.hidden = !abrirForm;
    el.btnAjuste.classList.toggle("ativo", abrirForm);
    if (abrirForm) {
      el.texto.focus({ preventScroll: true });
      el.form.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = el.texto.value.trim();
    if (!texto) { el.texto.focus(); return; }
    enviar("Ajuste solicitado", texto);
  });

  // ------------------------------------------------------------------
  //  Navegação e teclado
  // ------------------------------------------------------------------
  el.fechar.addEventListener("click", fechar);
  window.addEventListener("popstate", () => { if (!el.modal.hidden) esconder(); });
  document.addEventListener("keydown", (e) => {
    if (el.modal.hidden || e.target === el.texto) return;
    if (e.key === "Escape") fechar();
    else if (e.key === "ArrowRight") irPara(slideAtual + 1);
    else if (e.key === "ArrowLeft") irPara(slideAtual - 1);
  });

  // ------------------------------------------------------------------
  //  Início
  // ------------------------------------------------------------------
  async function iniciar() {
    if (history.state && history.state.modal) history.replaceState(null, "");
    document.documentElement.style.setProperty("--prop", C.PROPORCAO_GRADE);
    $("perfil-nome").textContent = C.NOME_PERFIL;

    const [achados, mapa] = await Promise.all([lerTodosOsPosts(), lerLegendas()]);
    posts = achados.sort((a, b) => b.numero - a.numero); // mais recente (número maior) primeiro
    legendas = mapa;

    el.estado.textContent = posts.length ? "" :
      `Nenhuma arte encontrada na pasta "${C.PASTA_ARTES}/". Confira os nomes (ex.: post-01.png ou post-01-slide-1.png).`;
    desenharGrade();
  }

  iniciar();
})();
