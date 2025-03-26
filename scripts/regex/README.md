Parser com suporte a opções, criaturas, efeitos e decisões condicionais

Esta versão do script foi aprimorada com o apoio de uma análise inteligente feita por IA (ChatGPT), que complementa o parsing com uma etapa de pós-processamento que enriquece e corrige os dados extraídos diretamente do livro.

---

## ✨ Novidades da versão v9 + IA

- **Pós-processamento com IA:** limpeza, inferência de campos ausentes, correção de frases truncadas.
- **Novo campo `decisaoCondicional`:** identifica lógicas do tipo "Se tiver X, vá para Y. Senão, vá para Z".
- **Novo campo `efeitosContinuosCombate`:** extrai efeitos como drenagem de energia por turno.
- **Novo campo `transformacoesOuAflicoes`:** captura transformações como licantropia, maldições, etc.
- **Novo campo `efeitosNarrativos`:** estados como "você se sente revigorado", "refrescado", etc.
- **Normalização de `itensAdquiridos`:** extrai apenas o nome do item, removendo frases redundantes.
- **Correções automáticas em frases de opções quebradas ou cortadas.**

---

## 📦 Como usar

1. Instale as dependências (se ainda não tiver):
```bash
pip install pymupdf
```

2. Certifique-se de que o PDF está nomeado como:
```
fighting-fantasy-a-cripta-do-vampiro-biblioteca-elfica.pdf
```

3. Execute o script:
```bash
python parse_livro_v9.py
```

4. Em seguida, rode o pós-processamento (feito com auxílio da IA):
```bash
# (A etapa é integrada ou você pode usar o JSON final gerado pela IA)
```

---

## 🧠 Exemplo de saída

```json
{
  "id": 150,
  "texto": "Você se recupera do combate e se pergunta o que fazer a seguir...",
  "opcoes": [
    {
      "texto": "Prossiga para 222",
      "destino": 222
    }
  ],
  "criaturas": [],
  "itensAdquiridos": ["Espada Mágica"],
  "decisaoCondicional": {
    "condicao": "ter Espada Mágica",
    "verdadeiro": 173,
    "falso": 208
  },
  "transformacoesOuAflicoes": ["Você agora é um lobisomem"],
  "efeitosNarrativos": ["Você se sente revigorado"]
}
```

---

> Desenvolvido por Rodolfo Valentino para o projeto RPG de Texto Web.
