import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserDocument } from '../users/schemas/user.schema';

export interface AuthResult {
  token: string;
  user: Record<string, unknown>;
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

  /** Always resolves — never reveals whether the email exists. */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await this.usersService.setResetToken((user._id as { toString(): string }).toString(), tokenHash, expires);
      await this.mailService.sendPasswordReset(user.email, rawToken);
    }
    return { message: 'Si el correo existe, se envió un enlace de recuperación.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    const user = await this.usersService.findByResetToken(tokenHash);
    if (!user) throw new BadRequestException('El enlace es inválido o expiró');

    await this.usersService.setPassword((user._id as { toString(): string }).toString(), dto.newPassword);
    return { message: 'Contraseña actualizada correctamente.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.password as string);
    if (!valid) throw new UnauthorizedException('La contraseña actual es incorrecta');

    await this.usersService.setPassword(userId, dto.newPassword);
    return { message: 'Contraseña actualizada correctamente.' };
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
