import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

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

  async create(dto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(dto);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
