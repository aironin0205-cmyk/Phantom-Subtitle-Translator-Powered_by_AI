// ===== API LAYER: TRANSLATION MODULE =====
// This NestJS module wires together the controller, use cases, and repository implementations.

import { Module } from '@nestjs/common';
import { TranslationController } from './translation.controller';
import { CreateBlueprintUseCase } from '@p-s-t-translator/translation/application';
import { TRANSLATION_REPOSITORY_TOKEN } from '@p-s-t-translator/translation/domain';

// --- Placeholder for the actual repository implementation ---
// We are using a mock for now. Later, we will replace this with the real Prisma repository.
const MockTranslationRepository = {
  provide: TRANSLATION_REPOSITORY_TOKEN,
  useValue: {
    findById: async (id: string) => { console.log(`MOCK: Finding job ${id}`); return null; },
    save: async (job: any) => { console.log(`MOCK: Saving job ${job.id}`); },
  },
};


@Module({
  controllers: [TranslationController],
  providers: [
    // Use Cases are registered as providers so they can be injected.
    CreateBlueprintUseCase,
    
    // This is how we provide the concrete implementation for the abstract repository.
    MockTranslationRepository,
  ],
})
export class TranslationModule {}
