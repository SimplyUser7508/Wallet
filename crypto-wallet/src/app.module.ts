import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Transaction } from 'typeorm';
import { User } from './users/users.entity';
import { Wallet } from './wallet/wallet.entity';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    WalletModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
      entities: [Wallet, Transaction, User],
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        ca: fs.readFileSync(process.env.CA)
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
