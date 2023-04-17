import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRepository } from './exchange.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exchange } from '../entities/exchange.entity';

describe('ExchangeRepository', () => {
  let exchangeRepository: ExchangeRepository;
  const mockExchangeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRepository,
        {
          provide: getRepositoryToken(Exchange),
          useValue: mockExchangeRepository,
        },
      ],
    }).compile();

    exchangeRepository = module.get<ExchangeRepository>(ExchangeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(exchangeRepository).toBeDefined();
  });

  describe('createExchange', () => {
    it('should successfully create and save an exchange', async () => {
      const exchange: Partial<Exchange> = {
        id: '1',
        sourceCurrency: 'USD',
        targetCurrency: 'EUR',
        sourceValue: 100,
        targetValue: 85,
        userId: 'user1',
      };
      mockExchangeRepository.create.mockReturnValue(exchange);
      mockExchangeRepository.save.mockResolvedValue(exchange);

      const result = await exchangeRepository.createExchange(exchange);
      expect(mockExchangeRepository.create).toHaveBeenCalledWith(exchange);
      expect(mockExchangeRepository.save).toHaveBeenCalledWith(exchange);
      expect(result).toEqual(exchange);
    });
  });

  describe('findByUserId', () => {
    it('should return an array of exchanges with the given userId', async () => {
      const userId = 'user1';
      const exchanges: Exchange[] = [
        {
          id: '1',
          transactionId: '02092d27-69f3-4c5f-b16e-19b53d0374a4',
          rate: 1,
          datetime: '2023-04-14T00:00:00.000Z',
          sourceCurrency: 'USD',
          targetCurrency: 'EUR',
          sourceValue: 100,
          targetValue: 85,
          userId: 'user1',
        },
        {
          id: '2',
          transactionId: '02092d27-69f3-4c5f-b16e-19b53d037123',
          rate: 1.2,
          datetime: '2023-04-14T00:00:00.000Z',
          sourceCurrency: 'GBP',
          targetCurrency: 'USD',
          sourceValue: 50,
          targetValue: 68,
          userId: 'user1',
        },
      ];
      mockExchangeRepository.find.mockResolvedValue(exchanges);

      const result = await exchangeRepository.findByUserId(userId);
      expect(mockExchangeRepository.find).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(exchanges);
    });
  });
});