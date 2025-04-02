import { Module } from '@nestjs/common';
import { CombateService } from './combate.service';
import { CombateController } from './combate.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CombateService],
  controllers: [CombateController],
  exports: [CombateService],
})
export class CombateModule {}
