import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/v1/auth/constants';
import {
  RequestUser,
  setRequestUser,
} from '../decorators/request-user.decorator';
import {
  AllowWithRole,
  Role,
  ROLE_WEIGHTS,
} from '../decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const reqUser = this.extractUserFromTokenPayload(payload);
      setRequestUser(request, reqUser);
    } catch {
      throw new UnauthorizedException();
    }

    const requiredRole = this.reflector.get(
      AllowWithRole,
      context.getHandler(),
    );

    if (requiredRole) {
      const minRoleWeight = ROLE_WEIGHTS[requiredRole];
      const userRoleWeight = ROLE_WEIGHTS[request['user'].role];

      return userRoleWeight >= minRoleWeight;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractUserFromTokenPayload(payload: any): RequestUser {
    return {
      id: payload.sub as number,
      email: payload.email as string,
      role: payload.role as Role,
    };
  }
}
