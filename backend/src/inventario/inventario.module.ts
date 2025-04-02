import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [PrismaModule,CoreModule],
  controllers: [InventarioController],
  providers: [InventarioService],
})
export class InventarioModule {}
