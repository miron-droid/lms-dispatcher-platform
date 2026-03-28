import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ExamEventListener } from './listeners/exam-event.listener';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, ExamEventListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
