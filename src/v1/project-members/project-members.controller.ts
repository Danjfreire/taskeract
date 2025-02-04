import {
  Body,
  Controller,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AllowWithRole } from '../auth/decorators/roles.decorator';
import { AddProjectMembersDto } from './dto/add-members.dto';
import { ProjectMembersService } from './project-members.service';

@UseGuards(AuthGuard)
@Controller('v1/projects/:projectId/members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @AllowWithRole('admin')
  @Post()
  async addMembers(
    @Param('projectId') projectId: number,
    @Body() body: AddProjectMembersDto,
  ) {
    const res = await this.projectMembersService.addMembersToProject(
      projectId,
      body.members,
    );

    if (res.error) {
      throw new UnprocessableEntityException();
    }
  }
}
