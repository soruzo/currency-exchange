export class ExchangeResponseDto {
    transactionId: string;
    userId: string;
    sourceCurrency: string;
    sourceValue: number;
    targetCurrency: string;
    targetValue: number;
    rate: number;
    datetime: string;
}
