export class CreateExchangeResponseDto {
    transactionId: string;
    userId: string;
    sourceCurrency: string;
    sourceValue: number;
    destinationCurrency: string;
    destinationValue: number;
    rate: number;
    datetime: string; 
}
