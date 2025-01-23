import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from './roles.decorator';

export interface RequestUser {
  id: number;
  email: string;
  role: Role;
}

export function setRequestUser(request: any, user: RequestUser) {
  if (user != null) {
    request.user = user;
  } else {
    delete request.user;
  }
}

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
