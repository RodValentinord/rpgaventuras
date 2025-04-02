import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdicionarItemDTO } from './dto/adicionar-item.dto';
import { UsarItemDTO } from './dto/usar-item.dto';
import { AtributosService } from 'src/core/atributos.service';

@Injectable()
export class InventarioService {
  constructor(private prisma: PrismaService,private atributosService: AtributosService, ) {}

  async listarInventario(jogadorId: string) {
    return this.prisma.jogador.findUnique({
      where: { id: jogadorId },
      select: {
        equipamentos: true,
        aflicoes: true,
        feiticos: true,
        efeitosTemporarios: true,
        acoesPendentes: true,
      },
    });
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
          },
        });
  
        case 'item':
            return this.prisma.itemAdquirido.create({
              data: {
                nome: data.nome,
                jogador: {
                  connect: { id: jogadorId },
                },
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
    const item = await this.prisma.itemAdquirido.findUnique({
      where: { id: data.itemId },
    });
  
    if (!item || item.jogadorId !== jogadorId) {
      throw new Error('Item inválido ou não pertence ao jogador');
    }
  
    const nome = item.nome.toLowerCase();
  
    // Exemplo simples: provisão recupera 4 de energia
    if (nome.includes('provisão')) {
      await this.atributosService.aplicarModificacao(jogadorId, 'energia', 4);
    } else {
      throw new Error('Este item não pode ser usado');
    }
  
    // Remove o item depois de usar
    await this.prisma.itemAdquirido.delete({
      where: { id: data.itemId },
    });
  
    return { mensagem: 'Item usado com sucesso' };
  }
  
}
