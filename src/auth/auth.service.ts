import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInput } from './dto/sign-up.input';
import { CustomJwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private customJwtService: CustomJwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new UnauthorizedException();

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException();

    return new User(user);
  }

  async signIn(user: User) {
    const tokens = await this.customJwtService.getTokens(user.id);

    return {
      tokens,
      user,
    };
  }

  async signOut(refreshToken: string) {
    const removedRefreshToken = await this.customJwtService.removeRefreshToken(
      refreshToken,
    );
    return { refreshToken: removedRefreshToken };
  }

  async signUp(createUserInput: SignUpInput) {
    const { email, password } = createUserInput;

    const user = await this.userService.findOne({ email });
    if (user) {
      throw new BadRequestException('This email is already in use');
    }

    const hashedPassowrd = await bcrypt.hash(
      password,
      Number(process.env.HASH_ROUNDS),
    );
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassowrd,
      },
    });
    return new User(newUser);
  }

  async refreshSession(refreshToken: string) {
    const { status, decodedToken } =
      await this.customJwtService.validateRefreshToken(refreshToken);
    if (status !== 'Ok') {
      throw new UnauthorizedException(`${status} Refresh Token`);
    }
    const newAcessToken = await this.customJwtService.generateAcessToken(
      decodedToken.sub,
    );
    console.log({ newAcessToken });
    return { acess_token: newAcessToken };
  }
}
