import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/v1/auth/guards/auth.guard';
import { AllowWithRole } from 'src/v1/auth/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @AllowWithRole('admin')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.createUser(body);

    return user;
  }

  @Get()
  @AllowWithRole('admin')
  async listUsers() {
    const users = await this.usersService.listUsers();
    return users;
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() body: CreateUserDto) {
    const res = await this.usersService.updateUser(id, body);

    if (res.error) {
      throw new NotFoundException('user-not-found');
    }

    return res.data;
  }

  @Delete(':id')
  @AllowWithRole('admin')
  async deleteUser(@Param('id') id: number) {
    const res = await this.usersService.deleteUser(id);

    if (res.error) {
      throw new NotFoundException('user-not-found');
    }
  }
}
