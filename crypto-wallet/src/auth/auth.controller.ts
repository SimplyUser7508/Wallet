import { Controller, Headers, Post, UseGuards, Body, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth/')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        return this.authService.register(userDto)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }       

    // @UseGuards(JwtAuthGuard)
   
}           