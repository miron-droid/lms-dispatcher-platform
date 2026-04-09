import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('admin/analytics')
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  @Get('activity')
  activity(@Query('days') days?: string) {
    const n = days ? parseInt(days, 10) : 30;
    return this.analytics.getActivity(Number.isFinite(n) ? n : 30);
  }

  @Get('heatmap')
  heatmap() {
    return this.analytics.getHeatmap();
  }

  @Get('funnel')
  funnel() {
    return this.analytics.getFunnel();
  }

  @Get('chapter-difficulty')
  chapterDifficulty() {
    return this.analytics.getChapterDifficulty();
  }

  @Get('question-stats')
  questionStats() {
    return this.analytics.getQuestionStats();
  }
}
