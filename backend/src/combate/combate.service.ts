import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CombateService {
  constructor(private prisma: PrismaService) {}

  async iniciarCombate(jogadorId: string) {
    const jogador = await this.prisma.jogador.findUnique({
      where: { id: jogadorId },
      include: { paragrafoAtual: { include: { criaturas: true } } },
    });

    if (!jogador) throw new Error('Jogador não encontrado');

    const criaturas = jogador.paragrafoAtual.criaturas;

    if (!criaturas || criaturas.length === 0) {
      throw new Error('Nenhuma criatura encontrada no parágrafo atual');
    }

    const combate = await this.prisma.combate.create({
      data: {
        jogadorId,
        status: 'ativo',
        dataInicio: new Date(),
        inimigos: {
          connect: criaturas.map((criatura) => ({ id: criatura.id })),
        },
      },
      include: { inimigos: true },
    });

    return combate;
  }
}
