import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangesController } from './controllers/exchanges.controller';
import { ExchangesService } from './services/exchanges.service';
import { Exchange } from './entities/exchange.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange]), HttpModule],
  controllers: [ExchangesController],
  providers: [ExchangesService],
})
export class ExchangesModule { }
