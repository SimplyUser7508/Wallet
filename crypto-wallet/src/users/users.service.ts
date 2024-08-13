import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async findOne(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDto): Promise<User> { 
    const user = await this.usersRepository.save({ ...dto })
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({where: {email}});
    return user;
  }

  // async getUserIdByEmail(dto: CreateUserDto): Promise<number> {
  //   const email = dto.email;
  //   const user = await this.usersRepository.findOne({where: {email}});
  //   if (user) {
  //       return user.id;
  //   } else {
  //       throw new Error('Пользователь с таким email не найден');
  //   }
  // }
}