import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJogadorDTO } from './dto/create-jogador.dto';
import { DiceService } from 'src/utils/dice.service';
import { AvancarDTO } from './dto/avancar.dto';

@Injectable()
export class JogadorService {
  constructor(
    private prisma: PrismaService,
    private dice: DiceService,
  ) {}

  async criarJogador(data: CreateJogadorDTO) {
    const habilidade = this.dice.rolarDado(6) + 6;
    const energia = this.dice.rolarMultiplos(2, 6) + 12;
    const sorte = this.dice.rolarDado(6) + 6;
    const fe = 6;
    const provisoes = 10;

    const jogador = await this.prisma.jogador.create({
      data: {
        nome: data.nome,
        habilidadeInicial: habilidade,
        habilidade,
        energiaInicial: energia,
        energia,
        sorteInicial: sorte,
        sorte,
        feInicial: fe,
        fe,
        provisoes,
        paragrafoAtualId: 1,
      },
    });

    return jogador;
  }

  async buscarPorId(id: string) {
    return this.prisma.jogador.findUnique({
      where: { id },
      include: {
        paragrafoAtual: {
          include: {
            opcoesOrigem: true,
            criaturas: true,
            acoesIntermediarias: true,
            efeitos: true,
            itensAdquiridos: true,
            decisaoCondicional: true,
          },
        },
        equipamentos: true,
        aflicoes: true,
        feiticos: true,
        efeitosTemporarios: true,
        acoesPendentes: true,
        combates: true,
      },
    });
  }
  async avancarParagrafo(jogadorId: string, data: AvancarDTO) {
    // 1. Buscar o jogador atual
    const jogador = await this.prisma.jogador.findUnique({
      where: { id: jogadorId },
      include: { paragrafoAtual: { include: { opcoesOrigem: true } } },
    });
  
    if (!jogador) throw new Error('Jogador não encontrado');
  
    // 2. Validar se a opção existe no parágrafo atual
    const opcaoEscolhida = jogador.paragrafoAtual.opcoesOrigem.find(
      (opcao) => opcao.id === data.opcaoId,
    );
  
    if (!opcaoEscolhida) {
      throw new Error('Opção inválida para o parágrafo atual');
    }
  
    // 3. Atualizar o jogador para o novo parágrafo
    const jogadorAtualizado = await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: {
        paragrafoAtualId: opcaoEscolhida.destinoId,
      },
      include: {
        paragrafoAtual: {
          include: {
            opcoesOrigem: true,
            criaturas: true,
            acoesIntermediarias: true,
            efeitos: true,
            itensAdquiridos: true,
            decisaoCondicional: true,
          },
        },
      },
    });
  
    // 4. Retornar o novo parágrafo
    return jogadorAtualizado.paragrafoAtual;
  }
}
