import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJogadorDTO } from './dto/create-jogador.dto';

@Injectable()
export class JogadorService {
  constructor(private prisma: PrismaService) {}

  async criarJogador(data: CreateJogadorDTO) {
    const jogador = await this.prisma.jogador.create({
      data: {
        nome: data.nome,
        habilidadeInicial: data.habilidade,
        habilidade: data.habilidade,
        energiaInicial: data.energia,
        energia: data.energia,
        sorteInicial: data.sorte,
        sorte: data.sorte,
        feInicial: data.fe,
        fe: data.fe,
        provisoes: data.provisoes ?? 0,
        paragrafoAtualId: 1,
      },
    });

    return jogador;
  }
}
