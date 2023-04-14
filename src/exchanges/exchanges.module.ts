import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';
import { Exchange } from './exchange.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange]), HttpModule],
  controllers: [ExchangesController],
  providers: [ExchangesService],
})
export class ExchangesModule { }
