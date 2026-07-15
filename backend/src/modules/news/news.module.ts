import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schemas/news.schema';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    AuthModule,
  ],
  providers: [NewsService],
  controllers: [NewsController],
  exports: [NewsService, MongooseModule],
})
export class NewsModule {}
