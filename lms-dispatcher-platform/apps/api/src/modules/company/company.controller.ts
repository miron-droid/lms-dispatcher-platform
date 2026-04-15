import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('companies')
export class CompanyController {
  constructor(private companies: CompanyService) {}

  // Public: used by login page to show company branding
  @Public()
  @Get('by-slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.companies.getPublicInfo(slug);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll() {
    return this.companies.findAll();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() data: { name: string; slug: string; logoUrl?: string; maxStudents?: number }) {
    return this.companies.create(data);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() data: any) {
    return this.companies.update(id, data);
  }
}
