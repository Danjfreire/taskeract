import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ProjectsModule } from '../projects/projects.module';
import { AuthModule } from '../auth/auth.module';
import { TaskRepository } from './tasks.repository';
import { DatabaseModule } from 'src/_shared/database/database.module';

@Module({
  imports: [ProjectsModule, AuthModule, DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
