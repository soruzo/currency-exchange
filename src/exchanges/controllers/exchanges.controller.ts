import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateExchangeRequestDto } from '../dto/create-exchange-request.dto';
import { ExchangeResponseDto } from '../dto/exchange-response.dto';
import { ExchangesService } from '../services/exchanges.service';
import { Logger } from '@nestjs/common';

@Controller('exchanges')
export class ExchangesController {
    private readonly logger = new Logger(ExchangesController.name);
    constructor(private readonly exchangeService: ExchangesService) { }

    @Get(':id')
    async findByUserId(@Param('id') userId): Promise<ExchangeResponseDto[]> {
        this.logger.log(`Request to find user exchanges rates by user_id (${userId}) started`);

        return await this.exchangeService.findByUserId(userId);
    }

    @Post()
    async create(@Body() createExchangeDto: CreateExchangeRequestDto): Promise<ExchangeResponseDto> {
        this.logger.log(`Request to convert an exchange rates started`);

        return await this.exchangeService.create(createExchangeDto);
    }
}
