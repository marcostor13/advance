import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Quote, QuoteDocument } from '../quotes/schemas/quote.schema';
import { Simulation, SimulationDocument } from '../simulations/schemas/simulation.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

interface UpdateStatusDto {
  status?: string;
  notes?: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    @InjectModel(Quote.name) private readonly quoteModel: Model<QuoteDocument>,
    @InjectModel(Simulation.name) private readonly simulationModel: Model<SimulationDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Get('stats')
  async getStats() {
    const [totalQuotes, totalSimulations, totalLeads, newQuotes, newSimulations] =
      await Promise.all([
        this.quoteModel.countDocuments(),
        this.simulationModel.countDocuments(),
        this.userModel.countDocuments({ role: 'client' }),
        this.quoteModel.countDocuments({ status: 'nueva' }),
        this.simulationModel.countDocuments({ status: 'nueva' }),
      ]);

    return { totalQuotes, totalSimulations, totalLeads, newQuotes, newSimulations };
  }

  @Get('quotes')
  async getAllQuotes(@Query('status') status?: string) {
    const filter = status ? { status } : {};
    return this.quoteModel
      .find(filter)
      .populate('user', 'name email phone company')
      .sort({ createdAt: -1 })
      .exec();
  }

  @Put('quotes/:id')
  async updateQuote(
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ) {
    return this.quoteModel
      .findByIdAndUpdate(id, { $set: body }, { new: true })
      .exec();
  }

  @Get('simulations')
  async getAllSimulations(@Query('status') status?: string) {
    const filter = status ? { status } : {};
    return this.simulationModel
      .find(filter)
      .populate('user', 'name email phone company')
      .sort({ createdAt: -1 })
      .exec();
  }

  @Put('simulations/:id')
  async updateSimulation(
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ) {
    return this.simulationModel
      .findByIdAndUpdate(id, { $set: body }, { new: true })
      .exec();
  }

  @Get('leads')
  async getLeads() {
    return this.userModel
      .aggregate([
        { $match: { role: 'client' } },
        {
          $lookup: {
            from: 'quotes',
            localField: '_id',
            foreignField: 'user',
            as: 'quotes',
          },
        },
        {
          $lookup: {
            from: 'simulations',
            localField: '_id',
            foreignField: 'user',
            as: 'simulations',
          },
        },
        {
          $addFields: {
            quotesCount: { $size: '$quotes' },
            simulationsCount: { $size: '$simulations' },
          },
        },
        { $project: { password: 0, quotes: 0, simulations: 0 } },
      ])
      .exec();
  }
}
