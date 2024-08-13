import { Wallet } from 'src/wallet/wallet.entity';
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    Unique,
    OneToMany, 
} from 'typeorm';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @OneToMany(() => Wallet, wallet => wallet.user)
    wallets: Wallet[];
}
