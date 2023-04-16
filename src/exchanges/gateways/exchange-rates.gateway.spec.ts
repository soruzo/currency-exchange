import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRatesGateway } from './exchange-rates.gateway';

describe('ExchangeRatesGateway', () => {
  let gateway: ExchangeRatesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRatesGateway],
    }).compile();

    gateway = module.get<ExchangeRatesGateway>(ExchangeRatesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  // Adicione seus testes específicos aqui
});