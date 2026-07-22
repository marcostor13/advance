import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { MovementsService } from '../movements/movements.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly movementsService: MovementsService,
  ) {}

  @Get()
  findAll(@Query('role') role?: string, @Query('search') search?: string) {
    return this.usersService.findAll({ role, search });
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const { user, tempPassword } = await this.usersService.createByAdmin(dto);
    const sanitized = user.toObject() as Record<string, unknown>;
    delete sanitized['password'];
    return { ...sanitized, tempPassword };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/movements')
  async movements(@Param('id') id: string) {
    const [movements, positions] = await Promise.all([
      this.movementsService.findByUser(id),
      this.movementsService.positionsByUser(id),
    ]);
    return { movements, positions };
  }
}
