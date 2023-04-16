import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ExchangeRatesGateway {
    constructor(
        private readonly httpService: HttpService
    ) { }

    async convert(amount: number, from: string, to: string) {
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
}