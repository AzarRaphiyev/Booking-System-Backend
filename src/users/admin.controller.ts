import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('İdarəçi (Admin)')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Post('workers')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Yeni işçi (personel) əlavə etmək (Yalnız idarəçilər üçün)' })
  @ApiResponse({ status: 201, description: 'İşçi uğurla əlavə edildi.' })
  @ApiResponse({ status: 401, description: 'İcazə yoxdur / Token etibarsızdır.' })
  @ApiResponse({ status: 403, description: 'Giriş qadağandır (Sizin bu əməliyyat üçün yetkiniz yoxdur).' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        name: { type: 'string', example: 'İşçi Adı' }, 
        email: { type: 'string', example: 'isci@salon.com' }, 
        password: { type: 'string', example: 'isci123' } 
      } 
    } 
  })
  async createWorker(@Body() body: { name: string; email: string; password: string }) {
    const password = body.password; // bcrypt logic should actually be in service, but let's check
    return this.usersService.createUser({
      ...body,
      role: UserRole.WORKER, // force worker role
    });
  }
}
