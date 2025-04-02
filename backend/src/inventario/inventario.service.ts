import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdicionarItemDTO } from './dto/adicionar-item.dto';
import { UsarItemDTO } from './dto/usar-item.dto';
import { AtributosService } from 'src/core/atributos.service';
import { EquiparDTO } from './dto/equipar.dto';

@Injectable()
export class InventarioService {
  constructor(
    private prisma: PrismaService,
    private atributosService: AtributosService,
  ) {}

  async listarInventario(jogadorId: string) {
    return {
      equipamentos: await this.prisma.equipamento.findMany({ where: { jogadorId } }),
      aflicoes: await this.prisma.aflicao.findMany({ where: { jogadorId } }),
      feiticos: await this.prisma.feitico.findMany({ where: { jogadorId } }),
      efeitosTemporarios: await this.prisma.efeito.findMany({ where: { jogadorId } }),
      acoesPendentes: await this.prisma.acaoIntermediaria.findMany({ where: { jogadorId } }),
    };
  }

  async adicionarItem(jogadorId: string, data: AdicionarItemDTO) {
    switch (data.tipo) {
      case 'equipamento':
        return this.prisma.equipamento.create({
          data: {
            nome: data.nome,
            descricao: data.descricao ?? '',
            tipo: data.tipoEquipamento ?? 'outro',
            bonusHabilidade: data.bonusHabilidade ?? 0,
            efeitoEspecial: data.efeitoEspecial ?? null,
            jogadorId,
            equipado: false,
          },
        });

      case 'item':
        return this.prisma.itemAdquirido.create({
          data: {
            nome: data.nome,
            jogador: { connect: { id: jogadorId } },
            paragrafoId: undefined,
          },
        });

      case 'feitico':
        return this.prisma.feitico.create({
          data: {
            nome: data.nome,
            descricao: data.descricao ?? '',
            efeito: data.efeito ?? '',
            usosRestantes: data.usosRestantes ?? 1,
            jogadorId,
          },
        });

      case 'aflicao':
        return this.prisma.aflicao.create({
          data: {
            nome: data.nome,
            tipo: data.tipoAflicao ?? 'temporaria',
            efeito: data.descricao ?? '',
            condicoesCura: data.condicoesCura ?? null,
            jogadorId,
          },
        });

      default:
        throw new Error('Tipo de item inválido');
    }
  }

  async removerItem(jogadorId: string, itemId: string) {
    const item = await this.prisma.itemAdquirido.findUnique({
      where: { id: itemId },
    });

    if (!item || item.jogadorId !== jogadorId) {
      throw new Error('Item não encontrado ou não pertence ao jogador');
    }

    return this.prisma.itemAdquirido.delete({
      where: { id: itemId },
    });
  }

  async usarItem(jogadorId: string, data: UsarItemDTO) {
    // 1. Tenta usar como item comum
    const item = await this.prisma.itemAdquirido.findUnique({
      where: { id: data.itemId },
    });

    if (item && item.jogadorId === jogadorId) {
      const nome = item.nome.toLowerCase();

      if (nome.includes('provisão')) {
        await this.atributosService.aplicarModificacao(jogadorId, 'energia', 4);
      } else {
        throw new Error('Este item não pode ser usado');
      }

      await this.prisma.itemAdquirido.delete({
        where: { id: data.itemId },
      });

      return { mensagem: 'Item usado com sucesso' };
    }

    // 2. Tenta usar como feitiço
    const feitico = await this.prisma.feitico.findUnique({
      where: { id: data.itemId },
    });

    if (feitico && feitico.jogadorId === jogadorId) {
      // Aqui poderia aplicar efeito real no futuro
      if (feitico.usosRestantes <= 1) {
        await this.prisma.feitico.delete({
          where: { id: feitico.id },
        });
      } else {
        await this.prisma.feitico.update({
          where: { id: feitico.id },
          data: {
            usosRestantes: { decrement: 1 },
          },
        });
      }

      return { mensagem: 'Feitiço usado com sucesso' };
    }

    throw new Error('Item ou feitiço inválido ou não pertence ao jogador');
  }
  async equipar(jogadorId: string, data: EquiparDTO) {
    const equipamento = await this.prisma.equipamento.findUnique({
      where: { id: data.equipamentoId },
    });
  
    if (!equipamento || equipamento.jogadorId !== jogadorId) {
      throw new Error('Equipamento não encontrado ou não pertence ao jogador');
    }
  
    const bonus = equipamento.bonusHabilidade ?? 0;
  
    await this.atributosService.aplicarModificacao(jogadorId, 'habilidade', bonus);
  
    await this.prisma.equipamento.update({
      where: { id: data.equipamentoId },
      data: { equipado: true },
    });
  
    return {
      mensagem: `Equipamento "${equipamento.nome}" equipado com sucesso`,
      bonusAplicado: bonus,
    };
  }
  

  async desequipar(jogadorId: string, equipamentoId: string) {
    const equipamento = await this.prisma.equipamento.findUnique({
      where: { id: equipamentoId },
    });
  
    if (!equipamento || equipamento.jogadorId !== jogadorId || !equipamento.equipado) {
      throw new Error('Equipamento não encontrado, não pertence ao jogador ou já está desequipado');
    }
  
    const bonus = equipamento.bonusHabilidade ?? 0;
  
    await this.atributosService.aplicarModificacao(jogadorId, 'habilidade', -bonus);
  
    return this.prisma.equipamento.update({
      where: { id: equipamentoId },
      data: { equipado: false },
    });
  }
  
  
  async listarEquipados(jogadorId: string) {
    return this.prisma.equipamento.findMany({
      where: {
        jogadorId,
        equipado: true,
      },
    });
  }
  
  async aplicarBonus(jogadorId: string) {
    const equipamentos = await this.prisma.equipamento.findMany({
      where: {
        jogadorId,
        equipado: true,
      },
    });
  
    let bonus = { habilidade: 0 };
  
    for (const eq of equipamentos) {
      bonus.habilidade += eq.bonusHabilidade ?? 0;
    }
  
    await this.prisma.jogador.update({
      where: { id: jogadorId },
      data: {
        habilidade: {
          increment: bonus.habilidade,
        },
      },
    });
  }
  
  async marcarComoUsado(itemId: string, tipo: 'feitico' | 'item') {
    if (tipo === 'feitico') {
      return this.prisma.feitico.update({
        where: { id: itemId },
        data: {
          usosRestantes: { decrement: 1 },
        },
      });
    }
  
    // Para itens simples, pode-se usar uma flag futura como `usado: true`
    return this.prisma.itemAdquirido.update({
      where: { id: itemId },
      data: {
        nome: { set: 'USADO: ' + itemId },
      },
    });
  }
  
}
