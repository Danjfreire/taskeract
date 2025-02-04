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

  async findProjectById(id: number): Promise<Project | null> {
    const res = await this.db.query<ProjectSchema>({
      text: 'SELECT * FROM projects WHERE id = $1',
      values: [id],
    });

    if (res.rowCount === 0) {
      return null;
    }

    return this.convert(res.rows[0]);
  }

  async updateProject(id: number, project: Project): Promise<Project> {
    const res = await this.db.query<ProjectSchema>({
      text: `UPDATE projects SET title = $1, description = $2, start_date = $3, end_date = $4, status = $5 WHERE id = $6 RETURNING *`,
      values: [
        project.title,
        project.description,
        new Date(project.startDate),
        new Date(project.endDate),
        project.status,
        id,
      ],
    });

    return this.convert(res.rows[0]);
  }

  async deleteProject(id: number): Promise<void> {
    await this.db.query({
      text: 'DELETE FROM projects WHERE id = $1',
      values: [id],
    });
  }

  private convert(schema: ProjectSchema): Project {
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
