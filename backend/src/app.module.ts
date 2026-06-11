import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { databaseConfig } from './config/database.config';
import { HealthModule } from './modules/health/health.module';
import { ContactModule } from './modules/contact/contact.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { SimulationsModule } from './modules/simulations/simulations.module';
import { AdminModule } from './modules/admin/admin.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    TerminusModule,
    HealthModule,
    ContactModule,
    UsersModule,
    AuthModule,
    QuotesModule,
    SimulationsModule,
    AdminModule,
    ChatModule,
  ],
})
export class AppModule {}
