import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TaskAssignService } from './task-assign.service';
import { TaskAssignDto } from './dto/task-assign.dto';

@Controller('v1/projects/:projectId/tasks/:taskId/assign')
export class TaskAssignController {
  constructor(private readonly taskAssignService: TaskAssignService) {}

  @Post()
  async assignTask(
    @Param('projectId') projectId: number,
    @Param('taskId') taskId: number,
    @Body() body: TaskAssignDto,
  ) {
    const res = await this.taskAssignService.assignTask(
      projectId,
      taskId,
      body.user_id,
    );

    if (res.error) {
      if (res.error === 'unauthorized') {
        throw new UnauthorizedException();
      }

      throw new UnprocessableEntityException();
    }
  }

  @Delete('/:userId')
  async unnassignTask(
    @Param('taskId') taskId: number,
    @Param('userId') userId: number,
  ) {
    const res = await this.taskAssignService.unnasignTask(taskId, userId);

    if (res.error) {
      throw new UnprocessableEntityException();
    }
  }
}
