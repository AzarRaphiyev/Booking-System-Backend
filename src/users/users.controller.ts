import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserRole } from './entities/user.entity';

@Controller('users')
@ApiTags('İstifadəçilər')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni istifadəçi yaratmaq' })
  @ApiResponse({ status: 201, description: 'İstifadəçi uğurla yaradıldı.' })
  async createUser(@Body() body: { name: string; email: string; password: string; role?: UserRole }) {
    return this.usersService.createUser(body);
  }

  @Get()
  @ApiOperation({ summary: 'Bütün istifadəçilərin siyahısını əldə etmək' })
  @ApiResponse({ status: 200, description: 'İstifadəçilərin siyahısı uğurla əldə edildi.' })
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
