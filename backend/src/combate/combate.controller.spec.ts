import { Test, TestingModule } from '@nestjs/testing';
import { CombateController } from './combate.controller';

describe('CombateController', () => {
  let controller: CombateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CombateController],
    }).compile();

    controller = module.get<CombateController>(CombateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
