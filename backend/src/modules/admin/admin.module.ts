import { Module } from '@nestjs/common';
import { QuotesModule } from '../quotes/quotes.module';
import { SimulationsModule } from '../simulations/simulations.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    QuotesModule,
    SimulationsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
