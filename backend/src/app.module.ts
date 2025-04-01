import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParagrafosModule } from './paragrafos/paragrafos.module';
import { PrismaService } from './prisma/prisma.service'; 
@Module({
  imports: [ParagrafosModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}