import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { AdicionarItemDTO } from './dto/adicionar-item.dto';
import { Delete } from '@nestjs/common';
import { UsarItemDTO } from './dto/usar-item.dto';

@Controller('jogador/:id/inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  listarInventario(@Param('id') jogadorId: string) {
    return this.inventarioService.listarInventario(jogadorId);
  }

  @Post()
  adicionarItem(
    @Param('id') jogadorId: string,
    @Body() data: AdicionarItemDTO,
  ) {
    return this.inventarioService.adicionarItem(jogadorId, data);
  }
  @Delete('itens/:itemId')
  removerItem(
    @Param('id') jogadorId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.inventarioService.removerItem(jogadorId, itemId);
  }
  @Post('usar')
  usarItem(
    @Param('id') jogadorId: string,
    @Body() data: UsarItemDTO,
  ) {
    return this.inventarioService.usarItem(jogadorId, data);
  }
}
