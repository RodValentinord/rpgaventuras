import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJogadorDTO } from './dto/create-jogador.dto';
import { DiceService } from 'src/utils/dice.service';
import { AvancarDTO } from './dto/avancar.dto';
import { ExecutarAcaoDTO } from './dto/executar-acao.dto';

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

    const jogador = await this.prisma.jogador.findUnique({
      where: { id: jogadorId },
      include: { paragrafoAtual: { include: { opcoesOrigem: true } } },
    });
  
    if (!jogador) throw new Error('Jogador não encontrado');
  
    const opcaoEscolhida = jogador.paragrafoAtual.opcoesOrigem.find(
      (opcao) => opcao.id === data.opcaoId,
    );
  
    if (!opcaoEscolhida) {
      throw new Error('Opção inválida para o parágrafo atual');
    }
  
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
  
    return jogadorAtualizado.paragrafoAtual;
  }
  async executarAcao(jogadorId: string, data: ExecutarAcaoDTO) {
    const acao = await this.prisma.acaoIntermediaria.findUnique({
      where: { id: data.acaoId },
    });
  
    if (!acao || acao.jogadorId !== jogadorId) {
      throw new Error('Ação inválida ou não pertence a este jogador');
    }
  
    const modificacoes: any = {};
  
    switch (acao.tipo) {
      case 'ganho_fé':
        modificacoes.fe = { increment: acao.valor ?? 1 };
        break;
      case 'ganho_sorte':
        modificacoes.sorte = { increment: acao.valor ?? 1 };
        break;
      case 'perda_energia':
        modificacoes.energia = { decrement: acao.valor ?? 1 };
        break;
      case 'perda_fé':
        modificacoes.fe = { decrement: acao.valor ?? 1 };
        break;
      case 'perda_habilidade':
        modificacoes.habilidade = { decrement: acao.valor ?? 1 };
        break;
      case 'recupera_energia':
        modificacoes.energia = { increment: acao.valor ?? 1 };
        break;
      default:
        throw new Error('Tipo de ação não reconhecido');
    }
  
    const jogadorAtualizado = await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: modificacoes,
    });
  
    await this.prisma.acaoIntermediaria.delete({
      where: { id: data.acaoId },
    });
  
    return jogadorAtualizado;
  }
}
