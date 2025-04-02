
## Projeto RPG de Texto Web - A Cripta do Vampiro

Este projeto tem como objetivo adaptar o livro-jogo **A Cripta do Vampiro** para um sistema web jogável, interativo e estruturado. Ele visa proporcionar uma experiência fiel ao livro, com suporte a lógicas de parágrafos interligados, combate com criaturas, gestão de atributos e inventário, testes de sorte e elementos de RPG de mesa automatizados.

### Funcionalidades

- **Navegação por parágrafos numerados com múltiplas escolhas**: O jogador pode avançar pela aventura, fazendo escolhas que afetam o rumo da história.
- **Controle de atributos**: Habilidade, Energia, Sorte e Fé são gerenciados e afetam o desempenho do jogador durante o jogo.
- **Sistema de combate com criaturas**: Lógica de combate onde o jogador enfrenta inimigos com base em rolagens de dados e atributos.
- **Testes de sorte**: Realização de rolagens de dados para determinar o sucesso em eventos aleatórios ou durante as batalhas.
- **Gerenciamento de inventário**: O jogador pode adicionar, remover, usar, equipar e desequipar itens. O inventário também inclui feitiços e aflições.
- **Estado persistente do jogador**: O progresso do jogador é salvo, e o estado é mantido entre sessões de jogo.
- **Controle antifraude de sorteios de dados e alteração de atributos**: Implementação para garantir que não haja manipulação nos resultados das rolagens de dados ou nos atributos.

### Stack Tecnológica (sujeita a evolução)

- **Backend**: Node.js + NestJS
- **Banco de Dados**: PostgreSQL (ou SQLite em dev)
- **ORM**: Prisma
- **Frontend**: Next.js (em planejamento)
- **Hospedagem**: Railway / Render / Vercel

### Estrutura do Repositório

```plaintext
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

### Como executar localmente

1. **Clone o repositório**
   ```bash
   $ git clone https://github.com/seu-usuario/projeto-rpg-texto.git
   ```

2. **Instale as dependências**
   ```bash
   $ cd backend
   $ npm install
   ```

3. **Rode as migrações do banco**
   ```bash
   $ npx prisma migrate dev
   ```

4. **Inicie o servidor**
   ```bash
   $ npm run start:dev
   ```

### Roadmap Inicial

1. **Modelagem do domínio em UML**: Já concluída e documentada.
2. **Documentação do diagrama de classes**: Disponível em `/docs`.
3. **Parser automático do PDF para JSON/DB**: Processo concluído e integrado.
4. **Implementação dos módulos de Jogador e Parágrafos**: Concluídos, com funcionalidades de criação e progresso do jogador, incluindo gerenciamento de atributos e parágrafos com múltiplas escolhas.
5. **Sistema de combate e sorte**: Em andamento, com lógicas de combate implementadas e testadas (sistema de dano, rolamento de dados e combate entre jogador e inimigos).
6. **Primeira interface de teste (CLI ou web)**: Em planejamento para a integração do frontend (Next.js).

### Licença

Projeto pessoal de portfólio. Direitos autorais da obra original pertencem aos autores e editoras respectivas. Este é um projeto de estudo sem fins lucrativos.

Criado por Rodolfo Valentino | Engenharia de Computação @ Descomplica | Desenvolvedor na RD Station

---

### O que mais atualizar no futuro:

- **Mais funcionalidades no combate**: Implementar o comportamento das criaturas e inimigos com IA para lutas dinâmicas.
- **Interface gráfica**: Integrar o backend com o frontend em Next.js, criando uma interface mais interativa para o usuário.
- **Testes e cobertura do código**: Escrever testes unitários e de integração, focando no fluxo do combate e progressão da história.

