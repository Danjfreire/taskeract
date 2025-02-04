import { Injectable } from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Result } from 'src/_shared/utils/result';
import { Task } from './models/task.model';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private projectService: ProjectsService,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Result<Task>> {
    // TODO: check if user has access to the project, and if the project exists
    try {
      const task = await this.taskRepository.createTask(dto);

      return { data: task, error: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { data: null, error: 'unprocessable' };
    }
  }
}
