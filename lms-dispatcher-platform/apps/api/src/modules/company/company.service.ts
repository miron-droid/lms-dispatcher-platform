import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.company.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: { _count: { select: { users: true } } },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.company.findUnique({ where: { slug } });
  }

  findById(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async getPublicInfo(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      select: { name: true, slug: true, logoUrl: true },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  create(data: { name: string; slug: string; logoUrl?: string; maxStudents?: number }) {
    return this.prisma.company.create({ data });
  }

  update(id: string, data: { name?: string; logoUrl?: string; isActive?: boolean; maxStudents?: number }) {
    return this.prisma.company.update({ where: { id }, data });
  }
}
