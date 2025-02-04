import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { Result } from 'src/_shared/utils/result';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await hash(dto.password, 10);

    return await this.usersRepository.createUser({
      ...dto,
      password: hashedPassword,
      role: dto.role ?? 'worker',
    });
  }

  async listUsers() {
    const users = await this.usersRepository.listUsers();

    return users;
  }

  async updateUser(userId: number, dto: UpdateUserDto): Promise<Result<User>> {
    const targetUser = await this.usersRepository.findUserById(userId);

    if (!targetUser) {
      return { data: null, error: 'not-found' };
    }

    for (const key in dto) {
      targetUser[key] = dto[key];
    }

    const res = await this.usersRepository.updateUser(userId, targetUser);

    return { data: res, error: null };
  }

  async deleteUser(userId: number): Promise<Result<boolean>> {
    const targetUser = await this.usersRepository.findUserById(userId);

    if (!targetUser) {
      return { data: null, error: 'not-found' };
    }

    try {
      await this.usersRepository.deleteUser(userId);
      return { data: true, error: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.error(error);
      return { data: null, error: 'internal-error' };
    }
  }
}
