import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@Controller('quotes')
@UseGuards(JwtAuthGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateQuoteDto) {
    return this.quotesService.create(user.sub, dto);
  }

  @Get('mine')
  findMine(@CurrentUser() user: JwtPayload) {
    return this.quotesService.findByUser(user.sub);
  }
}
