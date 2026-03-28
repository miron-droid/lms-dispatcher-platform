import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TestsService } from './tests.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('tests')
export class TestsController {
  constructor(private tests: TestsService) {}

  @Get('chapters/:chapterId/questions')
  getQuestions(@Param('chapterId') chapterId: string) {
    return this.tests.getQuestions(chapterId);
  }

  @Post('chapters/:chapterId/submit')
  submit(
    @Param('chapterId') chapterId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: SubmitTestDto,
  ) {
    return this.tests.submit(chapterId, user.sub, dto);
  }

  @Get('chapters/:chapterId/attempts')
  attempts(@Param('chapterId') chapterId: string, @CurrentUser() user: JwtPayload) {
    return this.tests.getAttempts(chapterId, user.sub);
  }
}
