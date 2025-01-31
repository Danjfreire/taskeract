import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Result } from 'src/_shared/utils/result';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepo: ProjectsRepository) {}

  async createProject(dto: CreateProjectDto): Promise<Result<Project>> {
    const project = await this.projectRepo.createProject(dto);

    return { data: project, error: null };
  }

  async updateProject(
    id: number,
    dto: UpdateProjectDto,
  ): Promise<Result<Project>> {
    const project = await this.projectRepo.findProjectById(id);

    if (!project) {
      return { data: null, error: 'not-found' };
    }

    project.startDate = dto.startDate ?? project.startDate;
    project.endDate = dto.endDate ?? project.endDate;
    project.title = dto.title ?? project.title;
    project.description = dto.description ?? project.description;
    project.status = dto.status ?? project.status;

    const updatedProject = await this.projectRepo.updateProject(id, project);

    return { data: updatedProject, error: null };
  }
}
