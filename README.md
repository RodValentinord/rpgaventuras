# Projeto RPG de Texto Web - A Cripta do Vampiro

Este projeto tem como objetivo adaptar o livro-jogo *A Cripta do Vampiro* para um sistema web jogável, interativo e estruturado. Ele visa proporcionar uma experiência fiel ao livro, com suporte a lógicas de parágrafos interligados, combate com criaturas, gestão de atributos e inventário, testes de sorte e elementos de RPG de mesa automatizados.

---

## Funcionalidades
- Navegação por parágrafos numerados com múltiplas escolhas.
- Controle de atributos: Habilidade, Energia, Sorte, Fé.
- Sistema de combate com criaturas, baseado em dados.
- Testes de sorte para eventos e batalhas.
- Gerenciamento de inventário, aflições e feitiços.
- Estado persistente do jogador e progresso na aventura.
- Controle antifraude de sorteios de dados e alteração de atributos.

---

## Stack Tecnológica (sujeita a evolução)
- **Backend**: Node.js + NestJS
- **Banco de Dados**: PostgreSQL (ou SQLite em dev)
- **ORM**: Prisma
- **Frontend**: Next.js (em planejamento)
- **Hospedagem**: Railway / Render / Vercel

---

## Estrutura do Repositório
```
/backend
  /src
    /modules
      /jogador
      /paragrafo
      /combate
      /util
    main.ts
  /prisma
    schema.prisma

/docs
  diagrama_classes.md
  modelo_uml.png
  regras_do_jogo.md

/scripts
  parse_pdf.py

README.md
```

---

## Como executar localmente
```bash
# Clone o repositório
$ git clone https://github.com/seu-usuario/projeto-rpg-texto.git

# Instale as dependências
$ cd backend
$ npm install

# Rode as migrações do banco
$ npx prisma migrate dev

# Inicie o servidor
$ npm run start:dev
```

---

## Roadmap Inicial
- [x] Modelagem do domínio em UML
- [x] Documentação do diagrama de classes
- [ ] Parser automático do PDF para JSON/DB
- [ ] Implementação dos módulos de Jogador e Parágrafos
- [ ] Sistema de combate e sorte
- [ ] Primeira interface de teste (CLI ou web)

---

## Licença
Projeto pessoal de portfólio. Direitos autorais da obra original pertencem aos autores e editoras respectivas. Este é um projeto de estudo sem fins lucrativos.

---

> Criado por Rodolfo Valentino | Engenharia de Computação @ Descomplica | Desenvolvedor na RD Station
