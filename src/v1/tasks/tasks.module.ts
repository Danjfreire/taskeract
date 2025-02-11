import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';
import { TaskRepository } from './tasks.repository';
import { DatabaseModule } from 'src/_shared/database/database.module';
import { ProjectMembersModule } from '../project-members/project-members.module';
import { TaskAssignModule } from '../task-assign/task-assign.module';

@Module({
  imports: [ProjectMembersModule, AuthModule, DatabaseModule, TaskAssignModule],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
