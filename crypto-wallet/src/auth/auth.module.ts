import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import * as fs from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/wallet/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    UsersModule,
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    JwtModule.register({
      privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      publicKey: fs.readFileSync(process.env.PUBLIC_KEY_PATH),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {} 
