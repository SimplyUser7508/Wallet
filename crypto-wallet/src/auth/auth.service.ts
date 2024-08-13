import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/wallet/wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async validateUser(email: string, password: string): Promise<any>  {
        const user = await this.usersService.getUserByEmail(email);
        const passwordEquals = await bcrypt.compare(password, user.password);
        if (user && passwordEquals) {
            return user; 
        }
        throw new UnauthorizedException({message: 'Неверный email или пароль'});
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(userDto.password, salt);
        const user = await this.usersService.createUser({...userDto, password: hashPassword});

        return this.generateToken(user);
  }

  private async generateToken(user) {
    const paylaod = {email: user.email, id: user.id};
    return {
      token: this.jwtService.sign(paylaod)
    }
  }

  async login(userDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(userDto.email);
    return this.generateToken(user)
  }
}