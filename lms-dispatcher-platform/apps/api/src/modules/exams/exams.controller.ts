import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { RequestExamDto } from './dto/request-exam.dto';
import { ReviewExamDto } from './dto/review-exam.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('exams')
export class ExamsController {
  constructor(private exams: ExamsService) {}

  @Post('request')
  @Roles(UserRole.STUDENT)
  request(@CurrentUser() user: JwtPayload, @Body() dto: RequestExamDto) {
    return this.exams.request(user.sub, dto);
  }

  @Get('my')
  @Roles(UserRole.STUDENT)
  myExams(@CurrentUser() user: JwtPayload) {
    return this.exams.getMyExams(user.sub);
  }

  @Get('pending')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  pending(@CurrentUser() user: JwtPayload) {
    return this.exams.getPending(user.sub);
  }

  @Post(':id/review')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  review(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ReviewExamDto,
  ) {
    return this.exams.review(id, user.sub, dto);
  }
}
