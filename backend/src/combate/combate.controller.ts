import { Controller, Post, Param } from '@nestjs/common';
import { CombateService } from './combate.service';

@Controller('combate')
export class CombateController {
  constructor(private readonly combateService: CombateService) {}

  @Post('iniciar/:jogadorId')
  iniciar(@Param('jogadorId') jogadorId: string) {
    return this.combateService.iniciarCombate(jogadorId);
  }
}
