import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { SendTransactionDto } from './dto/wallet.dto';
import { User } from 'src/users/users.entity';

@Controller('web3/')
export class WalletController {
  constructor(private readonly web3Service: WalletService) {}

  @Post('create-account')
  async createAccount(@Headers('Authorization') authHeader: string, user: User) {
    const token = authHeader.split(' ')[1]; 
    return this.web3Service.createAccount(user, token);
  }

  @Post('get-balance')
  async getBalance(@Headers('Authorization') authHeader: string) {
      return this.web3Service.getBalance(authHeader);
  }

  @Post('send-transaction')
  async sendTransaction(@Body() sendTransactionDto: SendTransactionDto, @Headers('Authorization') authHeader: string) {
    await this.web3Service.sendTransaction(
      sendTransactionDto.to,
      sendTransactionDto.value,
      authHeader
    );
  }

  @Get('profile')
  async getProfile(@Headers('Authorization') authHeader: string) {
      const walletAddress = await this.web3Service.getWalletAddressFromToken(authHeader);
      return { address: walletAddress };
  }

  @Get('history')
  async getHistory(@Headers('Authorization') authHeader: string) {
      const walletHistory = await this.web3Service.getHistoryFromToken(authHeader);
      return { history: walletHistory };
  }
}
