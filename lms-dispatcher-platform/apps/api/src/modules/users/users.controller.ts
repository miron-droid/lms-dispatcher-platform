import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  deactivate(@Param('id') id: string) {
    return this.users.deactivate(id);
  }
}
