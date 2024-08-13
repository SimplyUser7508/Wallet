import { IsString, IsNotEmpty } from 'class-validator';

export class SendTransactionDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
