import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParagrafosModule } from './paragrafos/paragrafos.module';
import { PrismaService } from './prisma/prisma.service'; 
import { JogadorModule } from './jogador/jogador.module';
@Module({
  imports: [ParagrafosModule, JogadorModule, JogadorModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}