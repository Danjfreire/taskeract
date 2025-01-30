import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/_shared/database/database.service';
import { ProjectMemberSchema } from './models/project-member.schema';

@Injectable()
export class ProjectMembersRepository {
  constructor(private db: DatabaseService) {}

  async addMembersToProject(projectId: string, members: number[]) {
    await this.db.query<ProjectMemberSchema>({
      text: `
      INSERT INTO project_members (project_id, user_id ) 
      VALUES ${members.map((_, i) => `($1, $${i + 2})`).join(', ')} 
      RETURNING *;`,
      values: [projectId, ...members],
    });
  }
}
