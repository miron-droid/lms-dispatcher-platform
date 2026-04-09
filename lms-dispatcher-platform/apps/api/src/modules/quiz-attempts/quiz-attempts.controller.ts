import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('quiz-attempts')
export class QuizAttemptsController {
  constructor(private quizAttempts: QuizAttemptsService) {}

  @Post()
  submit(@CurrentUser() user: JwtPayload, @Body() dto: SubmitQuizDto) {
    return this.quizAttempts.submit(user.sub, dto);
  }

  @Get('my')
  my(@CurrentUser() user: JwtPayload) {
    return this.quizAttempts.myAttempts(user.sub);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  forUser(@CurrentUser() user: JwtPayload, @Param('userId') userId: string) {
    return this.quizAttempts.userAttempts(user.sub, user.role as UserRole, userId);
  }
}
