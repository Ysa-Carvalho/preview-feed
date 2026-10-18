// =====================================================================
//  CONFIGURAÇÃO — é só editar os valores entre aspas abaixo.
// =====================================================================
window.CONFIG = {
  // 👉 COLE AQUI o endpoint do seu formulário no Formspree
  //    (fica em formspree.io → seu formulário → "Integration").
  FORMSPREE_ENDPOINT: "https://formspree.io/f/mgaoqwpe",

  // Nome do perfil que aparece no topo da página e antes da legenda.
  NOME_PERFIL: "nickbargiela",

  // Proporção dos quadrados da grade. O Instagram hoje mostra o perfil
  // em retângulos "3 / 4". Para quadrados clássicos, troque por "1 / 1".
  PROPORCAO_GRADE: "3 / 4",

  // --- Normalmente não precisa mexer daqui pra baixo ---
  PASTA_ARTES: "artes",
  ARQUIVO_LEGENDAS: "legendas.txt",
  EXTENSOES: ["png", "jpg"],
  MAX_FALHAS_SEGUIDAS: 10, // para de procurar após 10 números seguidos sem arte
  MAX_SLIDES: 20,
};
