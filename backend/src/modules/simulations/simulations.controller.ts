import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@Controller('simulations')
@UseGuards(JwtAuthGuard)
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateSimulationDto) {
    return this.simulationsService.create(user.sub, dto);
  }

  @Get('mine')
  findMine(@CurrentUser() user: JwtPayload) {
    return this.simulationsService.findByUser(user.sub);
  }
}
