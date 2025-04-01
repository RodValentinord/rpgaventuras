import { Module } from '@nestjs/common';
import { ParagrafosService } from './paragrafos.service';
import { ParagrafosController } from './paragrafos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParagrafosController],
  providers: [ParagrafosService],
})
export class ParagrafosModule {}
