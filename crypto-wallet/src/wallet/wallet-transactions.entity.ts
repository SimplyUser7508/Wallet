import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from 'typeorm';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    from_wallet: string;

    @Column()
    to_wallet:string;

    @Column('decimal', { precision: 18, scale: 8 })
    amount: number;

    @Column()
    tx_hash: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
