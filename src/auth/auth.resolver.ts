import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CustomJwtService } from 'src/jwt/jwt.service';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { RefreshSessionResponse } from './dto/refresh-session.response';
import { SignInInput } from './dto/sign-in.input';
import { SignInResponse } from './dto/sign-in.response';
import { SignOutResponse } from './dto/sign-out.response';
import { SignUpInput } from './dto/sign-up.input';
import { Tokens } from './entities/tokens.entity';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private jwtService: CustomJwtService,
  ) {}

  @Mutation(() => User)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => SignInResponse)
  @UseGuards(GqlAuthGuard)
  signIn(
    @Args('signInInput') _signInInput: SignInInput,
    @Context() context: any,
  ) {
    return this.authService.signIn(context.user);
  }

  @Mutation(() => RefreshSessionResponse)
  refreshSession(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshSession(refreshToken);
  }

  @Mutation(() => Tokens)
  updateRefreshToken(@Args('refreshToken') refreshToken: string) {
    return this.jwtService.updateRefreshToken(refreshToken);
  }

  @Mutation(() => SignOutResponse)
  signOut(@Args('refreshToken') refreshToken: string) {
    return this.authService.signOut(refreshToken);
  }
}
