import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { FindUserInput } from './dto/find-user.input';

@Resolver(() => User)
@UsePipes(ValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  // @Query(() => [User], { name: 'users' })
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Query(() => User, { name: 'profile' })
  // findOne(@Args('findUserInput') findUserInput: FindUserInput) {
  //   return this.userService.findOne(findUserInput);
  // }

  @Query(() => User, { name: 'profile' })
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() id: string) {
    return this.userService.findOne({ id });
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @CurrentUser() id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  removeUser(@CurrentUser() id: string, @Args('password') password: string) {
    return this.userService.remove(id, password);
  }
}
