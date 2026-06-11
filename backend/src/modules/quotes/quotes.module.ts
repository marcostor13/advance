import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quote, QuoteSchema } from './schemas/quote.schema';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
    AuthModule,
  ],
  providers: [QuotesService],
  controllers: [QuotesController],
  exports: [QuotesService, MongooseModule],
})
export class QuotesModule {}
