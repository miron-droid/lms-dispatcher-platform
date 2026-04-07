import { Module } from '@nestjs/common';
import { DailyExamsController } from './daily-exams.controller';
import { DailyExamsService } from './daily-exams.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DailyExamsController],
  providers: [DailyExamsService],
})
export class DailyExamsModule {}
