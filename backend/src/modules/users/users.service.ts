import { ConflictException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    const adminExists = await this.userModel.findOne({ role: 'admin' }).exec();
    if (adminExists) return;

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping seed admin');
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.userModel.create({
      name: 'Admin',
      email,
      phone: '000000000',
      password: hashed,
      role: 'admin',
    });
    this.logger.log(`Seeded admin user: ${email}`);
  }

  /** Raw insert — expects `dto.password` already hashed. Used by self-registration. */
  create(dto: CreateUserDto & { password: string }): Promise<UserDocument> {
    return this.userModel.create(dto);
  }

  generateTempPassword(): string {
    return `${crypto.randomBytes(6).toString('base64url')}Aa1!`;
  }

  /** Creates a client/admin with all profile fields. Hashes the password, or generates+hashes a temp one. */
  async createByAdmin(dto: CreateUserDto): Promise<{ user: UserDocument; tempPassword?: string }> {
    const existingEmail = await this.findByEmail(dto.email);
    if (existingEmail) throw new ConflictException('El correo ya está registrado');

    if (dto.documentNumber) {
      const existingDoc = await this.userModel.findOne({ documentNumber: dto.documentNumber }).exec();
      if (existingDoc) throw new ConflictException('El número de documento ya está registrado');
    }

    let tempPassword: string | undefined;
    let rawPassword = dto.password;
    let mustChangePassword = false;
    if (!rawPassword) {
      tempPassword = this.generateTempPassword();
      rawPassword = tempPassword;
      mustChangePassword = true;
    }

    const hashed = await bcrypt.hash(rawPassword, 10);
    const user = await this.userModel.create({
      ...dto,
      password: hashed,
      role: dto.role ?? 'client',
      mustChangePassword,
    });
    return { user, tempPassword };
  }

  async findAll(filter: { role?: string; search?: string } = {}): Promise<UserDocument[]> {
    const query: Record<string, unknown> = {};
    if (filter.role) query.role = filter.role;
    if (filter.search) {
      const re = new RegExp(filter.search.trim(), 'i');
      query.$or = [{ name: re }, { lastName: re }, { email: re }, { documentNumber: re }];
    }
    return this.userModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+password').exec();
  }

  findByDocument(documentNumber: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ documentNumber }).exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const updated = await this.userModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Usuario no encontrado');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Usuario no encontrado');
  }

  /** Creates the client if `documentNumber` doesn't exist, otherwise updates its profile fields. Used by the Excel importer. */
  async upsertByDocument(
    dto: CreateUserDto,
  ): Promise<{ user: UserDocument; created: boolean; tempPassword?: string }> {
    if (!dto.documentNumber) {
      throw new Error('documentNumber is required to import a user');
    }

    const existing = await this.findByDocument(dto.documentNumber);
    if (existing) {
      const { password: _password, ...profile } = dto;
      existing.set(profile);
      await existing.save();
      return { user: existing, created: false };
    }

    const { user, tempPassword } = await this.createByAdmin(dto);
    return { user, created: true, tempPassword };
  }

  async setPassword(id: string, newPassword: string, clearMustChange = true): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 10);
    const update: Record<string, unknown> = {
      password: hashed,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    };
    if (clearMustChange) update.mustChangePassword = false;
    await this.userModel.findByIdAndUpdate(id, { $set: update }).exec();
  }

  async setResetToken(id: string, tokenHash: string, expires: Date): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { $set: { resetPasswordToken: tokenHash, resetPasswordExpires: expires } })
      .exec();
  }

  findByResetToken(tokenHash: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: new Date() } })
      .select('+resetPasswordToken +resetPasswordExpires')
      .exec();
  }
}
