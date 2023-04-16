import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';
import { ExchangeResponseDto } from './dto/exchange-response.dto';
import { ExchangesService } from './exchanges.service';

@Controller('exchanges')
export class ExchangesController {

    constructor(private readonly exchangeService: ExchangesService) { }

    @Get(':id')
    async findAllById(@Param('id') userId): Promise<ExchangeResponseDto[]> {

        return await this.exchangeService.findByUserId(userId);
    }

    @Post()
    async create(@Body() createExchangeDto: CreateExchangeRequestDto): Promise<ExchangeResponseDto> {
        await this.exchangeService.create(createExchangeDto);

        return await this.exchangeService.create(createExchangeDto);
    }
}
