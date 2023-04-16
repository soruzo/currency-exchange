import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRepository } from './exchange.repository';

describe('ExchangeRepository', () => {
  let repository: ExchangeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRepository],
    }).compile();

    repository = module.get<ExchangeRepository>(ExchangeRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // Adicione seus testes específicos aqui
});