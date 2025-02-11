import { Injectable } from '@nestjs/common';
import { TaskAssignRepository } from './tasks-assign.repository';
import { ProjectMembersService } from '../project-members/project-members.service';
import { Result } from 'src/_shared/utils/result';

@Injectable()
export class TaskAssignService {
  constructor(
    private readonly taskAssignRepo: TaskAssignRepository,
    private readonly projectMemberService: ProjectMembersService,
  ) {}

  async assignTask(
    projectId: number,
    taskId: number,
    userId: number,
  ): Promise<Result<void>> {
    const isProjectMember = await this.projectMemberService.isProjectMember(
      projectId,
      userId,
    );

    if (!isProjectMember) {
      return { data: null, error: 'unauthorized' };
    }

    try {
      await this.taskAssignRepo.assignTask(taskId, userId);
      return { data: null, error: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { data: null, error: 'unprocessable' };
    }
  }

  async unnasignTask(taskId: number, userId: number): Promise<Result<void>> {
    try {
      await this.taskAssignRepo.unassignTask(taskId, userId);
      return { data: null, error: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { data: null, error: 'unprocessable' };
    }
  }

  async isTaskAssignee(taskId: number, userId: number): Promise<boolean> {
    const isTaskAssignee = await this.taskAssignRepo.isTaskAssignee(
      taskId,
      userId,
    );

    return isTaskAssignee;
  }
}
