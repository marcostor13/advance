import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { MovementsModule } from '../movements/movements.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MovementsModule, AuthModule],
  controllers: [PortalController],
})
export class PortalModule {}
