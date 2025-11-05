// ===== DOMAIN LAYER: REPOSITORY INTERFACE (PORT) =====
// This defines the contract for data persistence. The application layer depends on this,
// not on a specific database implementation.

import { TranslationJob } from '../entities/translation-job.entity';

export const TRANSLATION_REPOSITORY_TOKEN = Symbol('TRANSLATION_REPOSITORY_TOKEN');

export interface ITranslationRepository {
  findById(id: string): Promise<TranslationJob | null>;
  save(job: TranslationJob): Promise<void>;
}
