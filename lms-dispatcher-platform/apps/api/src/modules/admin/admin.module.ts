import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuditService } from './audit.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AdminController, AnalyticsController],
  providers: [AdminService, AuditService, AnalyticsService],
  exports: [AuditService],
})
export class AdminModule {}
