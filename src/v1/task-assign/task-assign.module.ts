import { Module } from '@nestjs/common';
import { TaskAssignController } from './task-assign.controller';
import { TaskAssignService } from './task-assign.service';
import { TaskAssignRepository } from './tasks-assign.repository';
import { ProjectMembersModule } from '../project-members/project-members.module';
import { DatabaseModule } from 'src/_shared/database/database.module';

@Module({
  imports: [ProjectMembersModule, DatabaseModule],
  controllers: [TaskAssignController],
  providers: [TaskAssignService, TaskAssignRepository],
  exports: [TaskAssignService],
})
export class TaskAssignModule {}
