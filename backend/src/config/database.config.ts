import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: configService.getOrThrow<string>('MONGODB_URI'),
});
