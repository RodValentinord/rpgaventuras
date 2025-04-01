import { Test, TestingModule } from '@nestjs/testing';
import { JogadorService } from './jogador.service';

describe('JogadorService', () => {
  let service: JogadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JogadorService],
    }).compile();

    service = module.get<JogadorService>(JogadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
