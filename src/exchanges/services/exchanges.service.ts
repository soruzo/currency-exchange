import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ExchangeRepository } from '../repositories/exchange.repository';
import { ExchangeRatesGateway } from '../gateways/exchange-rates.gateway';
import { Exchange } from '../entities/exchange.entity';
import { Logger } from '@nestjs/common';


@Injectable()
export class ExchangesService {
    private readonly logger = new Logger(ExchangesService.name);

    constructor(
        private readonly exchangeRepository: ExchangeRepository,
        private readonly exchangeGateway: ExchangeRatesGateway
    ) { }

    async create(exchange: Partial<Exchange>): Promise<Exchange> {
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
            const response = await this.exchangeRepository.createExchange(newExchange);
            this.logger.log(`Currency conversion process completed successfully from transaction: ${newExchange.transactionId}`);

            return response;

        } catch (error) {
            this.logger.error("Something wrong on the conversion process.");
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<Exchange[]> {
        try {
            this.logger.log(`Trying to find user by user_id: ${userId}`);
            return await this.exchangeRepository.findByUserId(userId);
        } catch (error) {
            this.logger.error("Something wrong on find user process.");
            throw error;
        }
    }
}
