import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exchange } from '../entities/exchange.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeRepository {
    constructor(
        @InjectRepository(Exchange)
        private readonly exchangeRepository: Repository<Exchange>,
    ) { }

    async createExchange(exchange: Partial<Exchange>): Promise<Exchange> {
        const response = this.exchangeRepository.create(exchange);
        const result = await this.exchangeRepository.save(response);
        return result;
    }

    async findByUserId(userId: string): Promise<Exchange[]> {
        return await this.exchangeRepository.find({ where: { userId } });
    }
}
