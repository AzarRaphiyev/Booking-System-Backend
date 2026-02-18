import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: { email: string; password: string; role?: UserRole }) {
    return this.usersService.createUser(body.email, body.password, body.role);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
