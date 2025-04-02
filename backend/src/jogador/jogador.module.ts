import { Module } from '@nestjs/common';
import { JogadorController } from './jogador.controller';
import { JogadorService } from './jogador.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module'; // 👈 importar aqui

@Module({
  imports: [PrismaModule, UtilsModule], // 👈 adicionar UtilsModule nos imports
  controllers: [JogadorController],
  providers: [JogadorService],
})
export class JogadorModule {}
