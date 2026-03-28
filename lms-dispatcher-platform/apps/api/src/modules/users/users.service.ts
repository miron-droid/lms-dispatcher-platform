import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { password: _, ...rest } = dto;

    return this.prisma.user.create({
      data: { ...rest, passwordHash },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, managerId: true },
    });
  }

  findAll(role?: UserRole) {
    return this.prisma.user.findMany({
      where: { isActive: true, ...(role ? { role } : {}) },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, lastActiveAt: true,
        manager: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, managerId: true, isActive: true, lastActiveAt: true,
      },
    });
  }

  deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, isActive: true },
    });
  }

  getStudentsForManager(managerId: string) {
    return this.prisma.user.findMany({
      where: { managerId, isActive: true, role: UserRole.STUDENT },
      select: {
        id: true, email: true, firstName: true, lastName: true, lastActiveAt: true,
        chapterProgress: {
          select: { chapterId: true, status: true, testPassed: true, examPassed: true },
        },
      },
    });
  }
}
