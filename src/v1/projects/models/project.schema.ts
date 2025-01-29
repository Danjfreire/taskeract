import { ProjectStatus } from '../models/project.model';

export interface ProjectSchema {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: null | Date;
  status: ProjectStatus;
}
