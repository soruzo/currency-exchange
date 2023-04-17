import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

@Entity()
export class Exchange {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    transactionId: string

    @Column()
    sourceCurrency: string;

    @Column({ type: 'float', nullable: false, default: 0 })
    sourceValue: number;

    @Column()
    targetCurrency: string;

    @Column({ type: 'float', nullable: false, default: 0 })
    targetValue: number;

    @Column({ type: 'float', nullable: false, default: 0 })
    rate: number;

    @Column()
    datetime: string;
}