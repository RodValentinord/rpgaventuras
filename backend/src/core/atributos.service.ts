import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiceService } from 'src/utils/dice.service';

@Injectable()
export class AtributosService {
  constructor(
    private prisma: PrismaService,
    private dice: DiceService,
  ) {}

  async aplicarModificacao(jogadorId: string, atributo: string, valor: number) {
    const validos = ['habilidade', 'energia', 'sorte', 'fe'];
    if (!validos.includes(atributo)) throw new Error('Atributo inválido');

    const jogador = await this.prisma.jogador.findUnique({
      where: { id: jogadorId },
    });

    if (!jogador) {
      throw new Error('Jogador não encontrado');
    }

    const novoValor = Math.max(0, (jogador[atributo as keyof typeof jogador] as number) + valor);

    await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: {
        [atributo]: novoValor,
      },
    });

    if (atributo === 'energia' && novoValor === 0) {
      // Tratar morte do jogador
      console.warn(`Jogador ${jogador.nome} morreu!`);
    }

    return this.prisma.jogador.findUnique({
      where: { id: jogadorId },
    });
  }

  async rolarTesteDeSorte(jogadorId: string) {
    const jogador = await this.prisma.jogador.findUnique({ where: { id: jogadorId } });

    if (!jogador) {
      throw new Error('Jogador não encontrado');
    }

    const resultado = this.dice.rolarMultiplos(2, 6);
    const sucesso = resultado <= jogador.sorte;

    await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: { sorte: Math.max(0, jogador.sorte - 1) },
    });

    return sucesso;
  }
  async testarSorte(jogadorId: string) {
    const jogador = await this.prisma.jogador.findUnique({ where: { id: jogadorId } });
    if (!jogador) throw new Error('Jogador não encontrado');
  
    const rolagem = this.dice.rolarMultiplos(2, 6);
    const sucesso = rolagem <= jogador.sorte;
  
    const novoValor = jogador.sorte - 1;
  
    await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: { sorte: novoValor },
    });
  
    return {
      sucesso,
      rolagem,
      sorteAnterior: jogador.sorte,
      sorteAtual: novoValor,
    };
  }
  
}
