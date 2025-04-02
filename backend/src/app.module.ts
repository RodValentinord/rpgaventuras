import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParagrafosModule } from './paragrafos/paragrafos.module';
import { PrismaService } from './prisma/prisma.service'; 
import { JogadorModule } from './jogador/jogador.module';
import { DiceService } from './utils/dice.service';
import { CoreModule } from './core/core.module';
import { InventarioModule } from './inventario/inventario.module';
import { CombateModule } from './combate/combate.module';



@Module({
  imports: [ParagrafosModule, JogadorModule, JogadorModule, CoreModule, InventarioModule, CombateModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, DiceService],
})
export class AppModule {}