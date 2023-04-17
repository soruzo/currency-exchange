import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRatesGateway } from './exchange-rates.gateway';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('ExchangeRatesGateway', () => {
  let exchangeRatesGateway: ExchangeRatesGateway;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExchangeRatesGateway],
    }).compile();

    exchangeRatesGateway = module.get<ExchangeRatesGateway>(ExchangeRatesGateway);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(exchangeRatesGateway).toBeDefined();
  });

  describe('convert', () => {
    it('should return converted amount', async () => {
      const amount = 100;
      const from = 'USD';
      const to = 'EUR';
      const expectedResult = {
        success: true,
        query: {
          from: "EUR",
          to: "BRL",
          amount: 1
        },
        info: {
          timestamp: 1681728963,
          quote: 5.394539
        },
        result: 5.394539
      }

      const mockResponse = {
        data: expectedResult,
      };

      httpService.get = jest.fn().mockImplementation(() => of(mockResponse));

      const result = await exchangeRatesGateway.convert(amount, from, to);

      expect(httpService.get).toBeCalledWith(
        expect.stringMatching(/convert/),
        expect.objectContaining({
          params: { amount, from, to },
          headers: {
            apikey: expect.any(String),
          },
        }),
      );
      expect(result).toEqual(expectedResult);
    });
  });
});