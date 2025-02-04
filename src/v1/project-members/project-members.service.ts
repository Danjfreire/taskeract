import { Injectable } from '@nestjs/common';
import { ProjectMembersRepository } from './project-members.repository';
import { Result } from 'src/_shared/utils/result';

@Injectable()
export class ProjectMembersService {
  constructor(private readonly projectMembersRepo: ProjectMembersRepository) {}

  async addMembersToProject(
    projectId: number,
    members: number[],
  ): Promise<Result<void>> {
    try {
      await this.projectMembersRepo.addMembersToProject(projectId, members);

      return { data: null, error: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { data: null, error: 'unprocessable' };
    }
  }

  async isProjectMember(projectId: number, userId: number): Promise<boolean> {
    return this.projectMembersRepo.isProjectMember(projectId, userId);
  }
}
