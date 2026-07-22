import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movement, MovementSchema } from './schemas/movement.schema';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movement.name, schema: MovementSchema }]),
    AuthModule,
  ],
  providers: [MovementsService],
  controllers: [MovementsController],
  exports: [MovementsService, MongooseModule],
})
export class MovementsModule {}
