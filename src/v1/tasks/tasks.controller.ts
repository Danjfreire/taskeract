import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';

@UseGuards(AuthGuard)
@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    const res = await this.tasksService.createTask(dto);

    if (res.error) {
      if (res.error === 'unauthorized') {
        throw new UnauthorizedException();
      }

      throw new UnprocessableEntityException();
    }

    return res.data;
  }
}
