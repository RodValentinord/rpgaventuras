import { Injectable } from '@nestjs/common';

@Injectable()
export class DiceService {
  rolarDado(lados: number): number {
    return Math.floor(Math.random() * lados) + 1;
  }

  rolarMultiplos(qtd: number, lados: number): number {
    return Array.from({ length: qtd }, () => this.rolarDado(lados)).reduce((a, b) => a + b, 0);
  }
}
