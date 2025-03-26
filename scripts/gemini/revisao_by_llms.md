# Estratégia de Revisão Automatizada de Texto em JSON utilizando LLMs

Este documento descreve uma estratégia para realizar a revisão e correção de parágrafos de um livro-jogo de RPG, estruturados em formato JSON. A ideia geral é aproveitar as capacidades de um modelo de linguagem (LLM, como o GPT da OpenAI) para analisar e corrigir campos textuais, mantendo a estrutura JSON intacta.

---

## 1. Visão Geral

O cenário é o seguinte:
- Você possui um arquivo JSON com centenas de parágrafos (por exemplo, `paragrafos_final.json`), onde cada elemento representa um trecho do livro-jogo.
- Cada parágrafo tem a seguinte estrutura básica (podendo ter mais campos):
  ```json
  {
    "id": <número>,
    "texto": "Texto do parágrafo...",
    "opcoes": [
      {
        "texto": "Texto da opção...",
        "destino": <número>
      }
    ],
    "criaturas": [],
    "acoesIntermediarias": [],
    "efeitosContinuosCombate": [],
    "itensAdquiridos": [],
    "decisaoCondicional": null
  }
  ```
- Você deseja:
  1. Revisar ortografia, concordância, pontuação e possíveis problemas de espaçamento nos campos textuais (ex.: `texto`, `opcoes[].texto`, etc.).
  2. **Manter** a estrutura e valores (IDs, destinos, nomes de criaturas) inalterados, apenas corrigindo o texto em si.

Para fazer isso, podem ser adotadas duas soluções principais:

1. **Abordagem local/offline**: criar um script em Python que aplique expressões regulares ou regras simples de limpeza de texto.
2. **Abordagem com API de LLM** (ex.: ChatGPT, GPT-4, etc.): enviar cada parágrafo para a API, receber a versão corrigida e armazenar no JSON final.

---

## 2. Fluxo com LLM (Exemplo com a API da OpenAI)

### 2.1. Estrutura do Script

Você pode criar um script em Python que:
1. Lê o arquivo JSON original (por ex. `paragrafos_final.json`).
2. Para cada parágrafo (cada objeto da lista):
   - Monta um **prompt** (instruções para o modelo) que inclua:
     - O objeto JSON do parágrafo.
     - Explicações de como ele deve ser corrigido.
     - Restrições para manter a estrutura JSON.
   - Envia esse prompt para a API (ex.: `openai.ChatCompletion.create`).
   - Recebe a resposta, que deve ser um JSON parseável com o mesmo formato, mas com os campos textuais revisados.
   - Faz `json.loads` da resposta (tratando exceções se ocorrer erro de parse).
   - Salva o dicionário resultante em uma lista de “parágrafos corrigidos”.
3. Ao final, escreve essa lista de parágrafos corrigidos em um novo arquivo JSON, por ex. `paragrafos_final_corrigido.json`.

### 2.2. Exemplo de Script em Python

Abaixo está um **exemplo** de como poderia ser feito. Ajuste conforme suas necessidades (nome do arquivo, chave de API, prompt, tempo de sleep, etc.):

```python
import openai
import json
import time

# Configure sua API Key
openai.api_key = "SUA_API_KEY_AQUI"

def corrigir_paragrafo_com_gpt(paragrafo):
    """
    Envia o JSON do parágrafo para a API e recebe uma versão corrigida.
    """
    # Prompt explicando como o modelo deve proceder
    prompt_inicial = f"""Você é um assistente treinado para revisar trechos de um livro-jogo de RPG em formato JSON. 

Receberá um objeto JSON com a seguinte estrutura:
---
{json.dumps(paragrafo, ensure_ascii=False, indent=2)}
---
Seu objetivo:
1. Manter a estrutura do JSON.
2. Revisar ortografia, pontuação, acentuação, concordância no campo 'texto' e em campos textuais de 'opcoes', 'criaturas', etc.
3. Não alterar IDs, referências numéricas, nem inventar ou excluir campos.
4. Devolver somente o JSON resultante, 100% parseável.

Por favor, retorne somente o objeto JSON corrigido (sem comentários adicionais).
"""

    # Exemplo usando GPT-3.5-turbo
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt_inicial}],
        temperature=0.2
    )

    # A resposta
    conteudo = response.choices[0].message["content"]
    return conteudo

def main():
    input_file = "paragrafos_final.json"
    output_file = "paragrafos_final_corrigido.json"

    # Lê o arquivo original
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    paragrafos_corrigidos = []

    for idx, paragrafo in enumerate(data, start=1):
        print(f"Processando parágrafo ID={paragrafo.get('id')}...")

        # Faz chamada ao GPT
        resposta_gpt = corrigir_paragrafo_com_gpt(paragrafo)

        # Tenta interpretar como JSON
        try:
            paragrafo_corrigido = json.loads(resposta_gpt)
        except json.JSONDecodeError:
            print("Erro de parse. Mantendo parágrafo original.")
            paragrafo_corrigido = paragrafo

        paragrafos_corrigidos.append(paragrafo_corrigido)

        # Opcional: aguarda 1 segundo entre requisições, p/ evitar rate limits
        time.sleep(1)

    # Salva o resultado corrigido
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(paragrafos_corrigidos, f, ensure_ascii=False, indent=2)

    print(f"Finalizado! Arquivo '{output_file}' gerado com {len(paragrafos_corrigidos)} parágrafos corrigidos.")

if __name__ == "__main__":
    main()
```

