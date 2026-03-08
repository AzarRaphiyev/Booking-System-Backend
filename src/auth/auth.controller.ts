import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('Auth')
@ApiTags('Avtorizasiya')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sistemə daxil olmaq' })
  @ApiResponse({ status: 200, description: 'Uğurla daxil oldunuz.' })
  @ApiResponse({ status: 401, description: 'Şifrə yalnışdır' })
  @ApiResponse({ status: 404, description: 'İstifadəçi tapılmadı' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Sistemdə qeydiyyatdan keçmək (Müştəri olaraq)' })
  @ApiResponse({ status: 201, description: 'İstifadəçi uğurla qeydiyyatdan keçdi.' })
  @ApiResponse({ status: 409, description: 'Bu e-poçt ünvanı artıq mövcuddur' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}