import { Module } from '@nestjs/common';
import { AtributosService } from './atributos.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [PrismaModule, UtilsModule],
  providers: [AtributosService],
  exports: [AtributosService],
})
export class CoreModule {}
