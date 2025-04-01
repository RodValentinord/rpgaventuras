import { Test, TestingModule } from '@nestjs/testing';
import { JogadorController } from './jogador.controller';

describe('JogadorController', () => {
  let controller: JogadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JogadorController],
    }).compile();

    controller = module.get<JogadorController>(JogadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
