import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskAssignModule } from './task-assign/task-assign.module';

@Module({
  imports: [UsersModule, AuthModule, ProjectsModule, ProjectMembersModule, TasksModule, TaskAssignModule],
})
export class V1Module {}
