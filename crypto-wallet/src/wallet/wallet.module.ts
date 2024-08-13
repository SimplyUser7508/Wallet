import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UsersModule } from 'src/users/users.module';
import { Wallet } from './wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Transaction } from './wallet-transactions.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Wallet, Transaction]),
  ],
  controllers: [WalletController],
  providers: [WalletService, JwtService],
  exports: [WalletService]
})
export class WalletModule {}
