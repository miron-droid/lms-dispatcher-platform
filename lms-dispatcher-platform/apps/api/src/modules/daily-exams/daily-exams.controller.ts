import { Body, Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { DailyExamsService } from './daily-exams.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('daily-exams')
export class DailyExamsController {
  constructor(private service: DailyExamsService) {}

  @Get()
  getExams(@CurrentUser() user: { sub: string }) {
    return this.service.getExams(user.sub);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getStats() {
    return this.service.getAllStats();
  }

  @Get(':examNumber/questions')
  getQuestions(@CurrentUser() user: { sub: string }, @Param('examNumber', ParseIntPipe) num: number) {
    return this.service.getQuestions(user.sub, num);
  }

  @Post(':examNumber/submit')
  submit(
    @CurrentUser() user: { sub: string },
    @Param('examNumber', ParseIntPipe) num: number,
    @Body('answers') answers: { questionId: string; selectedOptionIds: string[] }[],
  ) {
    return this.service.submit(user.sub, num, answers);
  }
}
