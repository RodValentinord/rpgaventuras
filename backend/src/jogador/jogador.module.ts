import { Module } from '@nestjs/common';
import { JogadorController } from './jogador.controller';
import { JogadorService } from './jogador.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module'; 
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [PrismaModule, UtilsModule, CoreModule],
  controllers: [JogadorController],
  providers: [JogadorService],
})
export class JogadorModule {}
