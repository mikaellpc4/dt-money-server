import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class LoginResponse {
  // @Field()
  // refresh_token: string;

  @Field()
  acess_token: string;

  @Field(() => User)
  user: User;
}
