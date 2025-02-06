import { Injectable } from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Result } from 'src/_shared/utils/result';
import { Task } from './models/task.model';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(
    projectId: number,
    dto: CreateTaskDto,
  ): Promise<Result<Task>> {
    try {
      const task = await this.taskRepository.createTask(projectId, dto);

      return { data: task, error: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { data: null, error: 'unprocessable' };
    }
  }
}
