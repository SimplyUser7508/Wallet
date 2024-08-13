import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto{
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    email: string;

    @IsString({message: 'Должно быть строкой'})
    @Length(8, 24, {message: 'Более 8 символов и менее 24'})
    password: string;
    isActivated: boolean;
}