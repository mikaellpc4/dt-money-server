import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RefreshSessionResponse {
  @Field()
  acess_token: string;
}
