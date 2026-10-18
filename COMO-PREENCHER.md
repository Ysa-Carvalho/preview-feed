# Como nomear as artes e preencher as legendas

A página não tem configuração post a post. Ela monta tudo **só pelos nomes dos arquivos** e pelos **números no `legendas.txt`**. Se os nomes estiverem certos, tudo aparece sozinho.

---

## Parte 1: Nomes das imagens

### Os dois únicos formatos

| Tipo de post | Nome do arquivo | Exemplo |
|---|---|---|
| Post único (1 imagem) | `post-NN.png` | `post-07.png` |
| Carrossel (2 ou mais) | `post-NN-slide-K.png` | `post-08-slide-1.png`, `post-08-slide-2.png`, `post-08-slide-3.png` |

- **NN** é o número do post, **sempre com 2 dígitos**: `01`, `02`… `09`, `10`, `11`… Acima de 99, use `100`, `101`…
- **K** é o número do slide, sem zero na frente: `slide-1`, `slide-2`… `slide-10`.
- A extensão pode ser `.png` ou `.jpg`.

### Regras que evitam 99% dos problemas

1. **Tudo em letra minúscula.** O GitHub diferencia maiúsculas: `Post-07.PNG` **não aparece**, `post-07.png` aparece.
2. **Sem espaços, acentos ou parênteses.** Use só letras minúsculas, números e hífen.
3. **Os slides começam no 1 e não pulam números.** Se existir `slide-1`, `slide-2` e `slide-4`, a página mostra só os slides 1 e 2. Ela para no primeiro número que falta.
4. **Um número, um formato.** Não deixe `post-07.png` e `post-07-slide-1.png` ao mesmo tempo. Se existirem os dois, vale o carrossel.
5. **Não deixe buracos grandes na numeração.** A página para de procurar depois de 10 números seguidos sem arte. Pular um ou outro número não tem problema.
6. **Mostre as extensões no Windows.** No Explorador, vá em **Exibir → Mostrar → Extensões de nomes de arquivos**. Sem isso, é fácil criar sem querer `post-07.png.png`, que não aparece.

### Ordem na grade

- **O número mais alto aparece primeiro**, no topo à esquerda, igual ao post mais recente no Instagram.
- Então numere **na ordem em que vai publicar**: o primeiro post a ir ao ar é o `01`, o seguinte é o `02`, e assim por diante.
- **Post novo = próximo número livre.** Se o último é o `12`, o novo é o `13`.
- **Para inserir um post no meio** (entre o `05` e o `06`), é preciso renumerar todos os posts dali para frente, **e as legendas junto**. Por isso, sempre que der, use o próximo número livre.

### Trocar uma arte depois do ajuste

Exporte a versão nova **com exatamente o mesmo nome** e suba de novo para a pasta `artes` no GitHub. Ela substitui a antiga, e o número, a legenda e a posição na grade continuam iguais.

- Se o ajuste **tirou um slide**, apague no GitHub o último slide que sobrou. Ex.: o carrossel tinha 4 slides e agora tem 3, então apague o `slide-4`.
- Se o ajuste **virou um post único em carrossel** (ou o contrário), apague no GitHub os arquivos do formato antigo.

### Dica: renomear rápido as exportações do Canva

O Canva exporta carrossel como `1.png`, `2.png`, `3.png`… Renomeie cada um para `post-NN-slide-1.png`, `post-NN-slide-2.png`… no Explorador (clique no arquivo → **F2** → digite o nome → Enter).
Não use o "renomear vários de uma vez" do Windows. Ele gera nomes como `post-08-slide (1).png`, com espaço e parênteses, e a página não reconhece.

---

## Parte 2: Legendas (`legendas.txt`)

### O formato

Cada legenda começa com o **número do post entre colchetes, numa linha sozinha**. Tudo o que vem abaixo, até o próximo número, é a legenda daquele post.

```
[07]
Primeira linha da legenda ✨
Segunda linha.

#hashtag1 #hashtag2

[08]
Legenda do carrossel 08 👉 arrasta pro lado
```

### Regras

1. **O número da legenda é o mesmo do arquivo:** `[07]` → `post-07.png`. `[08]` → `post-08-slide-1.png`, `post-08-slide-2.png`… Carrossel tem **uma legenda só**.
2. **O colchete fica sozinho na linha.** Nada antes nem depois dele na mesma linha.
3. `[7]` e `[07]` funcionam igual.
4. **Quebras de linha, linhas em branco, emojis, #hashtags e @menções aparecem como você escreveu.** Hashtags e menções ficam destacadas em azul, como no Instagram.
5. **Não comece uma linha da legenda com um número sozinho entre colchetes**, como `[1]`, porque a página acha que é outro post. Se precisar numerar itens, use `1.`, `1)` ou `1️⃣`.
6. **A ordem dos blocos no arquivo não importa,** mas manter em ordem crescente facilita encontrar.
7. **Post sem legenda** aparece na página como "Este post ainda não tem legenda.". Isso é útil para ver o que falta.
8. O texto **antes do primeiro número** (o cabeçalho do arquivo) é ignorado. Pode deixar anotações ali.
9. Limites do Instagram, para não ter surpresa na hora de publicar: **até 2.200 caracteres** e **até 30 hashtags** por legenda.

### Salvar

- No Bloco de Notas, **Arquivo → Salvar** já salva em UTF-8, então os emojis e acentos ficam certos. Se usar **Salvar como**, confira se a **Codificação** está em **UTF-8**.
- O nome do arquivo tem que continuar `legendas.txt`, na raiz do projeto (fora da pasta `artes`).
- **Edite sempre no mesmo lugar**: ou no seu computador (e sobe o arquivo), ou direto no GitHub (lápis ✏️). Se misturar os dois, uma versão apaga a outra.

### Ajuste pedido na legenda

Edite só o texto abaixo do número daquele post e suba o `legendas.txt` de novo. O número não muda.

---

## Rotina de cada lote (checklist)

1. ☐ Exportei as artes e renomeei: `post-NN.png` ou `post-NN-slide-K.png`, tudo minúsculo, slides sem pular número.
2. ☐ Os números continuam de onde parou o lote anterior.
3. ☐ Escrevi no `legendas.txt` um bloco `[NN]` para cada post novo.
4. ☐ Subi as imagens **dentro da pasta `artes`** no GitHub.
5. ☐ Subi o `legendas.txt` (ou editei direto no GitHub).
6. ☐ Esperei 1 a 2 minutos, abri o link e confirmei que tudo aparece: quantidade de posts, slides de cada carrossel e legendas.
7. ☐ Mandei o link para o cliente.

## Se algo não aparecer

| O que acontece | Causa provável |
|---|---|
| Nenhuma arte aparece | A pasta `artes` não subiu, ou o site ainda está publicando (espere 2 minutos) |
| Um post específico não aparece | Nome errado: maiúscula, espaço, extensão dupla ou número com 1 dígito (`post-7`) |
| Carrossel mostra menos slides | Algum slide no meio está faltando ou com nome diferente |
| Carrossel inteiro não aparece | Falta o `slide-1` (a contagem tem que começar no 1) |
| Legenda não aparece | Número do colchete diferente do arquivo, ou algo escrito na mesma linha do colchete |
| Legenda aparece no post errado | Número do colchete trocado |
| Acentos/emojis estranhos | O arquivo não foi salvo em UTF-8 |
