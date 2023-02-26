import { Field, InputType } from '@nestjs/graphql';
import { TransactionType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Transaction } from '../entities/transaction.entity';

@InputType()
export class CreateTransactionInput implements Partial<Transaction> {
  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  price: number;
}
