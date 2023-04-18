import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesService } from './exchanges.service';
import { ExchangeRepository } from '../repositories/exchange.repository';
import { ExchangeRatesGateway } from '../gateways/exchange-rates.gateway';
import { Exchange } from '../entities/exchange.entity';
import { ExchangeResponseDto } from '../dto/exchange-response.dto';

jest.mock('uuid', () => {
  return {
    v4: jest.fn().mockReturnValue('fixed-transaction-id'),
  };
});

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

      (repository.createExchange as jest.Mock).mockResolvedValue(exchange);

      await service.create(exchange);

      expect(gateway.convert).toHaveBeenCalledWith(exchange.sourceValue, exchange.sourceCurrency, exchange.targetCurrency);
      expect(repository.createExchange).toHaveBeenCalled();
    });


    it('should return the created exchange as an ExchangeResponseDto', async () => {
      const exchange: Partial<Exchange> = {
        userId: 'user-id',
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        sourceValue: 100,
      };
      const convertResponse = {
        result: 90,
        info: { rate: 0.9 }
      };

      const completeExchange: Exchange = {
        id: '1',
        transactionId: 'fixed-transaction-id',
        userId: exchange.userId,
        sourceCurrency: exchange.sourceCurrency,
        targetCurrency: exchange.targetCurrency,
        sourceValue: exchange.sourceValue,
        targetValue: 90,
        rate: 0.9,
        datetime: new Date().toISOString(),
      };

      (gateway.convert as jest.Mock).mockResolvedValue(convertResponse);

      (repository.createExchange as jest.Mock).mockResolvedValue(completeExchange);

      const expectedResult: ExchangeResponseDto = {
        transactionId: completeExchange.transactionId,
        userId: completeExchange.userId,
        sourceCurrency: completeExchange.sourceCurrency,
        sourceValue: completeExchange.sourceValue,
        targetCurrency: completeExchange.targetCurrency,
        targetValue: completeExchange.targetValue,
        rate: completeExchange.rate,
        datetime: completeExchange.datetime,
      };

      const result = await service.create(exchange);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByUserId', () => {
    it('should call ExchangeRepository.findByUserId with correct parameter', async () => {
      const userId = 'user-id';
      const exchanges: Exchange[] = [];
      (repository.findByUserId as jest.Mock).mockResolvedValue(exchanges);

      await service.findByUserId(userId);
      expect(repository.findByUserId).toHaveBeenCalledWith(userId);
    });


    it('should return the result of ExchangeRepository.findByUserId as an array of ExchangeResponseDto', async () => {
      const userId = 'user-id';
      const exchanges: Exchange[] = [];
      (repository.findByUserId as jest.Mock).mockResolvedValue(exchanges);

      const expectedResult: ExchangeResponseDto[] = exchanges.map((exchange) => {
        const responseDto: ExchangeResponseDto = {
          transactionId: exchange.transactionId,
          userId: exchange.userId,
          sourceCurrency: exchange.sourceCurrency,
          sourceValue: exchange.sourceValue,
          targetCurrency: exchange.targetCurrency,
          targetValue: exchange.targetValue,
          rate: exchange.rate,
          datetime: exchange.datetime,
        };
        return responseDto;
      });

      const result = await service.findByUserId(userId);
      expect(result).toEqual(expectedResult);
    });
  });
});
