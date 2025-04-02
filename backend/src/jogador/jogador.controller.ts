import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { JogadorService } from './jogador.service';
import { CreateJogadorDTO } from './dto/create-jogador.dto';
import { AvancarDTO } from './dto/avancar.dto';
import { ExecutarAcaoDTO } from './dto/executar-acao.dto';



@Controller('jogador')
export class JogadorController {
  constructor(private readonly jogadorService: JogadorService) {}

  @Post()
  async criar(@Body() data: CreateJogadorDTO) {
    return this.jogadorService.criarJogador(data);
  }
  @Get(':id')
  async buscar(@Param('id') id: string) {
    return this.jogadorService.buscarPorId(id);
  }
  @Post(':id/avancar')
  async avancar(@Param('id') id: string, @Body() data: AvancarDTO) {
    return this.jogadorService.avancarParagrafo(id, data);
  }

  @Post(':id/acao')
  async executarAcao(
    @Param('id') jogadorId: string,
    @Body() data: ExecutarAcaoDTO,
  ) {
    return this.jogadorService.executarAcao(jogadorId, data);
  }
  
}
