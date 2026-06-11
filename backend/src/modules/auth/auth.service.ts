import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';

export interface AuthResult {
  token: string;
  user: Record<string, unknown>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.create({ ...dto, password: hashed });

    const token = this.signToken(created);
    const user = this.sanitize(created);
    return { token, user };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const found = await this.usersService.findByEmail(dto.email);
    if (!found) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, found.password as string);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.signToken(found);
    const user = this.sanitize(found);
    return { token, user };
  }

  async me(userId: string): Promise<Record<string, unknown>> {
    const found = await this.usersService.findById(userId);
    if (!found) throw new UnauthorizedException('User not found');
    return this.sanitize(found);
  }

  private signToken(user: UserDocument): string {
    const payload = {
      sub: (user._id as { toString(): string }).toString(),
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitize(user: UserDocument): Record<string, unknown> {
    const obj = user.toObject() as Record<string, unknown>;
    delete obj['password'];
    return obj;
  }
}
