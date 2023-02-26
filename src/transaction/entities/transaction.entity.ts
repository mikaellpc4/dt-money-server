import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Transaction as TransactionData,
  TransactionType,
} from '@prisma/client';

registerEnumType(TransactionType, { name: 'TypeOfTransaction' });

@ObjectType()
export class Transaction implements TransactionData {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field()
  category: string;

  @Field()
  price: number;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  constructor(partial: Partial<TransactionData>) {
    Object.assign(this, partial);
  }
}
