import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserData } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@ObjectType()
export class User implements UserData {
  @Field()
  id: string;

  @Field()
  email: string;

  @Exclude()
  password: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Transaction])
  transactions: Transaction[];

  @Field(() => [String])
  refreshTokens: string[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
