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



    async create(exchange: Partial<Exchange>): Promise<ExchangeResponseDto> {
        this.logger.log(`Starting currency conversion process. From ${exchange.sourceCurrency} to ${exchange.targetCurrency}`);
        const { result, info } = await this.exchangeGateway.convert(exchange.sourceValue, exchange.sourceCurrency, exchange.targetCurrency);
        
        const dateFromTimestamp = new Date().toISOString();
        const transactionId = await uuid();
        const rate = info.quote;
        const targetValue = result;

        const newExchange = {
            ...exchange,
            transactionId,
            datetime: dateFromTimestamp,
            rate,
            targetValue,
        };

        this.logger.log(`Saving currency conversion information from transaction: ${transactionId}`);
        const createdExchange = await this.exchangeRepository.createExchange(newExchange);
        this.logger.log(`Currency conversion process completed successfully from transaction: ${transactionId}`);

        return this.toResponseDto(createdExchange, transactionId, dateFromTimestamp, rate, targetValue);
    }

    async findByUserId(userId: string): Promise<ExchangeResponseDto[]> {
        this.logger.log(`Trying to find user by user_id: ${userId}`);
        const exchanges = await this.exchangeRepository.findByUserId(userId);
        return exchanges.map(exchange => this.toResponseDto(
            exchange,
            exchange.transactionId,
            exchange.datetime,
            exchange.rate,
            exchange.targetValue
        ));
    }

    private toResponseDto(
        exchange: Exchange,
        transactionId: string,
        datetime: string,
        rate: number,
        targetValue: number
    ): ExchangeResponseDto {
        if (!exchange) {
            throw new Error("Exchange object is undefined");
        }

        const responseDto: ExchangeResponseDto = {
            transactionId,
            userId: exchange.userId,
            sourceCurrency: exchange.sourceCurrency,
            sourceValue: exchange.sourceValue,
            targetCurrency: exchange.targetCurrency,
            targetValue,
            rate,
            datetime,
        };

        return responseDto;
    }

}
