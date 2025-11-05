// ===== SHARED CORE UTILITY: SRT PARSER =====
// This module contains pure, reusable, framework-agnostic functions for handling the SRT format.

import { Parser } from 'srt-parser-2';
import { BadRequestException } from '@nestjs/common';

const parser = new Parser();

export interface SrtLine {
  sequence: number;
  startTime: string;
  endTime: string;
  duration: number;
  text: string;
}

function _mapToSrtLine(libLine: any): SrtLine {
  const duration = libLine.endTimeSeconds - libLine.startTimeSeconds;
  return {
    sequence: parseInt(libLine.id, 10),
    startTime: libLine.startTime,
    endTime: libLine.endTime,
    duration: isNaN(duration) ? 0 : parseFloat(duration.toFixed(3)),
    text: libLine.text.replace(/<[^>]*>/g, '').trim(),
  };
}

function _mapFromSrtLine(srtLine: SrtLine): any {
  return {
    id: srtLine.sequence.toString(),
    startTime: srtLine.startTime,
    endTime: srtLine.endTime,
    text: srtLine.text,
  };
}

export function parseSrt(srtContent: string): SrtLine[] {
  if (typeof srtContent !== 'string' || !srtContent.trim()) {
    throw new BadRequestException('SRT content must be a non-empty string.');
  }
  try {
    const srtArray = parser.fromSrt(srtContent);
    return srtArray.map(_mapToSrtLine);
  } catch (error) {
    throw new BadRequestException('Failed to parse malformed SRT content.', {
      cause: error,
      description: error.message,
    });
  }
}

export function toSrtString(srtLines: SrtLine[]): string {
  if (!Array.isArray(srtLines)) { return ''; }
  const srtArrayForLibrary = srtLines.map(_mapFromSrtLine);
  return parser.toSrt(srtArrayForLibrary);
}
