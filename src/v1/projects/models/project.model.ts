export const PROJECT_STATUSES = ['planned', 'ongoing', 'completed'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
}
