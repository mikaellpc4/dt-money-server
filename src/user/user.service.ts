import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // async findAll() {
  //   const users = await this.prisma.user.findMany({
  //     include: {
  //       transactions: true,
  //     },
  //   });
  //   const usersEntity = users.map((user) => {
  //     return new User(user);
  //   });
  //   return usersEntity;
  // }

  async findOne({
    id,
    email,
  }: {
    id?: string;
    email?: string;
  }): Promise<User | null> {
    if (!id && !email) {
      throw new BadRequestException('You need to provide a user id or email');
    }
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id },
          {
            email: {
              equals: email,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        transactions: true,
      },
    });
    if (!user) return null;
    return new User(user);
  }

  async update(id: string, updateUserDto: UpdateUserInput) {
    const { email, password } = updateUserDto;

    const user = await this.findOne({ id });
    if (!user) throw new NotFoundException('User Not Found');

    if (email) {
      const user = await this.findOne({ email });
      if (user) throw new BadRequestException('This email is already in use');
    }

    let hashedPassword: string;
    if (password) {
      hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.HASH_ROUNDS),
      );
    }
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
    return new User(updatedUser);
  }

  async remove(id: string, password: string) {
    const user = await this.findOne({ id });
    if (!user) throw new NotFoundException('User Not Found');

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) throw new UnauthorizedException('Incorrect Password');

    await this.prisma.transaction.deleteMany({
      where: {
        userId: id,
      },
    });

    const deletedUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return new User(deletedUser);
  }
}
