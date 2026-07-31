import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  CLAIM_TYPES,
  DOCUMENT_TYPES,
  ITEM_TYPES,
} from '../schemas/complaint.schema';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  fullName: string;

  @IsIn(DOCUMENT_TYPES as unknown as string[])
  documentType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  documentNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  district: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  province: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  department: string;

  @IsOptional()
  @IsBoolean()
  isMinor?: boolean;

  // El apoderado sólo es exigible cuando el consumidor es menor de edad
  @ValidateIf((dto: CreateComplaintDto) => dto.isMinor === true)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  guardianName?: string;

  @IsIn(ITEM_TYPES as unknown as string[])
  itemType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  itemDescription: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  claimedAmount?: number;

  @IsOptional()
  @IsIn(['PEN', 'USD'])
  currency?: string;

  @IsIn(CLAIM_TYPES as unknown as string[])
  claimType: string;

  @IsString()
  @MinLength(20)
  @MaxLength(3000)
  detail: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1500)
  request: string;
}
