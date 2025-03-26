# Diagrama de Classes - Projeto RPG de Texto

Este documento apresenta o diagrama de classes em formato textual UML, representando os principais elementos do domínio do projeto baseado no livro-jogo *A Cripta do Vampiro*.

---

## 🎓 Modelo UML (PlantUML)

```plantuml
@startuml
class Jogador {
  +UUID id
  +string nome
  +int habilidade
  +int energia
  +int sorte
  +int fe
  +int habilidadeInicial
  +int energiaInicial
  +int sorteInicial
  +int feInicial
  +int provisoes
  +Paragrafo paragrafoAtual
  +List<Equipamento> equipamentos
  +List<Aflicao> aflicoes
  +List<Feitico> feiticos
  +testarSorte()
  +usarProvisao()
}

class Paragrafo {
  +int id
  +string texto
  +List<Opcao> opcoes
}

class Opcao {
  +UUID id
  +string texto
  +Paragrafo destino
  +Condicao condicao
}

class Condicao {
  +string tipo
  +string valor
  +boolean inverter
}

class Combate {
  +UUID id
  +Jogador jogador
  +List<Criatura> inimigos
  +List<Rodada> rodadas
  +string status
  +Date dataInicio
  +Date dataFim
  +iniciar()
  +executarRodada()
}

class Criatura {
  +UUID id
  +string nome
  +int habilidade
  +int energia
}

class Rodada {
  +int numero
  +int forcaJogador
  +int forcaInimigo
  +string resultado
  +boolean sorteUtilizada
}

class Equipamento {
  +UUID id
  +string nome
  +string tipo
  +string descricao
  +int bonusHabilidade
}

class Aflicao {
  +UUID id
  +string nome
  +string tipo
  +string efeito
}

class Feitico {
  +UUID id
  +string nome
  +string descricao
  +string efeito
  +int usosRestantes
}

Jogador --> Paragrafo : paragrafoAtual
Paragrafo --> Opcao
Opcao --> Paragrafo : destino
Opcao --> Condicao
Jogador --> Equipamento
Jogador --> Aflicao
Jogador --> Feitico
Combate --> Jogador
Combate --> Criatura
Combate --> Rodada
@enduml
```

> Este diagrama pode ser visualizado em ferramentas como [PlantUML Live](https://www.planttext.com/) ou plugins do VSCode.