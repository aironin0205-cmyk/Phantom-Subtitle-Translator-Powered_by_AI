// ===== API LAYER: DATA TRANSFER OBJECT (DTO) =====
// Defines the shape and validation rules for the 'generate-blueprint' API endpoint.

import { IsNotEmpty, IsString, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationSettingsDto {
  @IsString()
  @IsNotEmpty()
  tone: string;
}

export class GenerateBlueprintDto {
  @IsString()
  @IsNotEmpty()
  subtitleContent: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TranslationSettingsDto)
  settings?: TranslationSettingsDto;
}
