# README – Script de Revisão de Parágrafos em Lote Usando a API Gemini

Este documento descreve o funcionamento de um script que lê parágrafos de um arquivo JSON, envia cada parágrafo para a **API Gemini** (Google GenAI), recebe uma versão corrigida (ortografia, pontuação, concordância) e salva o resultado em um novo arquivo JSON. Todo o processo ocorre automaticamente, sem necessidade de intervenção manual.

---

## Objetivo

- **Ler** um arquivo contendo parágrafos em formato JSON (por exemplo, `paragrafos_final.json`).
- **Revisar** cada parágrafo chamando o modelo Gemini (ex.: “gemini-2.0-flash”), que corrige campos textuais, mantendo a estrutura e os IDs inalterados.
- **Salvar** a lista de parágrafos revisados em outro arquivo JSON (por exemplo, `paragrafos_final_corrigido.json`).

Isso permite corrigir centenas (ou milhares) de parágrafos em uma única execução, sem ter que aprovar cada um manualmente.

---

## Principais Componentes

1. **Arquivo de entrada** (`paragrafos_final.json`):
   - Lista de objetos JSON, cada um representando um parágrafo do livro-jogo.
   - Exemplo simplificado:
     ```json
     [
       {
         "id": 1,
         "texto": "Voc segui ate a floresta... \nAtacar o lobom?",
         "opcoes": [
           { "texto": "Lutar com lobo", "destino": 101 }
         ],
         "criaturas": [],
         "acoesIntermediarias": [],
         "efeitosContinuosCombate": [],
         "itensAdquiridos": [],
         "decisaoCondicional": null
       },
       {
         "id": 2,
         "texto": "Voce entra no castelo e percebe...",
         "opcoes": [...],
         ...
       }
     ]
     ```

2. **Script** (por exemplo, `revisar_rpg_gemini.py`):
   - Lê o JSON de entrada.
   - Para cada parágrafo, monta um prompt explicando ao modelo como corrigir o texto.
   - Recebe a resposta do modelo e tenta parseá-la como JSON.
   - Se der certo, adiciona o parágrafo corrigido à lista final; se não, mantém o parágrafo original.
   - Salva a lista resultante em `paragrafos_final_corrigido.json`.

3. **API Gemini**:
   - Precisa de uma **chave de API** (API Key) válida.
   - Permite configurar:
     - **Modelo** (ex.: `gemini-2.0-flash`, `gemini-2.0-flash-lite`, etc.).
     - **Temperature** e outros parâmetros de geração.

---

## Instruções de Uso

1. **Instalar dependências**:
   ```bash
   pip install google-genai
   ```
2. **Obter chave de API**:
   - Crie ou obtenha a chave de API do Google GenAI (Gemini).
   - Defina essa chave no script (por exemplo, na variável `API_KEY`).

3. **Configurar o script** (ex. `revisar_rpg_gemini.py`):
   - Ajuste as variáveis:
     - `API_KEY`: sua chave de API.
     - `MODEL_NAME`: o modelo desejado (ex.: `"gemini-2.0-flash"`).
     - `INPUT_FILE`: nome do arquivo JSON de entrada (p.ex. `"paragrafos_final.json"`).
     - `OUTPUT_FILE`: nome do arquivo JSON de saída (p.ex. `"paragrafos_final_corrigido.json"`).

4. **Executar**:
   ```bash
   python revisar_rpg_gemini.py
   ```
   - O script vai iterar sobre cada parágrafo, chamar a API Gemini, gerar correções e salvar o resultado.

5. **Verificar resultado**:
   - Após finalizar, o script gera `paragrafos_final_corrigido.json`.
   - Cada parágrafo terá o texto revisado, mantendo a estrutura intacta.

---

## Exemplo de Estrutura do Script

```python
import json
import time
from google import genai
from google.genai import types

API_KEY = "SUA_CHAVE_API"
MODEL_NAME = "gemini-2.0-flash"
INPUT_FILE = "paragrafos_final.json"
OUTPUT_FILE = "paragrafos_final_corrigido.json"

def revisar_paragrafo(paragrafo, client):
    prompt = f"""Você é um assistente treinado para revisar trechos de um livro-jogo de RPG em formato JSON.

Receberá um objeto JSON...
(segue detalhamento das instruções)

OBJETO:
{json.dumps(paragrafo, ensure_ascii=False)}

Instruções:
1. ...
2. ...
3. ...
4. ...
"""

    # Config
    config = types.GenerateContentConfig(temperature=0.0)
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=config
    )
    return response.text.strip()

def main():
    client = genai.Client(api_key=API_KEY)
    with open(INPUT_FILE, "r", encoding="utf-8") as fin:
        data = json.load(fin)

    corrigidos = []
    for idx, p in enumerate(data, start=1):
        resp_str = revisar_paragrafo(p, client)
        try:
            obj = json.loads(resp_str)
            corrigidos.append(obj)
        except json.JSONDecodeError:
            corrigidos.append(p)
        time.sleep(0.5)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as fout:
        json.dump(corrigidos, fout, ensure_ascii=False, indent=2)

    print(f"Finalizado, gerado {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
```

---

## Observações Importantes

- **Limites de tokens**: se os parágrafos forem muito grandes, confirme se a janela de contexto (1 milhão de tokens, etc.) é suficiente. Caso contrário, pode ser necessário fragmentar.
- **Custo**: cada requisição conta como tokens de **entrada** (prompt + JSON) e **saída** (resultado). Para ~400 parágrafos, o custo tende a ser alguns centavos até poucos dólares, dependendo do modelo e do tamanho de cada parágrafo.
- **Confiabilidade**:
  - Se o modelo não retornar JSON bem formatado, o script ignora a correção e mantém o original.  
  - Ajustar `temperature` (mais baixo = menos erros de formatação).
- **Personalização**:
  - Pode ajustar o prompt com especificidades (por exemplo, “padronize sempre a primeira letra das frases”, “não mexa em nomes próprios”, etc.).
  - Se quiser reprocessar parágrafos que falharam, basta rodar novamente ou filtrar especificamente.

---

## FAQ

1. **Posso usar GPT da OpenAI no lugar do Gemini?**  
   Sim, basta trocar as chamadas para a API e o prompt. O script em si seria similar, apenas mudando a biblioteca e a configuração de modelo.

2. **E se eu quiser aprovar cada parágrafo manualmente?**  
   Você precisaria inserir uma etapa de input do usuário ou criar uma interface. Mas o script proposto é 100% automático.

3. **Há risco de perda de informação ou ID?**  
   Se o prompt estiver correto e o modelo seguir as instruções, não. Ainda assim, mantenha backups para caso alguma correção não fique como esperado.

---

## Conclusão

Esse **script de batch processing** (ou “pipeline de inferência em lote”) elimina a necessidade de revisar manualmente cada parágrafo, permitindo corrigir facilmente centenas de trechos de texto em formato JSON, mantendo a estrutura original. 

Basta rodar o script e, ao final, verificar o arquivo corrigido. Se alguns trechos não ficarem ideais, é possível rodar novamente ou corrigir pontualmente.