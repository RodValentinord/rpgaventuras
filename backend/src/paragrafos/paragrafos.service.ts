// backend/src/paragrafos/paragrafos.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParagrafoDTO } from './dto/paragrafo.dto';

@Injectable()
export class ParagrafosService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<ParagrafoDTO> {
    const paragrafo = await this.prisma.paragrafo.findUnique({
      where: { id },
      include: {
        opcoesOrigem: {
          include: {
            condicao: true,
          },
        },
        criaturas: true,
        acoesIntermediarias: true,
        efeitos: true,
        itensAdquiridos: true,
        decisaoCondicional: true,
      },
    });

    if (!paragrafo) throw new NotFoundException('Parágrafo não encontrado');

    return {
      id: paragrafo.id,
      texto: paragrafo.texto,
      opcoes: paragrafo.opcoesOrigem.map((op) => ({
        id: op.id,
        texto: op.texto,
        destinoId: op.destinoId,
        tipoOpcao: op.tipoOpcao,
        condicao: op.condicao?.valor,
      })),
      criaturas: paragrafo.criaturas.map((c) => ({
        id: c.id,
        nome: c.nome,
        habilidade: c.habilidade,
        energia: c.energia,
        descricao: c.descricao ?? undefined,
        // só mapeie esses campos se existirem no schema
        // sorte: c.sorte ?? undefined,
        // fe: c.fe ?? undefined,
        // dano: c.dano ?? undefined,
        // defesa: c.defesa ?? undefined,
      })),
      acoesIntermediarias: paragrafo.acoesIntermediarias.map((a) => ({
        id: a.id,
        descricao: a.descricao,
        tipo: a.tipo,
        valor: a.valor ?? undefined,
      })),
      efeitos: paragrafo.efeitos.map((e) => ({
        id: e.id,
        tipo: e.tipo,
        descricao: e.descricao ?? undefined,
        valor: e.valor,
        condicao: e.condicao ?? undefined,
      })),
      itensAdquiridos: paragrafo.itensAdquiridos.map((i) => ({
        id: i.id,
        nome: i.nome,
      })),
      decisaoCondicional: paragrafo.decisaoCondicional
        ? {
            id: paragrafo.decisaoCondicional.id,
            condicao: paragrafo.decisaoCondicional.condicao,
            destinoSeVerdadeiro: paragrafo.decisaoCondicional.verdadeiro,
            destinoSeFalso: paragrafo.decisaoCondicional.falso,
          }
        : undefined,
    };
  }
}
