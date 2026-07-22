import { Controller, Get, Post, Res, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ImportService } from './import.service';

@Controller('admin/import')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get('template')
  async template(@Res() res: Response) {
    const buffer = await this.importService.buildTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="plantilla-advance.xlsx"');
    res.send(buffer);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Debe adjuntar un archivo .xlsx');
    return this.importService.import(file.buffer);
  }
}
