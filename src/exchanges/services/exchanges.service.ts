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

            this.logger.log(`Starting currency conversion process. From ${exchange.sourceCurrency} to ${exchange.destinationCurrency}`);
            const { result, info, date } = await this.exchangeGateway.convert(exchange.sourceValue, exchange.sourceCurrency, exchange.destinationCurrency);

            const dateFromTimestamp = new Date(date).toISOString();
            const newExchange = exchange;

            newExchange.transactionId = await uuid();
            newExchange.datetime = dateFromTimestamp;
            newExchange.rate = info.rate;
            newExchange.destinationValue = result;

            this.logger.log(`Saving currency conversion information from transaction: ${newExchange.transactionId}`);
            const response = await this.exchangeRepository.createExchange(newExchange);
            this.logger.log(`Currency conversion process completed successfully from transaction: ${newExchange.transactionId}`);

            return response;

        } catch (error) {
            this.logger.error("Something wrong in the conversion process.")
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<Exchange[]> {
        return await this.exchangeRepository.findByUserId(userId);
    }

}
