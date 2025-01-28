import { ProjectStatus } from '../models/project.model';

export interface ProjectSchema {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
}
