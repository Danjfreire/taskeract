export type ProjectStatus = 'planned' | 'ongoing' | 'completed';

export interface Project {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
}
