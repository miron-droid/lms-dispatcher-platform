import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  companyId?: string | null;
  companySlug?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
