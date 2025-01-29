import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProjectsService } from './projects.service';
import { AllowWithRole } from '../auth/decorators/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';

@UseGuards(AuthGuard)
@Controller('v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @AllowWithRole('admin')
  @Post()
  async createProject(@Body() data: CreateProjectDto) {
    const res = await this.projectsService.createProject(data);

    return res;
  }
}