#### Observações
- O `prompt_inicial` contém as instruções de forma bem objetiva.  
- Use `temperature=0.2` ou outro valor pequeno para reduzir a chance de invenções do modelo.  
- Se o texto for muito grande (ex.: parágrafos enormes), pode haver risco de estourar o limite de tokens. Nesse caso, você pode fragmentar cada parágrafo ou usar GPT-4 (que tem janelas de contexto maiores).  

---

## 3. Exemplo de Prompt Detalhado

Um prompt mais completo e genérico, que você pode copiar e colar, seria algo como:

```
Você é um assistente treinado para revisar trechos de um livro-jogo de RPG em formato JSON. 

Receberá um objeto JSON com a seguinte estrutura (exemplo):
{
  "id": 1,
  "texto": "...",
  "opcoes": [
    {
      "texto": "...",
      "destino": 201
    }
  ],
  "criaturas": [],
  "acoesIntermediarias": [],
  "efeitosContinuosCombate": [],
  "itensAdquiridos": [],
  "decisaoCondicional": null
}

Seu objetivo:
1. Manter a estrutura do JSON exatamente igual: não renomeie ou exclua campos, nem adicione novos.
2. Revisar ortografia, pontuação, acentuação e concordância no campo "texto" e em todos os campos textuais (por exemplo, "opcoes[].texto", "criaturas[].nome").
3. Não alterar nomes de chaves, IDs, referências numéricas ("Vá para 201") ou valores que não sejam texto narrativo.
4. Não acrescente nada que não esteja no texto original, nem descreva explicações fora do JSON. 
5. Devolva somente o objeto JSON resultante, 100% parseável, sem texto adicional.

Por exemplo, se receber:
{
  "id": 1,
  "texto": "voc segue ate ...\nAtacarocavaleiro? vpara201",
  "opcoes": [
    { "texto": "Atacarocavaleiro? vpara201", "destino": 201 }
  ],
  "criaturas": [],
  "acoesIntermediarias": [],
  "efeitosContinuosCombate": [],
  "itensAdquiridos": [],
  "decisaoCondicional": null
}

Devolva algo como:
{
  "id": 1,
  "texto": "Você segue até... Atacar o Cavaleiro? Vá para 201",
  "opcoes": [
    { "texto": "Atacar o Cavaleiro? Vá para 201", "destino": 201 }
  ],
  "criaturas": [],
  "acoesIntermediarias": [],
  "efeitosContinuosCombate": [],
  "itensAdquiridos": [],
  "decisaoCondicional": null
}
```

---

## 4. Custos e Viabilidade

- **OpenAI GPT-3.5**: custo aproximado de \$0.0015/1k tokens (entrada) e \$0.002/1k tokens (saída).  
  - Para ~400 parágrafos, com ~300 tokens de entrada + 100 tokens de saída por parágrafo, pode ficar em torno de \$0.20–\$0.40 no total, dependendo do tamanho real dos parágrafos e do prompt.  

- **OpenAI GPT-4**: custo maior (cerca de \$0.03/1k tokens entrada e \$0.06/1k tokens saída), mas melhor qualidade.  
  - Pode custar \$4 a \$8 para 400 parágrafos, dependendo do volume de tokens.  

- **Outros Fornecedores** (Google Gemini, etc.):
  - Preços variam; às vezes nem estão disponíveis ao público geral.  

No geral, usando GPT-3.5-turbo, o custo para rodar 400 parágrafos costuma ser bastante acessível, desde que seus parágrafos não sejam imensos.

---

## 5. Conclusão

Esta estratégia combina:
1. **Formatação inicial em JSON**: cada parágrafo em um objeto com campos definidos.  
2. **Script em Python** que:
   - Lê cada objeto.
   - Chama a API de um modelo de linguagem (LLM).
   - Recebe a versão corrigida em JSON e parseia.
3. **Prompt bem definido** garantindo que o modelo entenda exatamente o que corrigir e o que não tocar.  
4. **Cuidado com tokens e custos**: medir e planejar o uso adequado do serviço de IA.  

Dessa forma, você mantém a estrutura do seu conteúdo, melhora a legibilidade e corrige inconsistências ortográficas/pontuais, sem precisar intervir manualmente em cada parágrafo.