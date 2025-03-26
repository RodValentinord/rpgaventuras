# Diagrama de Classes e Documentação do Modelo de Domínio

Este documento descreve a estrutura conceitual do sistema baseado no livro-jogo "A Cripta do Vampiro". Aqui estão os principais elementos do modelo orientado a objetos, suas relações e funções esperadas.

---

## 1. Classes Principais

### `Jogador`
- **Atributos:**
  - `id: UUID`
  - `nome: string`
  - `habilidadeInicial: int`
  - `habilidade: int`
  - `energiaInicial: int`
  - `energia: int`
  - `sorteInicial: int`
  - `sorte: int`
  - `feInicial: int`
  - `fe: int`
  - `provisoes: int`
  - `paragrafoAtual: Paragrafo`
  - `equipamentos: Equipamento[]`
  - `aflicoes: Aflicao[]`
  - `feiticos: Feitico[]`

- **Métodos:**
  - `inicializarAtributos()`
  - `testarSorte(): boolean`
  - `usarProvisao()`
  - `ajustarEnergia(valor: int)`
  - `ajustarHabilidade(valor: int)`

---

### `Paragrafo`
- `id: int`
- `texto: string`
- `opcoes: Opcao[]`

### `Opcao`
- `id: UUID`
- `texto: string`
- `destino: Paragrafo`
- `condicao?: Condicao`

### `Condicao`
- `tipo: enum {possui_item, atributo_minimo, aflicao_ativa}`
- `valor: string | number`
- `inverter?: boolean`

---

## 2. Combate

### `Combate`
- `id: UUID`
- `jogador: Jogador`
- `inimigos: Criatura[]`
- `status: enum {ativo, encerrado, vitoria, derrota, fuga}`
- `rodadas: Rodada[]`
- `dataInicio: Date`
- `dataFim?: Date`

- **Métodos:**
  - `iniciar()`
  - `executarRodada()`
  - `verificarFim()`
  - `usarSorte()`

### `Rodada`
- `numero: int`
- `forcaJogador: int`
- `forcaInimigo: int`
- `resultado: enum {jogador_feriu, inimigo_feriu, empate}`
- `sorteUtilizada: boolean`
- `descricao?: string`

### `Criatura`
- `id: UUID`
- `nome: string`
- `habilidade: int`
- `energia: int`
- `descricao?: string`
- `modificadores?: { [efeito]: number }`

---

## 3. Inventário e Aflições

### `Equipamento`
- `id: UUID`
- `nome: string`
- `tipo: enum {arma, armadura, escudo, item_magico, outro}`
- `descricao: string`
- `bonusHabilidade?: number`
- `efeitoEspecial?: string`

### `Aflicao`
- `id: UUID`
- `nome: string`
- `tipo: enum {continua, temporaria}`
- `efeito: string`
- `condicoesCura?: string`

### `Feitico`
- `id: UUID`
- `nome: string`
- `descricao: string`
- `efeito: string`
- `usosRestantes: number`

---

## 4. Utilitários

### `DiceRoller`
Classe utilitária para gerar aleatoriedade de dados de forma controlada.

- **Métodos:**
  - `rolarDado(lados: number = 6): number`
  - `rolarMultiplos(qtd: number, lados: number = 6): number[]`
  - `rolarESomar(qtd: number, lados: number = 6): number`

---

## 5. Considerações Finais
- O sistema será preparado para ser desacoplado por partes (ex: Combate como microserviço se desejar escalar).
- Toda a lógica de combate, sorte e atributos será validada internamente pela aplicação para evitar fraudes.
- O próximo passo é o parser do livro para alimentar o banco com os parágrafos e opções.

---

> Documento criado em 25/03/2025 por Rodolfo Valentino com suporte do assistente ChatGPT.

