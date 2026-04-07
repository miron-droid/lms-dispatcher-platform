import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { UserRole } from '../../common/enums';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query('role') role?: UserRole) {
    return this.users.findAll(role);
  }

  @Get('my-students')
  @Roles(UserRole.MANAGER)
  myStudents(@CurrentUser() user: JwtPayload) {
    return this.users.getStudentsForManager(user.sub);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  deactivate(@Param('id') id: string) {
    return this.users.deactivate(id);
  }

  @Patch(':id/password')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  resetPassword(@Param('id') id: string, @Body('password') password: string) {
    return this.users.resetPassword(id, password);
  }

  @Post(':id/reset-progress')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  resetProgress(@Param('id') id: string) {
    return this.users.resetProgress(id);
  }
}
