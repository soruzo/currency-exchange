import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SnakeToCamelInterceptor } from './app.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangesModule } from './exchanges/exchanges.module';
import { Exchange } from './exchanges/exchange.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Exchange],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false
      },
    }),
    ExchangesModule,
  ],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: SnakeToCamelInterceptor }]
})

export class AppModule { }