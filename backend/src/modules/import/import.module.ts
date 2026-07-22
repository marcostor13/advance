import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { MovementsModule } from '../movements/movements.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UsersModule, ProductsModule, MovementsModule, AuthModule, MailModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
