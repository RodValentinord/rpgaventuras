import { Test, TestingModule } from '@nestjs/testing';
import { ParagrafosService } from './paragrafos.service';

describe('ParagrafosService', () => {
  let service: ParagrafosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParagrafosService],
    }).compile();

    service = module.get<ParagrafosService>(ParagrafosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
