import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('courses')
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.courses.findPublished(user?.sub);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.courses.findAll();
  }
}
