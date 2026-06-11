import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Simulation, SimulationSchema } from './schemas/simulation.schema';
import { SimulationsService } from './simulations.service';
import { SimulationsController } from './simulations.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Simulation.name, schema: SimulationSchema }]),
    AuthModule,
  ],
  providers: [SimulationsService],
  controllers: [SimulationsController],
  exports: [SimulationsService, MongooseModule],
})
export class SimulationsModule {}
