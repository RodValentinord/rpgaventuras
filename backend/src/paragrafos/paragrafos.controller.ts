import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ParagrafosService } from './paragrafos.service';
import { ParagrafoDTO } from './dto/paragrafo.dto';

@Controller('paragrafos')
export class ParagrafosController {
  constructor(private readonly paragrafosService: ParagrafosService) {}

  @Get(':id')
  async getParagrafo(@Param('id', ParseIntPipe) id: number): Promise<ParagrafoDTO> {
    return this.paragrafosService.findById(id);
  }
}
