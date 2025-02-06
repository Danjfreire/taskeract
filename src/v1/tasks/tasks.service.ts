import { Injectable } from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Result } from 'src/_shared/utils/result';
import { Task } from './models/task.model';
import { RequestUser } from '../auth/decorators/request-user.decorator';
import { ProjectMembersService } from '../project-members/project-members.service';
import { UpdateTaskDto } from './dto/edit-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectMemberService: ProjectMembersService,
  ) {}

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

  async editTask(
    projectId: number,
    taskId: number,
    user: RequestUser,
    dto: UpdateTaskDto,
  ): Promise<Result<Task>> {
    // check if user can edit task
    const isAdmin = user.role === 'admin';
    const isProjectMember = await this.projectMemberService.isProjectMember(
      projectId,
      user.id,
    );
    const canEdit = isAdmin || isProjectMember;

    if (!canEdit) {
      return { data: null, error: 'unauthorized' };
    }

    const task = await this.taskRepository.findTask(taskId);

    if (!task) {
      return { data: null, error: 'not-found' };
    }

    dto.status = dto.status ?? task.status;
    dto.priority = dto.priority ?? task.priority;
    dto.due_date = dto.due_date ?? task.due_date;
    dto.description = dto.description ?? task.description;
    dto.title = dto.title ?? task.title;

    const updatedTask = await this.taskRepository.updateTask(taskId, dto);

    return { data: updatedTask, error: null };
  }
}
