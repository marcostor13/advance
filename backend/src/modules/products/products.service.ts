import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<ProductDocument> {
    const found = await this.productModel.findById(id).exec();
    if (!found) throw new NotFoundException('Product not found');
    return found;
  }

  findByName(name: string): Promise<ProductDocument | null> {
    return this.productModel.findOne({ name: name.trim() }).exec();
  }

  create(dto: CreateProductDto): Promise<ProductDocument> {
    return this.productModel.create(dto);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Product not found');
  }

  /** Creates the product if `name` doesn't exist, otherwise updates its fields. Used by the Excel importer. */
  async upsertByName(dto: CreateProductDto): Promise<{ product: ProductDocument; created: boolean }> {
    const existing = await this.findByName(dto.name);
    if (existing) {
      existing.set(dto);
      await existing.save();
      return { product: existing, created: false };
    }
    const product = await this.create(dto);
    return { product, created: true };
  }
}
