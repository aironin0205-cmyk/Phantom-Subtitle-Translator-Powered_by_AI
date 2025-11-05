// ===== DOMAIN LAYER: TRANSLATION JOB ENTITY =====
// This class is the core of our business domain. It is pure and framework-agnostic.
// It encapsulates the data and business rules for a translation job.

import { randomUUID } from 'crypto';

export enum TranslationJobStatus {
  PENDING = 'PENDING',
  ANALYZING = 'ANALYZING',
  TRANSLATING = 'TRANSLATING',
  EDITING = 'EDITING',
  VALIDATING = 'VALIDATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface TranslationJobProps {
  id: string;
  originalFileName: string;
  status: TranslationJobStatus;
  createdAt: Date;
  updatedAt: Date;
  subtitleContent: string;
  finalSrt?: string;
  blueprint?: object;
  failureReason?: string;
}

export class TranslationJob {
  public readonly id: string;
  public readonly originalFileName: string;
  public status: TranslationJobStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public subtitleContent: string;
  public finalSrt?: string;
  public blueprint?: object;
  public failureReason?: string;

  private constructor(props: TranslationJobProps) {
    Object.assign(this, props);
  }

  public static create(props: { originalFileName: string; subtitleContent: string }): TranslationJob {
    return new TranslationJob({
      id: randomUUID(),
      status: TranslationJobStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  public setBlueprint(blueprint: object): void {
    if (this.status !== TranslationJobStatus.PENDING) {
      throw new Error('Cannot set blueprint for a job that is already in progress.');
    }
    this.blueprint = blueprint;
    this.status = TranslationJobStatus.ANALYZING;
    this.updatedAt = new Date();
  }

  public markAsCompleted(finalSrt: string): void {
    if (this.status === TranslationJobStatus.COMPLETED || this.status === TranslationJobStatus.FAILED) {
      throw new Error('Cannot complete a job that is already finalized.');
    }
    this.status = TranslationJobStatus.COMPLETED;
    this.finalSrt = finalSrt;
    this.updatedAt = new Date();
  }
}
