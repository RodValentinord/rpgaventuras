import { Test, TestingModule } from '@nestjs/testing';
import { CombateService } from './combate.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CombateService', () => {
  let service: CombateService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CombateService,
        {
          provide: PrismaService,
          useValue: {
            jogador: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'jogador123',
                paragrafoAtual: {
                  criaturas: [
                    { id: 'criatura1' },
                    { id: 'criatura2' },
                  ],
                },
              }),
            },
            combate: {
              create: jest.fn().mockResolvedValue({
                id: 'combate123',
                status: 'ativo',
                inimigos: [
                  { id: 'criatura1' },
                  { id: 'criatura2' },
                ],
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CombateService>(CombateService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve iniciar um combate com as criaturas do parágrafo', async () => {
    const combate = await service.iniciarCombate('jogador123');

    expect(combate.status).toBe('ativo');
    expect(combate.inimigos).toHaveLength(2);
    expect(prisma.jogador.findUnique).toHaveBeenCalled();
    expect(prisma.combate.create).toHaveBeenCalled();
  });
});
