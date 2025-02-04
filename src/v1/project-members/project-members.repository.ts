import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/_shared/database/database.service';
import { ProjectMemberSchema } from './models/project-member.schema';

@Injectable()
export class ProjectMembersRepository {
  constructor(private db: DatabaseService) {}

  async addMembersToProject(projectId: number, members: number[]) {
    await this.db.query<ProjectMemberSchema>({
      text: `
      INSERT INTO project_members (project_id, user_id ) 
      VALUES ${members.map((_, i) => `($1, $${i + 2})`).join(', ')} 
      RETURNING *;`,
      values: [projectId, ...members],
    });
  }

  async isProjectMember(projectId: number, userId: number): Promise<boolean> {
    const res = await this.db.query<ProjectMemberSchema>({
      text: `
      SELECT * FROM project_members 
      WHERE project_id = $1 AND user_id = $2;`,
      values: [projectId, userId],
    });

    return res.rows.length > 0;
  }
}
