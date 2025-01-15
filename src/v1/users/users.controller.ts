import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.createUser(body);

    return user;
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() body: CreateUserDto) {
    const res = await this.usersService.updateUser(id, body);

    if (res.error) {
      throw new NotFoundException('user-not-found');
    }

    return res.data;
  }
}
