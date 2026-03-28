import { Controller, Get, Param } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('chapters')
export class ChaptersController {
  constructor(private chapters: ChaptersService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.chapters.findOne(id, user.sub);
  }
}
