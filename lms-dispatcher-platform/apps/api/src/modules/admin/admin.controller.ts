import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { AdminService } from './admin.service';
import { AuditService } from './audit.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpsertChapterDto } from './dto/upsert-chapter.dto';
import { UpsertLessonDto } from './dto/upsert-lesson.dto';
import { UserRole } from '../../common/enums';

/** Helper: returns companyId for tenant-scoped queries, or null/undefined for SUPER_ADMIN (sees all) */
function tenantId(user: JwtPayload): string | null | undefined {
  if (user.role === 'SUPER_ADMIN') return undefined; // no filter
  return user.companyId ?? null;
}

@Controller('admin')
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class AdminController {
  constructor(
    private admin: AdminService,
    private auditService: AuditService,
  ) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: JwtPayload) {
    return this.admin.getDashboard(tenantId(user));
  }

  @Get('analytics/students')
  studentAnalytics(@CurrentUser() user: JwtPayload) {
    return this.admin.getStudentAnalytics(tenantId(user));
  }

  @Get('analytics/detailed')
  detailedProgress(@CurrentUser() user: JwtPayload) {
    return this.admin.getDetailedProgress(tenantId(user));
  }

  @Get('students/:userId/details')
  studentDetails(@Param('userId') userId: string) {
    return this.admin.getStudentDetails(userId);
  }

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

  @Post('students/:userId/chapters/:chapterId/unlock')
  unlockChapter(@Param('userId') userId: string, @Param('chapterId') chapterId: string) {
    return this.admin.unlockChapter(userId, chapterId);
  }

  @Post('students/:userId/chapters/:chapterId/complete')
  completeChapter(@Param('userId') userId: string, @Param('chapterId') chapterId: string) {
    return this.admin.completeChapter(userId, chapterId);
  }

  @Get('audit-log')
  @Roles(UserRole.ADMIN)
  getAuditLog(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('action') action?: string,
    @Query('actorId') actorId?: string,
  ) {
    if (user.role !== 'SUPER_ADMIN' && user.email !== 'miron@etlgroupll.com') {
      throw new ForbiddenException('Owner only');
    }
    return this.auditService.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      action,
      actorId,
    });
  }

  // ── Owner / SUPER_ADMIN endpoints ────────────────────────────────────────

  @Get('owner/managers')
  @Roles(UserRole.ADMIN)
  getManagersOverview(@CurrentUser() user: JwtPayload) {
    if (user.role !== 'SUPER_ADMIN' && user.email !== 'miron@etlgroupll.com') {
      throw new ForbiddenException('Owner only');
    }
    return this.admin.getManagersOverview(tenantId(user));
  }

  @Get('owner/managers/:id/students')
  @Roles(UserRole.ADMIN)
  getManagerStudents(
    @CurrentUser() user: JwtPayload,
    @Param('id') managerId: string,
  ) {
    if (user.role !== 'SUPER_ADMIN' && user.email !== 'miron@etlgroupll.com') {
      throw new ForbiddenException('Owner only');
    }
    return this.admin.getManagerStudents(managerId);
  }

  @Get('owner/managers/:id/activity')
  @Roles(UserRole.ADMIN)
  getManagerActivity(
    @CurrentUser() user: JwtPayload,
    @Param('id') managerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (user.role !== 'SUPER_ADMIN' && user.email !== 'miron@etlgroupll.com') {
      throw new ForbiddenException('Owner only');
    }
    return this.admin.getManagerActivity(
      managerId,
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  @Get('owner/stats')
  @Roles(UserRole.ADMIN)
  getOwnerStats(@CurrentUser() user: JwtPayload) {
    if (user.role !== 'SUPER_ADMIN' && user.email !== 'miron@etlgroupll.com') {
      throw new ForbiddenException('Owner only');
    }
    return this.admin.getOwnerStats(tenantId(user));
  }

  @Get('owner/control-data')
  @Roles(UserRole.ADMIN)
  getControlData(@CurrentUser() user: JwtPayload) {
    if (user.role !== 'SUPER_ADMIN' && user.email !== 'miron@etlgroupll.com') {
      throw new ForbiddenException('Owner only');
    }
    return this.admin.getControlData(tenantId(user));
  }

  @Get('owner/user-activity/:userId')
  @Roles(UserRole.ADMIN)
  getUserActivity(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
    @Query('page') page?: string,
  ) {
    if (user.role !== 'SUPER_ADMIN' && user.email !== 'miron@etlgroupll.com') {
      throw new ForbiddenException('Owner only');
    }
    return this.admin.getManagerActivity(userId, page ? +page : 1, 10);
  }
}
