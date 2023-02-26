import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class FindTransactionsByUserInput implements Partial<User> {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;
}
