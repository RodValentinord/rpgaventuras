import { Test, TestingModule } from '@nestjs/testing';
import { ParagrafosController } from './paragrafos.controller';

describe('ParagrafosController', () => {
  let controller: ParagrafosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParagrafosController],
    }).compile();

    controller = module.get<ParagrafosController>(ParagrafosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
