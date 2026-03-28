import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/authenticated-request.type';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtPayload =>
    ctx.switchToHttp().getRequest().user,
);
