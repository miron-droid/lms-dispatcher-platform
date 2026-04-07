import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpsertChapterDto } from './dto/upsert-chapter.dto';
import { UpsertLessonDto } from './dto/upsert-lesson.dto';
import { UserRole } from '../../common/enums';

@Controller('admin')
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('dashboard')
  dashboard() { return this.admin.getDashboard(); }

  @Get('analytics/students')
  studentAnalytics() { return this.admin.getStudentAnalytics(); }

  @Get('analytics/detailed')
  detailedProgress() { return this.admin.getDetailedProgress(); }

  @Post('courses/:courseId/chapters')
  upsertChapter(@Param('courseId') courseId: string, @Body() dto: UpsertChapterDto) {
    return this.admin.upsertChapter(courseId, dto);
  }

  @Post('chapters/:chapterId/lessons')
  upsertLesson(@Param('chapterId') chapterId: string, @Body() dto: UpsertLessonDto) {
    return this.admin.upsertLesson(chapterId, dto);
  }

  @Delete('lessons/:id')
  deleteLesson(@Param('id') id: string) { return this.admin.deleteLesson(id); }

  @Get('chapters/:chapterId/questions')
  getQuestions(@Param('chapterId') chapterId: string) {
    return this.admin.getQuestions(chapterId);
  }

  @Post('chapters/:chapterId/questions')
  upsertQuestion(@Param('chapterId') chapterId: string, @Body() data: any) {
    return this.admin.upsertQuestion(chapterId, data);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: string) { return this.admin.deleteQuestion(id); }
}
