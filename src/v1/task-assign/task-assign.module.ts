import { Module } from '@nestjs/common';
import { TaskAssignController } from './task-assign.controller';
import { TaskAssignService } from './task-assign.service';

@Module({
  controllers: [TaskAssignController],
  providers: [TaskAssignService],
})
export class TaskAssignModule {}
