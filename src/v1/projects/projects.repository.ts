import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/_shared/database/database.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectSchema } from './models/project.schema';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly db: DatabaseService) {}

  async createProject(dto: CreateProjectDto) {
    const res = await this.db.query<ProjectSchema>({
      text: 'INSERT INTO projects (title, description, start_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [dto.title, dto.description, new Date(dto.startDate), 'planned'],
    });

    return this.convert(res.rows[0]);
  }

  private convert(schema: ProjectSchema): Project {
    console.log('Type of start date is:', typeof schema.start_date);

    return {
      id: schema.id,
      title: schema.title,
      description: schema.description,
      startDate: schema.start_date.toISOString(),
      endDate: schema.end_date != null ? schema.end_date.toISOString() : null,
      status: schema.status,
    };
  }
}
