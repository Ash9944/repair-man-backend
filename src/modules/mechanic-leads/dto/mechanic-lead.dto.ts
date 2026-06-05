import { IsString, IsNotEmpty, IsMobilePhone, IsArray, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateMechanicLeadDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsOptional()
  country_code?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsArray()
  @IsOptional()
  vehicleTypes?: string[];

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(50)
  experience?: number;

  @IsBoolean()
  @IsOptional()
  hasOwnTools?: boolean;

  // Shop details
  @IsString()
  @IsOptional()
  shopName?: string;

  @IsString()
  @IsOptional()
  shopAddress?: string;

  @IsString()
  @IsOptional()
  workingHoursFrom?: string;

  @IsString()
  @IsOptional()
  workingHoursTo?: string;

  // Location
  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;
}
