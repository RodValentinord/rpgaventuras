import { TipoOpcao, TipoAcao, TipoEfeito } from '@prisma/client';

export class OpcaoDTO {
  id: string;
  texto: string;
  destinoId: number;
  tipoOpcao?: TipoOpcao;
  condicao?: string;
}

export class CriaturaDTO {
  id: string;
  nome: string;
  habilidade: number;
  energia: number;
  descricao?: string;
  //sorte?: number;
  //fe?: number;
  //dano?: number;
  //defesa?: number;
}

export class AcaoIntermediariaDTO {
  id: string;
  descricao: string;
  tipo: TipoAcao;
  valor?: number;
}

export class EfeitoDTO {
  id: string;
  tipo: TipoEfeito;
  descricao?: string;
  valor: number;
  condicao?: string;
}

export class ItemAdquiridoDTO {
  id: string;
  nome: string;
}

export class DecisaoCondicionalDTO {
  id: string;
  condicao: string;
  destinoSeVerdadeiro: number;
  destinoSeFalso: number;
}

export class ParagrafoDTO {
  id: number;
  texto: string;
  opcoes: OpcaoDTO[];
  criaturas: CriaturaDTO[];
  acoesIntermediarias: AcaoIntermediariaDTO[];
  efeitos: EfeitoDTO[];
  itensAdquiridos: ItemAdquiridoDTO[];
  decisaoCondicional?: DecisaoCondicionalDTO;
}
