import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from 'src/_shared/database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
