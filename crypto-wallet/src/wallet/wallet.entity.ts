import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne
} from 'typeorm';

import { User } from 'src/users/users.entity';

@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    address: string;

    @Column()
    private_key: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.wallets)
    user: User;

    @Column('decimal', { precision: 18, scale: 8 })
    balance: number;
}
