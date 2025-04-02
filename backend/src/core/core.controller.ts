import { Controller, Put, Param } from '@nestjs/common';
import { AtributosService } from './atributos.service';

@Controller()
export class CoreController {
  constructor(private readonly atributosService: AtributosService) {}

  @Put('jogador/:id/testar-sorte')
  testarSorte(@Param('id') jogadorId: string) {
    return this.atributosService.testarSorte(jogadorId);
  }
}
