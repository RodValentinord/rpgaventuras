
import fitz  # PyMuPDF
import re
import json

def extrair_paragrafos(path_pdf):
    with fitz.open(path_pdf) as doc:
        texto = ""
        for i, page in enumerate(doc):
            if i < 14:
                continue  # pular as páginas introdutórias
            texto += page.get_text()

    # Separar blocos de parágrafos numerados
    blocos = re.split(r'\n(?=\d{1,3}\s*\n)', texto)
    paragrafos = []

    for bloco in blocos:
        match = re.match(r"(\d{1,3})\s*\n(.+)", bloco, re.DOTALL)
        if not match:
            continue

        id_paragrafo = int(match.group(1))
        texto_paragrafo = match.group(2).strip()

        # Detectar opções de seguimento
        opcoes = []
        for m in re.finditer(r"(.*?)vá para (\d+)", texto_paragrafo, re.IGNORECASE):
            texto_opcao = m.group(1).strip()
            destino = int(m.group(2))
            opcoes.append({
                "texto": texto_opcao,
                "destino": destino
            })

        # Detectar criaturas no parágrafo
        m_criatura = re.search(
            r"([A-ZÁÉÍÓÚÇÃÕÂÊÔ0-9\s'\-]{3,})\s+HABILIDADE\s+(\d+)\s+ENERGIA\s+(\d+)",
            texto_paragrafo,
            re.MULTILINE
        )

        criatura = None
        if m_criatura:
            criatura = {
                "nome": m_criatura.group(1).strip().title(),
                "habilidade": int(m_criatura.group(2)),
                "energia": int(m_criatura.group(3)),
            }

        paragrafos.append({
            "id": id_paragrafo,
            "texto": texto_paragrafo,
            "opcoes": opcoes,
            "criatura": criatura
        })

    return paragrafos

if __name__ == "__main__":
    resultado = extrair_paragrafos("fighting-fantasy-a-cripta-do-vampiro-biblioteca-elfica.pdf")
    with open("paragrafos_extraidos_v2.json", "w", encoding="utf-8") as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)
    print("Parágrafos extraídos com sucesso! Resultado salvo em 'paragrafos_extraidos_v2.json'")