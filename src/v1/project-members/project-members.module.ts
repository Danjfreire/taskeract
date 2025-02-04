import { Module } from '@nestjs/common';
import { ProjectMembersController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';
import { ProjectMembersRepository } from './project-members.repository';
import { DatabaseModule } from 'src/_shared/database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService, ProjectMembersRepository],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
