import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ExchangeRepository } from '../repositories/exchange.repository';
import { ExchangeRatesGateway } from '../gateways/exchange-rates.gateway';
import { Exchange } from '../entities/exchange.entity';
import { Logger } from '@nestjs/common';
import { ExchangeResponseDto } from '../dto/exchange-response.dto';

@Injectable()
export class ExchangesService {
    private readonly logger = new Logger(ExchangesService.name);

    constructor(
        private readonly exchangeRepository: ExchangeRepository,
        private readonly exchangeGateway: ExchangeRatesGateway
    ) { }

    private toResponseDto(exchange: Exchange): ExchangeResponseDto {
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
    }

    async create(exchange: Partial<Exchange>): Promise<ExchangeResponseDto> {
        try {
            this.logger.log(`Starting currency conversion process. From ${exchange.sourceCurrency} to ${exchange.targetCurrency}`);
            const { result, info, date } = await this.exchangeGateway.convert(exchange.sourceValue, exchange.sourceCurrency, exchange.targetCurrency);

            const dateFromTimestamp = new Date(date).toISOString();
            const newExchange = exchange;

            newExchange.transactionId = await uuid();
            newExchange.datetime = dateFromTimestamp;
            newExchange.rate = info.rate;
            newExchange.targetValue = result;

            this.logger.log(`Saving currency conversion information from transaction: ${newExchange.transactionId}`);
            const createdExchange = await this.exchangeRepository.createExchange(newExchange);
            this.logger.log(`Currency conversion process completed successfully from transaction: ${newExchange.transactionId}`);

            return this.toResponseDto(createdExchange);

        } catch (error) {
            this.logger.error("Something wrong on the conversion process.");
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<ExchangeResponseDto[]> {
        try {
            this.logger.log(`Trying to find user by user_id: ${userId}`);
            const exchanges = await this.exchangeRepository.findByUserId(userId);
            return exchanges.map(this.toResponseDto);
        } catch (error) {
            this.logger.error("Something wrong on find user process.");
            throw error;
        }
    }
}
