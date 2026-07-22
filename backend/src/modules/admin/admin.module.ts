import { Module } from '@nestjs/common';
import { QuotesModule } from '../quotes/quotes.module';
import { SimulationsModule } from '../simulations/simulations.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MovementsModule } from '../movements/movements.module';
import { AdminController } from './admin.controller';
import { AdminUsersController } from './admin-users.controller';

@Module({
  imports: [
    QuotesModule,
    SimulationsModule,
    UsersModule,
    AuthModule,
    MovementsModule,
  ],
  controllers: [AdminController, AdminUsersController],
})
export class AdminModule {}
