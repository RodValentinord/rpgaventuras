import { TipoEquipamento, TipoAflicao } from '@prisma/client';

export class AdicionarItemDTO {
  tipo: 'equipamento' | 'item' | 'feitico' | 'aflicao';
  nome: string;
  descricao?: string;

  // só se tipo === 'equipamento'
  tipoEquipamento?: TipoEquipamento;
  bonusHabilidade?: number;
  efeitoEspecial?: string;

  // só se tipo === 'feitico'
  efeito?: string;
  usosRestantes?: number;

  // só se tipo === 'aflicao'
  tipoAflicao?: TipoAflicao;
  condicoesCura?: string;
}
