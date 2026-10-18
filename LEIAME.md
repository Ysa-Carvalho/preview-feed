# Prévia do feed: como usar

> Regras detalhadas de nomes das artes, legendas e checklist de cada lote: **[COMO-PREENCHER.md](COMO-PREENCHER.md)**.

Site estático (HTML/CSS/JS puro, sem build). Os arquivos que importam:

| Arquivo | Para quê |
|---|---|
| `artes/` | As imagens dos posts |
| `legendas.txt` | As legendas, uma por número de post |
| `config.js` | Endpoint do Formspree, nome do perfil e formato da grade |
| `index.html`, `style.css`, `app.js` | A página em si (não precisa mexer) |

## 1. Colocar as artes

Coloque as imagens na pasta `artes/` (`.png` ou `.jpg`), seguindo este padrão:

- Post único: `post-05.png`
- Carrossel: `post-01-slide-1.png`, `post-01-slide-2.png`, `post-01-slide-3.png`…

O número sempre tem **dois dígitos** (`01`, `02`… `10`, `11`). A página encontra tudo sozinha e mostra o número mais alto primeiro. Ela para de procurar depois de 10 números seguidos sem arte, então não deixe um buraco maior que isso na numeração.

**Apague as artes de exemplo** que estão na pasta antes de mandar para o cliente.

## 2. Editar as legendas

Abra `legendas.txt` (Bloco de Notas serve). Cada legenda começa com o número do post entre colchetes, numa linha sozinha:

```
[05]
Agenda aberta para novembro. Link na bio 📅

[06]
Primeira linha
Segunda linha #hashtag
```

Pode usar várias linhas e emojis. Salve o arquivo em **UTF-8**, que é o padrão do Bloco de Notas.

## 3. Colar o endpoint do Formspree

1. Crie uma conta em [formspree.io](https://formspree.io) e crie um formulário ("New form") com o seu e-mail.
2. Copie o endpoint, algo como `https://formspree.io/f/abcdwxyz`.
3. Em `config.js`, troque `https://formspree.io/f/SEU_ID_AQUI` pelo seu endpoint. Ali também dá para mudar `NOME_PERFIL`.
4. Depois de publicar, faça um teste clicando em "Aprovar". Na primeira vez, o Formspree pode pedir para você confirmar o e-mail ou o formulário. Confirme e teste de novo.

Cada e-mail chega com: número do post, decisão (Aprovado ou Ajuste solicitado), texto do ajuste e tipo (post único ou carrossel).

## 4. Publicar no GitHub Pages

1. No GitHub, crie um repositório novo (ex.: `previa-nicolas`). Para o Pages gratuito, ele precisa ser **público**.
2. Na página do repositório, clique em **Add file → Upload files** e arraste **todo o conteúdo** desta pasta (`index.html`, `style.css`, `app.js`, `config.js`, `legendas.txt` e a pasta `artes`). Depois clique em **Commit changes**.
3. Vá em **Settings → Pages** (no menu da esquerda).
4. Em **Build and deployment → Source**, escolha **Deploy from a branch**. Em **Branch**, escolha `main` e a pasta `/ (root)`, e clique em **Save**.
5. Espere de 1 a 2 minutos e recarregue a página de Settings → Pages. O link aparece no topo: `https://SEU-USUARIO.github.io/previa-nicolas/`. É esse link que você manda para o cliente.

**Para atualizar** (artes novas, legendas corrigidas), faça o upload dos arquivos de novo pelo mesmo caminho. Arquivos com o mesmo nome são substituídos. A página no ar atualiza em 1 ou 2 minutos.

## Observações

- O link do GitHub Pages é público: qualquer pessoa que tiver o link vê as artes. Ele não aparece no Google (a página pede para não ser indexada), mas não tem senha.
- As marcações "Aprovado" e "Ajuste pedido" na grade ficam salvas só no navegador de quem respondeu. A resposta oficial é o e-mail.
- **Testar no seu computador:** abrir o `index.html` com dois cliques mostra as artes, mas não as legendas, porque o navegador bloqueia a leitura de arquivos locais. Para ver tudo, rode na pasta `python -m http.server` e abra `http://localhost:8000`, ou simplesmente teste já publicado.
