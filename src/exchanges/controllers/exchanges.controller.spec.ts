import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from '../services/exchanges.service';
import { CreateExchangeRequestDto } from '../dto/create-exchange-request.dto';
import { ExchangeResponseDto } from '../dto/exchange-response.dto';

describe('ExchangesController', () => {
  let controller: ExchangesController;
  let service: ExchangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangesController],
      providers: [
        {
          provide: ExchangesService,
          useValue: {
            findByUserId: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExchangesController>(ExchangesController);
    service = module.get<ExchangesService>(ExchangesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllById', () => {
    it('should call ExchangesService.findByUserId with correct parameter', async () => {
      const userId = 'user-id';
      await controller.findByUserId(userId);
      expect(service.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return the result of ExchangesService.findByUserId', async () => {
      const userId = 'user-id';
      const expectedResult: ExchangeResponseDto[] = [];
      (service.findByUserId as jest.Mock).mockResolvedValue(expectedResult);
      const result = await controller.findByUserId(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should call ExchangesService.create with correct parameter', async () => {
      const createExchangeDto: CreateExchangeRequestDto = {
        userId: 'user-id',
        sourceCurrency: 'USD',
        sourceValue: 100,
        targetCurrency: 'EUR',
      };
      await controller.create(createExchangeDto);
      expect(service.create).toHaveBeenCalledWith(createExchangeDto);
    });

    it('should return the result of ExchangesService.create', async () => {
      const createExchangeDto: CreateExchangeRequestDto = {
        userId: 'user-id',
        sourceCurrency: 'USD',
        sourceValue: 100,
        targetCurrency: 'EUR',
      };
      const expectedResult: ExchangeResponseDto = {
        transactionId: 'exchange-id',
        rate: 1,
        targetValue: 2,
        datetime: "",
        ...createExchangeDto,
      };
      (service.create as jest.Mock).mockResolvedValue(expectedResult);
      const result = await controller.create(createExchangeDto);
      expect(result).toEqual(expectedResult);
    });
  });
});