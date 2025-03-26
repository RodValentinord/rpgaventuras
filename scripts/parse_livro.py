import fitz  # PyMuPDF
import re
import json
from collections import defaultdict

def extrair_paragrafos(path_pdf):
    with fitz.open(path_pdf) as doc:
        texto = ""
        for i, page in enumerate(doc):
            if i < 14:
                continue
            texto += page.get_text()

    blocos = re.split(r'\n(?=\d{1,3}\s*\n)', texto)
    paragrafos = []
    ids_utilizados = set()

    for bloco in blocos:
        match = re.match(r"(\d{1,3})\s*\n(.+)", bloco, re.DOTALL)
        if not match:
            continue

        id_paragrafo = int(match.group(1))
        if id_paragrafo in ids_utilizados:
            continue
        ids_utilizados.add(id_paragrafo)

        texto_paragrafo = match.group(2).strip()

        # Opções de navegação
        padrao_opcao = re.compile(
            r"((?:[^\n\.]*)\b(?:vá|volte|retorne|siga|continue|dirija-se|prossiga)\s+(?:agora\s+)?para\s+(\d+))",
            re.IGNORECASE
        )
        opcoes = []
        for m in padrao_opcao.finditer(texto_paragrafo):
            texto_opcao = m.group(1).strip().capitalize()
            destino = int(m.group(2))
            opcoes.append({
                "texto": texto_opcao,
                "destino": destino
            })

        # Ações intermediárias
        padrao_acao = re.compile(
            r"(perca|ganhe|recupere)\s+(\d+)\s+pontos?\s+de\s+(habilidade|energia|sorte|f[ée])",
            re.IGNORECASE
        )
        acoes = []
        for m in padrao_acao.finditer(texto_paragrafo):
            verbo = m.group(1).lower()
            valor = int(m.group(2))
            atributo = m.group(3).lower()
            tipo = {
                "perca": "perda_" + atributo,
                "ganhe": "ganho_" + atributo,
                "recupere": "recupera_" + atributo
            }[verbo]
            acoes.append({
                "descricao": f"{verbo} {valor} pontos de {atributo}",
                "tipo": tipo,
                "valor": valor
            })

        # Efeitos contínuos de combate
        efeitos_continuos = []
        padrao_efeito = re.compile(r"(perder[aá]?|sofrer[aá]?|tomar[aá]?|receber[aá]?)\s+(\d+)\s+pontos?\s+de\s+(habilidade|energia|sorte|f[ée]).*?(cada|por|durante|até|enquanto)", re.IGNORECASE)
        for m in padrao_efeito.finditer(texto_paragrafo):
            efeitos_continuos.append({
                "descricao": m.group(0).strip(),
                "tipo": "efeito_continuo",
                "valor": int(m.group(2)),
                "condicao": m.group(4)
            })

        # Detecção de criaturas (mesmo sem atributos)
        criaturas = []
        for m in re.finditer(r"([A-ZÁÉÍÓÚÇÃÕÂÊÔ0-9\s'\-]{3,})\s+HABILIDADE\s+(\d+)\s+ENERGIA\s+(\d+)", texto_paragrafo):
            criaturas.append({
                "nome": m.group(1).strip().title(),
                "habilidade": int(m.group(2)),
                "energia": int(m.group(3))
            })

        # Itens ganhos
        itens = []
        padrao_item = re.compile(r"(?:acrescente|junte|some|pegue|ganhe|adquira|adicione|anote)[^\n]*?(?:equipamentos|provisões|tesouros|moedas|estaca|espada|anel|escudo|livro|alh[o|a])", re.IGNORECASE)
        for m in padrao_item.finditer(texto_paragrafo):
            nome_bruto = m.group(0).strip()
            nome_extraido = re.sub(r".*?(?:junte|acrescente|pegue|ganhe|adicione|anote|some)\s+(?:o|a|um|uma)?\s*", "", nome_bruto, flags=re.IGNORECASE)
            itens.append(nome_extraido.strip('.'))

        # Decisões condicionais refinadas
        padrao_cond = re.compile(
            r"você tem (uma?|o|alguma) ([^\?\.,]+)\??.*?vá para (\d+).*?(senão|se não tiver|se não).*?vá para (\d+)",
            re.IGNORECASE
        )
        cond_match = padrao_cond.search(texto_paragrafo)
        decisao_condicional = None
        if cond_match:
            item = cond_match.group(2).strip()
            verdadeiro = int(cond_match.group(3))
            falso = int(cond_match.group(5))
            decisao_condicional = {
                "condicao": f"ter {item}",
                "verdadeiro": verdadeiro,
                "falso": falso
            }

        paragrafos.append({
            "id": id_paragrafo,
            "texto": texto_paragrafo,
            "opcoes": opcoes,
            "criaturas": criaturas,
            "acoesIntermediarias": acoes,
            "efeitosContinuosCombate": efeitos_continuos,
            "itensAdquiridos": itens,
            "decisaoCondicional": decisao_condicional
        })

    return paragrafos

if __name__ == "__main__":
    resultado = extrair_paragrafos("fighting-fantasy-a-cripta-do-vampiro-biblioteca-elfica.pdf")
    with open("paragrafos_extraidos_v9.json", "w", encoding="utf-8") as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)
    print("Parágrafos extraídos com sucesso! Resultado salvo em 'paragrafos_extraidos_v9.json'")
