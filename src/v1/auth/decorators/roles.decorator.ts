import { Reflector } from '@nestjs/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VALID_ROLES = ['god', 'admin', 'worker'] as const;
export type Role = (typeof VALID_ROLES)[number];
export const ROLE_WEIGHTS: Record<Role, number> = {
  god: 3,
  admin: 2,
  worker: 1,
};

export const AllowWithRole = Reflector.createDecorator<Role>();
