
# parse_livro_v5.py - Parser com suporte a múltiplos tipos de opções

Esta versão do script foi atualizada para capturar opções de escolha mais diversas, além do clássico "Vá para N".

---

## ✨ Novidades

- Detecta opções que incluem:
  - Vá para 123
  - Volte para 88
  - Retorne para 97
  - Siga para 55
  - Dirija-se para 66
  - Prossiga para 32
- Mantém a detecção de criaturas (HABILIDADE e ENERGIA)
- Salva as opções com a frase completa extraída do texto, incluindo contexto
- Cria o arquivo `paragrafos_extraidos_v5.json`

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
python parse_livro_v5.py
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
  "criatura": null
}
```

---

> Desenvolvido por Rodolfo Valentino com suporte do ChatGPT para o projeto RPG de Texto Web.