export type ProjectStatus = 'planned' | 'ongoing' | 'completed';

export interface Project {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
}
