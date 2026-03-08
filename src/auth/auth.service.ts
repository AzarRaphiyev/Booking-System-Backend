import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // LOGIN
  // =========================
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('İstifadəçi tapılmadı');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Şifrə yalnışdır');
    }

    const payload = {
      sub: user._id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // =========================
  // REGISTER
  // =========================
  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Bu email və ya istifadəçi adı artıq mövcuddur');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.CUSTOMER, // Force CUSTOMER role
    });

    const payload = {
      sub: user._id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
