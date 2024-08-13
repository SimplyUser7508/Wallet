import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import * as BN from 'bn.js';
import { User } from 'src/users/users.entity';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './wallet-transactions.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WalletService {
  private web3: Web3;

  constructor(
    public authService: AuthService,
    private jwtService: JwtService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    const infuraProjectId = process.env.INFURA_PROJECT_ID;
    if (!infuraProjectId) {
      throw new Error('INFURA_PROJECT_ID is not defined');
    }
    this.web3 = new Web3(`https://sepolia.infura.io/v3/${infuraProjectId}`);
  }

  async createAccount(user: User, token: string): Promise<Wallet> {
    const account = this.web3.eth.accounts.create();
    const id = await this.getUserIdFromToken(token);

    const wallet = new Wallet();
    wallet.address = account.address;
    wallet.private_key = account.privateKey; // Приватный ключ рекомендуется шифровать
    wallet.userId = id;
    wallet.user = user;
    wallet.balance = 0; // Изначально баланс равен 0

    return await this.walletRepository.save(wallet);
  }

  async getBalance(address: string): Promise<string> {
    const addressFromToken = await this.getWalletAddressFromToken(address);
    const balanceInWei = await this.web3.eth.getBalance(addressFromToken);
    return this.web3.utils.fromWei(balanceInWei, 'ether');
  }

  async getPrivateKeyFromToken(token: string): Promise<string> {
    const decodedToken = this.jwtService.decode(token);
    if (decodedToken && typeof decodedToken === 'object') {
      const id = decodedToken.id;
      const wallet = await this.walletRepository.findOne({
        where: { id: id },
        select: ['private_key'],
      });
  
      if (!wallet) {
        throw new Error('Wallet not found for the user');
      }
  
      return wallet.private_key;
    } else {
      throw new Error('Invalid token format');
    }
  }

  async getUserIdFromToken(token: string): Promise<number> {
    const decodedToken = this.jwtService.decode(token);
    if (decodedToken && typeof decodedToken === 'object' && decodedToken.hasOwnProperty('email')) {
      if (decodedToken) {
        return decodedToken.id;
      } else {
        throw new Error('Пользователь с таким email не найден');
      }
    } else {
      throw new Error('Неверный формат токена или отсутствует email');
    }
  }

  async getWalletAddressFromToken(token: string): Promise<string> {
    const decodedToken = this.jwtService.decode(token);
    if (decodedToken) {
      const id = decodedToken.id;
      const wallet = await this.walletRepository.findOne({
        where: { id: id },
        select: ['address'],
      });
  
      if (!wallet) {
        throw new Error('Wallet not found for the user');
      }
  
      return wallet.address;
    } else {
      throw new Error('Invalid token format');
    }
  }

  async getHistoryFromToken(token: string): Promise<Date[]> {
    const decodedToken = this.jwtService.decode(token);
    if (decodedToken) {
        const id = decodedToken.id;
        const wallet = await this.walletRepository.findOne({
            where: { id: id },
            select: ['address'],
        });

        if (!wallet) {
            throw new Error('Wallet not found for the user');
        }

        const transactions = await this.transactionRepository.find({
            where: { from_wallet: wallet.address },
            select: ['created_at'],
        });

        // Извлечение created_at из каждого элемента массива transactions
        const createdDates = transactions.map(transaction => transaction.created_at);

        return createdDates;
    } else {
        throw new Error('Invalid token format');
    }
  }


  async sendTransaction(toWallet: string, value: string, token: string): Promise<Transaction> {
    const fromWallet = await this.getWalletAddressFromToken(token);

    // Получение баланса отправителя
    const balance = await this.web3.eth.getBalance(fromWallet);
    const balanceInEth = this.web3.utils.fromWei(balance, 'ether');

    // Рассчёт стоимости транзакции
    const valueInWei = this.web3.utils.toWei(value, 'ether');
    const gasLimit = await this.web3.eth.estimateGas({
      from: fromWallet,
      to: toWallet,
      value: valueInWei,
    });
    const gasPrice = await this.web3.eth.getGasPrice();
    const transactionCost = new BN(gasLimit).mul(new BN(gasPrice)).add(new BN(valueInWei));
    const transactionCostInEth = this.web3.utils.fromWei(transactionCost, 'ether');

    if (parseFloat(balanceInEth) < parseFloat(transactionCostInEth)) {
      throw new Error('Insufficient funds');
    }

    const private_key = await this.getPrivateKeyFromToken(token);

    // Подписание и отправка транзакции
    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        from: fromWallet,
        to: toWallet,
        value: valueInWei,
        gas: gasLimit,
        gasPrice,
      },
      await private_key, // Подписание транзакции приватным ключом
    );
    
    // Отправка подписанной транзакции
    const txReceipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    // Преобразование transactionHash в строку, если это Uint8Array
    const txHash: string = typeof txReceipt.transactionHash === 'string'
      ? txReceipt.transactionHash
      : this.web3.utils.bytesToHex(txReceipt.transactionHash);
    
    // Создание и сохранение транзакции в базе данных
    const transaction = new Transaction();
    transaction.from_wallet = fromWallet;
    transaction.to_wallet = toWallet;
    transaction.amount = parseFloat(value);
    transaction.tx_hash = txHash;
    
    return await this.transactionRepository.save(transaction); 
  }
}
