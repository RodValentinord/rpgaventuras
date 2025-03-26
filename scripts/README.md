
# parse_livro_v2.py - Parser aprimorado de parágrafos do livro

Este script é uma versão aprimorada do parser original para o livro *A Cripta do Vampiro*. Ele lida melhor com páginas mistas (texto/imagem), ignora as introduções e reconhece parágrafos de combate com criaturas.

---

## O que há de novo nesta versão?

- Ignora automaticamente as **14 primeiras páginas** (introdução, capa, etc).
- Usa **regex mais robusta** para separar parágrafos corretamente.
- Detecta **criaturas com HABILIDADE e ENERGIA** em qualquer lugar do parágrafo.
- Funciona mesmo em PDFs com imagens misturadas ao texto.

---

## Exemplo de saída

```json
{
  "id": 136,
  "texto": "Uma grande sombra de repente escurece a passagem...",
  "opcoes": [
    { "texto": "Se você vencer,", "destino": 97 }
  ],
  "criatura": {
    "nome": "Rato Grande",
    "habilidade": 7,
    "energia": 8
  }
}
```

---

## Como usar

1. Instale a biblioteca necessária:

```bash
pip install pymupdf
```

2. Coloque o PDF com o nome:

```
fighting-fantasy-a-cripta-do-vampiro-biblioteca-elfica.pdf
```

3. Execute:

```bash
python parse_livro_v2.py
```

4. O resultado será salvo no arquivo:

```
paragrafos_extraidos_v2.json
```

---

## Observação

Mesmo que a página tenha imagens, se ela também tiver texto real (não rasterizado), o script funcionará. Se precisar lidar com OCR, isso pode ser adicionado no futuro.

> Desenvolvido por Rodolfo Valentino com auxílio do ChatGPT
