import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesService } from './exchanges.service';
import { ExchangeRepository } from '../repositories/exchange.repository';
import { ExchangeRatesGateway } from '../gateways/exchange-rates.gateway';
import { Exchange } from '../entities/exchange.entity';

describe('ExchangesService', () => {
  let service: ExchangesService;
  let repository: ExchangeRepository;
  let gateway: ExchangeRatesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangesService,
        {
          provide: ExchangeRepository,
          useValue: {
            createExchange: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
        {
          provide: ExchangeRatesGateway,
          useValue: {
            convert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangesService>(ExchangesService);
    repository = module.get<ExchangeRepository>(ExchangeRepository);
    gateway = module.get<ExchangeRatesGateway>(ExchangeRatesGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call ExchangeRatesGateway.convert with correct parameters and create a new exchange', async () => {
      const exchange: Partial<Exchange> = {
        userId: 'user-id',
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        sourceValue: 100,
      };
      const convertResponse = {
        result: 90,
        info: { rate: 0.9 },
        date: new Date().getTime(),
      };
      (gateway.convert as jest.Mock).mockResolvedValue(convertResponse);

      await service.create(exchange);

      expect(gateway.convert).toHaveBeenCalledWith(exchange.sourceValue, exchange.sourceCurrency, exchange.targetCurrency);
      expect(repository.createExchange).toHaveBeenCalled();
    });

    it('should return the created exchange', async () => {
      const exchange: Partial<Exchange> = {
        userId: 'user-id',
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        sourceValue: 100,
      };
      const convertResponse = {
        result: 90,
        info: { rate: 0.9 },
        date: new Date().getTime(),
      };
      (gateway.convert as jest.Mock).mockResolvedValue(convertResponse);

      (repository.createExchange as jest.Mock).mockResolvedValue(exchange);

      const result = await service.create(exchange);

      expect(result).toEqual(exchange);
    });
  });

  describe('findByUserId', () => {
    it('should call ExchangeRepository.findByUserId with correct parameter', async () => {
      const userId = 'user-id';
      await service.findByUserId(userId);
      expect(repository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return the result of ExchangeRepository.findByUserId', async () => {
      const userId = 'user-id';
      const expectedResult: Exchange[] = [];
      (repository.findByUserId as jest.Mock).mockResolvedValue(expectedResult);
      const result = await service.findByUserId(userId);
      expect(result).toEqual(expectedResult);
    });
  });
});
