import { IsString, IsNumber, IsNotEmpty, IsIn } from 'class-validator';

export class CreateExchangeRequestDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    // @IsIn(['BRL', 'USD', 'EUR', 'JPY'])
    sourceCurrency: string;

    @IsNotEmpty()
    @IsNumber()
    sourceValue: number;

    @IsNotEmpty()
    @IsString()
    // @IsIn(['BRL', 'USD', 'EUR', 'JPY'])
    targetCurrency: string;
}
