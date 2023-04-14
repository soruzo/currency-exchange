import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
    destinationCurrency: string;

    @Column({ type: 'float', nullable: false, default: 0 })
    destinationValue: number;

    @Column({ type: 'float', nullable: false, default: 0 })
    rate: number;

    @Column()
    datetime: string;
}