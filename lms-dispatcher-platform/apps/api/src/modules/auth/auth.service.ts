import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../admin/audit.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: { select: { slug: true } } },
    });

    if (!user || !user.isActive) {
      // Log failed login attempt (we don't have a user ID, use email)
      this.audit.log({
        actorId: '00000000-0000-0000-0000-000000000000',
        actorEmail: dto.email,
        actorRole: 'UNKNOWN',
        action: 'LOGIN_FAILED',
        details: { reason: !user ? 'user_not_found' : 'user_inactive' },
        ipAddress,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      this.audit.log({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'LOGIN_FAILED',
        details: { reason: 'invalid_password' },
        ipAddress,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    // Log successful login
    this.audit.log({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'LOGIN_SUCCESS',
      ipAddress,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId ?? null,
      companySlug: user.company?.slug ?? null,
    };
    const token = this.jwt.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId ?? null,
        companySlug: user.company?.slug ?? null,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, lastActiveAt: true,
        totalXP: true, streak: true, lastStudyDate: true, achievements: true,
        companyId: true,
        company: { select: { slug: true, name: true } },
      },
    });
    const { levelFromXP } = await import('../quiz-attempts/gamification');
    return {
      ...user,
      level: levelFromXP(user.totalXP ?? 0),
      companySlug: user.company?.slug ?? null,
      companyName: user.company?.name ?? null,
    };
  }
}
