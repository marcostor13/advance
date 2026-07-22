import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movement, MovementDocument } from './schemas/movement.schema';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';

export interface Position {
  product: { _id: string; name: string; type: string; annualRate: number; termMonths: number };
  capital: number;
  earned: number;
  firstSubscription: Date | null;
  maturity: Date | null;
  progress: number;
}

interface GroupedRow {
  _id: Types.ObjectId;
  movements: { type: string; amount: number; date: Date }[];
  product: { _id: Types.ObjectId; name: string; type: string; annualRate: number; termMonths: number };
}

@Injectable()
export class MovementsService {
  constructor(
    @InjectModel(Movement.name) private readonly movementModel: Model<MovementDocument>,
  ) {}

  findAll(filter: { user?: string; product?: string } = {}): Promise<MovementDocument[]> {
    const query: Record<string, unknown> = {};
    if (filter.user) query.user = filter.user;
    if (filter.product) query.product = filter.product;
    return this.movementModel
      .find(query)
      .populate('user', 'name lastName email documentNumber')
      .populate('product', 'name type annualRate termMonths')
      .sort({ date: -1 })
      .exec();
  }

  findByUser(userId: string): Promise<MovementDocument[]> {
    return this.movementModel
      .find({ user: userId })
      .populate('product', 'name type annualRate termMonths')
      .sort({ date: -1 })
      .exec();
  }

  create(dto: CreateMovementDto): Promise<MovementDocument> {
    return this.movementModel.create(dto);
  }

  async update(id: string, dto: UpdateMovementDto): Promise<MovementDocument> {
    const updated = await this.movementModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Movement not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.movementModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Movement not found');
  }

  /** Derives per-product investment positions from the movement history (no separate collection). */
  async positionsByUser(userId: string): Promise<Position[]> {
    const rows = await this.movementModel.aggregate<GroupedRow>([
      { $match: { user: new Types.ObjectId(userId) } },
      { $sort: { date: 1 } },
      {
        $group: {
          _id: '$product',
          movements: { $push: { type: '$type', amount: '$amount', date: '$date' } },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
    ]);

    return rows.map((row) => {
      let capital = 0;
      let earned = 0;
      let firstSubscription: Date | null = null;

      for (const m of row.movements) {
        if (m.type === 'SUSCRIPCIÓN') {
          capital += m.amount;
          if (!firstSubscription) firstSubscription = m.date;
        } else if (m.type === 'VENCIMIENTO') {
          capital -= m.amount;
        } else if (m.type === 'RENDIMIENTO') {
          earned += m.amount;
        }
      }

      const termMonths = row.product.termMonths;
      let maturity: Date | null = null;
      let progress = 0;
      if (firstSubscription) {
        maturity = new Date(firstSubscription);
        maturity.setMonth(maturity.getMonth() + termMonths);

        const now = new Date();
        const monthsElapsed =
          (now.getFullYear() - firstSubscription.getFullYear()) * 12 +
          (now.getMonth() - firstSubscription.getMonth());
        progress = termMonths > 0 ? Math.min(100, Math.max(0, Math.round((monthsElapsed / termMonths) * 100))) : 0;
      }

      return {
        product: {
          _id: row.product._id.toString(),
          name: row.product.name,
          type: row.product.type,
          annualRate: row.product.annualRate,
          termMonths: row.product.termMonths,
        },
        capital: Math.round(capital * 100) / 100,
        earned: Math.round(earned * 100) / 100,
        firstSubscription,
        maturity,
        progress,
      };
    });
  }
}
