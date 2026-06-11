import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactDocument> {
    return this.contactModel.create(dto);
  }

  async findAll(): Promise<ContactDocument[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }
}
