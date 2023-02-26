import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
// import { FindTransactionsByUserInput } from './dto/find-user-transactions.input';

@Resolver(() => Transaction)
@UsePipes(ValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction)
  @UseGuards(JwtAuthGuard)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
    @CurrentUserId() userId: string,
  ) {
    return this.transactionService.create(userId, createTransactionInput);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUserId() userId: string) {
    return this.transactionService.findAll(userId);
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(@Args('id') id: string) {
    return this.transactionService.findOne(id);
  }

  // @Query(() => [Transaction], { name: 'userTransactions' })
  // findByUser(
  //   @Args('findTransactionsByUserInput')
  //   findTransactionsByUserInput: FindTransactionsByUserInput,
  // ) {
  //   return this.transactionService.findByUser(findTransactionsByUserInput);
  // }

  @Mutation(() => Transaction)
  @UseGuards(JwtAuthGuard)
  updateTransaction(
    @Args('updateTransactionInput')
    updateTransactionInput: UpdateTransactionInput,
    @CurrentUserId() userId: string,
  ) {
    return this.transactionService.update(userId, updateTransactionInput);
  }

  @Mutation(() => Transaction)
  @UseGuards(JwtAuthGuard)
  removeTransaction(@Args('id') id: string, @CurrentUserId() userId: string) {
    return this.transactionService.remove(id, userId);
  }
}
