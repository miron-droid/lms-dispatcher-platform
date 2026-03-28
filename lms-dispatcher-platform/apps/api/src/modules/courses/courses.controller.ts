import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @Get()
  findAll() {
    return this.courses.findPublished();
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.courses.findAll();
  }
}
