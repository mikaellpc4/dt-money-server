import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    // Passport don't support GraphQL because
    // GraphQL don't have a Request Object, but he have aobject Context
    const ctx = GqlExecutionContext.create(context);

    //Converts the GraphQL Context to a Request Object
    const request = ctx?.getContext();
    request.body = ctx.getArgs().loginUserInput;

    return request;
  }
}
