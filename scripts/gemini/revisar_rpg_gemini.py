import json
import time
import os
from dotenv import load_dotenv

# Biblioteca do Gemini
from google import genai
from google.genai import types

def main():
    # 1) Carrega variáveis do arquivo .env
    load_dotenv()

    # 2) Lê as variáveis do ambiente
    API_KEY = os.getenv("API_KEY")
    MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.0-flash")
    INPUT_FILE = os.getenv("INPUT_FILE", "paragrafos_final.json")
    OUTPUT_FILE = os.getenv("OUTPUT_FILE", "paragrafos_final_corrigido.json")

    if not API_KEY:
        print("ERRO: Variável de ambiente API_KEY não encontrada. Verifique seu arquivo .env.")
        return

    # 3) Cria cliente do Gemini
    client = genai.Client(api_key=API_KEY)

    # 4) Carrega o JSON de entrada
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as fin:
            data = json.load(fin)
    except FileNotFoundError:
        print(f"ERRO: Arquivo '{INPUT_FILE}' não encontrado.")
        return

    if not isinstance(data, list):
        print("ERRO: O arquivo JSON deve conter uma lista de parágrafos.")
        return

    paragrafos_corrigidos = []
    total = len(data)
    print(f"Iniciando revisão de {total} parágrafos...")

    # 5) Loop principal
    for idx, paragrafo in enumerate(data, start=1):
        print(f"\nProcessando parágrafo {idx}/{total} (ID={paragrafo.get('id')}):")

        # Monta prompt
        prompt = f"""Você é um assistente treinado para revisar trechos de um livro-jogo de RPG em formato JSON.

Receberá um objeto JSON com a seguinte estrutura (exemplo):
{{
  "id": 123,
  "texto": "...",
  "opcoes": [...],
  "criaturas": [...],
  "acoesIntermediarias": [...],
  "efeitosContinuosCombate": [...],
  "itensAdquiridos": [...],
  "decisaoCondicional": null
}}

OBJETO a revisar:
---
{json.dumps(paragrafo, ensure_ascii=False, indent=2)}
---

Instruções:
1. Mantenha a estrutura exata do JSON, sem renomear ou remover campos.
2. Corrija ortografia, pontuação e concordância somente nos campos textuais
   como "texto", "opcoes[].texto", "criaturas[].nome".
3. Não altere IDs, números de referência, destinos ou valores que não sejam texto.
4. Retorne SOMENTE o objeto JSON resultante (100% parseável), sem texto adicional.
"""

        # Config de geração
        config = types.GenerateContentConfig(
            temperature=0.0  # Minimiza variações que possam quebrar JSON
        )

        # Chama API
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=config
        )

        # Resposta do modelo
        resposta_str = response.text.strip()

        # Tenta fazer parse de JSON
        try:
            corrigido = json.loads(resposta_str)
            paragrafos_corrigidos.append(corrigido)
            print("   -> Correção aplicada com sucesso.")
        except json.JSONDecodeError:
            # Mantém o original se não parsear
            paragrafos_corrigidos.append(paragrafo)
            print("   -> ERRO: JSON malformado. Mantendo original.")

        # Pausa para evitar limites de taxa
        time.sleep(0.3)

    # 6) Salva o resultado
    with open(OUTPUT_FILE, "w", encoding="utf-8") as fout:
        json.dump(paragrafos_corrigidos, fout, ensure_ascii=False, indent=2)

    print(f"\nProcesso concluído! Gerado '{OUTPUT_FILE}' contendo {len(paragrafos_corrigidos)} parágrafos.")


if __name__ == "__main__":
    main()
