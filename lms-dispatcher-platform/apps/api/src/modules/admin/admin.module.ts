import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AdminController, AnalyticsController],
  providers: [AdminService, AnalyticsService],
})
export class AdminModule {}
