import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from './entities/transaction.entity';
// import { FindTransactionsByUserInput } from './dto/find-user-transactions.input';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userServices: UserService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionInput) {
    const { description, category, price, type } = createTransactionDto;

    const user = await this.userServices.findOne({ id: userId });
    if (!user) throw new NotFoundException('User Not Found');

    const newTransaction = await this.prisma.transaction.create({
      data: {
        description,
        category,
        price,
        type,
        userId,
      },
    });
    return new Transaction(newTransaction);
  }

  async findAll(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
      },
    });
    const transactionsEntity = transactions.map((transaction) => {
      return new Transaction(transaction);
    });
    return transactionsEntity;
  }

  async findOne(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    });
    if (!transaction) return null;
    return new Transaction(transaction);
  }

  // async findByUser({ id, username }: FindTransactionsByUserInput) {
  //   const user = await this.userServices.findOne({ id, email: username });
  //   if (!user) throw new NotFoundException('User Not Found');
  //
  //   const transactions = await this.prisma.transaction.findMany({
  //     where: {
  //       userId: {
  //         equals: user.id,
  //       },
  //     },
  //   });
  //
  //   const transactionsEntity = transactions.map((transaction) => {
  //     return new Transaction(transaction);
  //   });
  //   return transactionsEntity;
  // }

  async update(userId: string, updateTransactionInput: UpdateTransactionInput) {
    const { id, description, category, price, type } = updateTransactionInput;

    const transaction = await this.findOne(id);
    if (!transaction) throw new BadRequestException('Transaction Not Found');

    // Only the owner of the transaction can update
    if (transaction.userId !== userId) {
      throw new UnauthorizedException(
        "You aren't the owner of this transaction",
      );
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: {
        id,
      },
      data: {
        category,
        description,
        price,
        type,
        updatedAt: new Date(),
      },
    });
    return new Transaction(updatedTransaction);
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id);
    if (!transaction) throw new BadRequestException('Transaction Not Found');

    // Only the owner of the transaction can delete
    if (transaction.userId !== userId) {
      throw new UnauthorizedException(
        "You aren't the owner of this transaction",
      );
    }

    const removedTransaction = await this.prisma.transaction.delete({
      where: {
        id,
      },
    });
    return removedTransaction;
  }
}
