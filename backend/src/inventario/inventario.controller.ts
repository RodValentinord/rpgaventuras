import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { AdicionarItemDTO } from './dto/adicionar-item.dto';
import { Delete } from '@nestjs/common';
import { UsarItemDTO } from './dto/usar-item.dto';
import { EquiparDTO } from './dto/equipar.dto';

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
  @Put('equipar')
  equipar(
    @Param('id') jogadorId: string,
    @Body() data: EquiparDTO,
  ) {
    return this.inventarioService.equipar(jogadorId, data);
  }
  @Put('desequipar/:equipamentoId')
desequipar(
  @Param('id') jogadorId: string,
  @Param('equipamentoId') equipamentoId: string,
) {
  return this.inventarioService.desequipar(jogadorId, equipamentoId);
}

@Get('equipados')
listarEquipados(@Param('id') jogadorId: string) {
  return this.inventarioService.listarEquipados(jogadorId);
}

@Post('aplicar-bonus')
aplicarBonus(@Param('id') jogadorId: string) {
  return this.inventarioService.aplicarBonus(jogadorId);
}

@Put('marcar-usado/:tipo/:itemId')
marcarComoUsado(
  @Param('itemId') itemId: string,
  @Param('tipo') tipo: 'feitico' | 'item',
) {
  return this.inventarioService.marcarComoUsado(itemId, tipo);
}

}
