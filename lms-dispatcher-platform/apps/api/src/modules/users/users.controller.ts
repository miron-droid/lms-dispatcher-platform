import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { UserRole } from '../../common/enums';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateUserDto, @CurrentUser() user: JwtPayload) {
    return this.users.create(dto, user.role as UserRole, user.sub, user.companyId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query('role') role: UserRole | undefined, @CurrentUser() user: JwtPayload) {
    return this.users.findAll(role, user.role as UserRole, user.sub, user.companyId);
  }

  @Get('my-students')
  @Roles(UserRole.MANAGER)
  myStudents(@CurrentUser() user: JwtPayload) {
    return this.users.getStudentsForManager(user.sub);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.users.findOne(id, user.role as UserRole, user.sub);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  deactivate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.users.deactivate(id, user.role as UserRole, user.sub);
  }

  @Patch(':id/password')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetPasswordDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.users.resetPassword(id, dto.password, user.role as UserRole, user.sub);
  }

  @Post(':id/reset-progress')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  resetProgress(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.users.resetProgress(id, user.role as UserRole, user.sub);
  }
}
