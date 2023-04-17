import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateExchangeRequestDto } from '../dto/create-exchange-request.dto';
import { ExchangeResponseDto } from '../dto/exchange-response.dto';
import { ExchangesService } from '../services/exchanges.service';
import { Logger } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../auth.guard';

@Controller('exchanges')
export class ExchangesController {
    private readonly logger = new Logger(ExchangesController.name);
    constructor(private readonly exchangeService: ExchangesService) { }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Search user exchange rates by ID' })
    @ApiParam({ name: 'id', type: String, description: 'User ID' })
    @ApiResponse({
        status: 200,
        description: 'User exchange rates found successfully',
        type: ExchangeResponseDto,
        isArray: true,
    })
    async findByUserId(@Param('id') userId): Promise<ExchangeResponseDto[]> {
        this.logger.log(`Request to find user exchanges rates by user_id (${userId}) started`);

        return await this.exchangeService.findByUserId(userId);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @ApiOperation({ summary: 'Convert exchange rates' })
    @ApiBody({ type: CreateExchangeRequestDto })
    @ApiResponse({ status: 201, type: ExchangeResponseDto, description: 'Exchange rates successfully converted' })
    async create(@Body() createExchangeDto: CreateExchangeRequestDto): Promise<ExchangeResponseDto> {
        this.logger.log(`Request to convert an exchange rates started`);

        return await this.exchangeService.create(createExchangeDto);
    }
}
