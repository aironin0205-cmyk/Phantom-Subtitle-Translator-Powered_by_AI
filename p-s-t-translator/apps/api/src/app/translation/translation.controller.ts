// ===== API LAYER: TRANSLATION CONTROLLER =====
// The entry point for HTTP requests. It validates input via DTOs and delegates to use cases.

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GenerateBlueprintDto } from './dto/generate-blueprint.dto';
import { CreateBlueprintUseCase, CreateBlueprintCommand } from '@p-s-t-translator/translation/application';

@Controller('translations')
export class TranslationController {
  constructor(
    private readonly createBlueprintUseCase: CreateBlueprintUseCase,
  ) {}

  @Post('blueprint')
  @HttpCode(HttpStatus.CREATED)
  async generateBlueprint(@Body() dto: GenerateBlueprintDto) {
    const command: CreateBlueprintCommand = {
      subtitleContent: dto.subtitleContent,
      originalFileName: dto.fileName,
      settings: dto.settings,
    };
    return this.createBlueprintUseCase.execute(command);
  }
}
