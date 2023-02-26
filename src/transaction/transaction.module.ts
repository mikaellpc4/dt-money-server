import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
  providers: [UserService, TransactionService, TransactionResolver],
  imports: [UserModule],
})
export class TransactionModule {}
