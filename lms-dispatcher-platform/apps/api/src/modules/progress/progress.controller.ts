import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('progress')
export class ProgressController {
  constructor(private progress: ProgressService) {}

  @Get('courses/:courseId')
  getCourseProgress(@Param('courseId') courseId: string, @CurrentUser() user: JwtPayload) {
    return this.progress.getCourseProgress(user.sub, courseId);
  }

  @Post('courses/:courseId/initialize')
  initialize(@Param('courseId') courseId: string, @CurrentUser() user: JwtPayload) {
    return this.progress.initializeCourse(user.sub, courseId);
  }
}
