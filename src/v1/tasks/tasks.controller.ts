import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { UpdateTaskDto } from './dto/edit-task.dto';
import {
  RequestUser,
  ReqUser,
} from '../auth/decorators/request-user.decorator';
import { AllowWithRole } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('v1/projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @AllowWithRole('admin')
  @Post()
  async createTask(
    @Param('projectId') projectId: number,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    const res = await this.tasksService.createTask(projectId, dto);

    if (res.error) {
      if (res.error === 'unauthorized') {
        throw new UnauthorizedException();
      }

      throw new UnprocessableEntityException();
    }

    return res.data;
  }

  @Put('/:taskId')
  async updateTask(
    @Param('taskId') taskId: number,
    @Body() dto: UpdateTaskDto,
    @ReqUser() user: RequestUser,
  ): Promise<Task> {
    const res = await this.tasksService.editTask(taskId, user, dto);

    if (res.error) {
      if (res.error === 'unauthorized') {
        throw new UnauthorizedException();
      }

      if (res.error === 'not-found') {
        throw new NotFoundException();
      }
    }

    return res.data;
  }

  @AllowWithRole('admin')
  @Delete('/:taskId')
  async deleteTask(@Param('taskId') taskId: number) {
    const res = await this.tasksService.deleteTask(taskId);

    if (res.error) {
      throw new NotFoundException();
    }
  }
}
