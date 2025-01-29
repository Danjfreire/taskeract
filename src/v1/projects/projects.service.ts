import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepo: ProjectsRepository) {}

  async createProject(dto: CreateProjectDto) {
    return await this.projectRepo.createProject(dto);
  }
}
