import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Tokens } from '../entities/tokens.entity';

@ObjectType()
export class SignInResponse {
  @Field(() => Tokens)
  tokens: Tokens;

  @Field(() => User)
  user: User;
}
