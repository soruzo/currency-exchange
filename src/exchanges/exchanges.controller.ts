import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';
import { CreateExchangeResponseDto } from './dto/create-exchange-response.dto';
import { FindExchangeResponseDto } from './dto/find-exchange-response.dto';
import { ExchangesService } from './exchanges.service';

@Controller('exchanges')
export class ExchangesController {

    constructor(private readonly exchangeService: ExchangesService) { }

    @Get(':id')
    async findAllById(@Param('id') userId): Promise<FindExchangeResponseDto[]> {

        return await this.exchangeService.findByUserId(userId);
    }

    @Post()
    async create(@Body() createExchangeDto: CreateExchangeRequestDto): Promise<CreateExchangeResponseDto> {
        await this.exchangeService.create(createExchangeDto);

        return await this.exchangeService.create(createExchangeDto);
    }
}
