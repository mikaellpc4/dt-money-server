import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
  @Field()
  acess_token: string;

  @Field()
  refresh_token: string;
}
