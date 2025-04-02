import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdicionarItemDTO } from './dto/adicionar-item.dto';

@Injectable()
export class InventarioService {
  constructor(private prisma: PrismaService) {}

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
}
