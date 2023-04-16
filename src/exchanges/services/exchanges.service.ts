import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exchange } from '../entities/exchange.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ExchangesService {
    constructor(
        @InjectRepository(Exchange)
        private readonly exchangeRepository: Repository<Exchange>,
        private readonly httpService: HttpService
    ) { }

    async create(exchange: Partial<Exchange>): Promise<Exchange> {
        const { result, info, date } = await this.convert(exchange.sourceValue, exchange.sourceCurrency, exchange.destinationCurrency);

        const dateFromTimestamp = new Date(date).toISOString();
        const newExchange = exchange;

        newExchange.transactionId = await uuid();
        newExchange.datetime = dateFromTimestamp;
        newExchange.rate = info.rate;
        newExchange.destinationValue = result;

        const response = this.exchangeRepository.create(newExchange);

        await this.exchangeRepository.save(response);

        return response;
    }

    async findByUserId(userId: string): Promise<Exchange[]> {

        return await this.exchangeRepository.find({ where: { userId } });
    }

    private async getRates(base: string, symbols: string) {
        const URL = `${process.env.EXCHANGE_API_URL}/latest`;
        const API_KEY = process.env.EXCHANGE_API_KEY;

        const response = await this.httpService
            .get(URL, {
                params: {
                    base,
                    symbols
                },
                headers: {
                    apikey: API_KEY,
                },
            })
            .pipe(map((response) => response.data))
            .toPromise();

        return response;
    }

    private async convert(amount: number, from: string, to: string) {
        const URL = `${process.env.EXCHANGE_API_URL}/convert`;
        const API_KEY = process.env.EXCHANGE_API_KEY;

        const response = await this.httpService
            .get(URL, {
                params: { amount, from, to },
                headers: {
                    apikey: API_KEY,
                },
            })
            .pipe(map((response) => response.data))
            .toPromise();

        return response;
    }
}
