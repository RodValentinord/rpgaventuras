import { Body, Controller, Post } from '@nestjs/common';
import { JogadorService } from './jogador.service';
import { CreateJogadorDTO } from './dto/create-jogador.dto';


@Controller('jogador')
export class JogadorController {
  constructor(private readonly jogadorService: JogadorService) {}

  @Post()
  async criar(@Body() data: CreateJogadorDTO) {
    return this.jogadorService.criarJogador(data);
  }
}
