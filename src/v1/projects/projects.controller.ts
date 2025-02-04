import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProjectsService } from './projects.service';
import { AllowWithRole } from '../auth/decorators/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@UseGuards(AuthGuard)
@Controller('v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @AllowWithRole('admin')
  @Post()
  async createProject(@Body() data: CreateProjectDto) {
    const res = await this.projectsService.createProject(data);

    return res.data;
  }

  @AllowWithRole('admin')
  @Put('/:id')
  async updateProject(@Param('id') id: number, @Body() data: UpdateProjectDto) {
    const res = await this.projectsService.updateProject(id, data);

    if (res.error !== null) {
      throw new NotFoundException('project-not-found');
    }

    return res.data;
  }

  @AllowWithRole('admin')
  @Delete('/:id')
  async deleteProject(@Param('id') id: number) {
    const res = await this.projectsService.deleteProject(id);

    if (res.error !== null) {
      throw new NotFoundException('project-not-found');
    }
  }
}
