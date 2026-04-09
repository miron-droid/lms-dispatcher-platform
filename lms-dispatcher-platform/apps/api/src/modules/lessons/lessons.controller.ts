import { Controller, Get, Param, Post } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('lessons')
export class LessonsController {
  constructor(private lessons: LessonsService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessons.findOne(id, user.sub);
  }

  @Get(':id/quiz-status')
  quizStatus(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessons.quizStatus(id, user.sub);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessons.complete(id, user.sub);
  }
}
