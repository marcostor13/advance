import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';
import { MovementsService } from '../movements/movements.service';

@Controller('portal')
@UseGuards(JwtAuthGuard)
export class PortalController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get('movements')
  movements(@CurrentUser() user: JwtPayload) {
    return this.movementsService.findByUser(user.sub);
  }

  @Get('positions')
  positions(@CurrentUser() user: JwtPayload) {
    return this.movementsService.positionsByUser(user.sub);
  }

  @Get('summary')
  async summary(@CurrentUser() user: JwtPayload) {
    const positions = await this.movementsService.positionsByUser(user.sub);
    const capitalInvertido = positions.reduce((sum, p) => sum + p.capital, 0);
    const rendimientoAcumulado = positions.reduce((sum, p) => sum + p.earned, 0);
    const active = positions.filter((p) => p.capital > 0);
    const rentabilidadAnual =
      capitalInvertido > 0
        ? active.reduce((sum, p) => sum + p.product.annualRate * (p.capital / capitalInvertido), 0)
        : 0;

    return {
      capitalInvertido,
      rendimientoAcumulado,
      rentabilidadAnual,
      inversionesActivas: active.length,
      allocations: active.map((p) => ({
        name: p.product.name,
        amount: p.capital,
        pct: capitalInvertido > 0 ? Math.round((p.capital / capitalInvertido) * 100) : 0,
      })),
    };
  }
}
