import { Controller, Get, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get('mine')
  findMine(@CurrentUser() user: JwtPayload) {
    return this.investmentsService.findByUser(user.sub);
  }

  @Get('summary')
  summary(@CurrentUser() user: JwtPayload) {
    return this.investmentsService.summary(user.sub);
  }
}
