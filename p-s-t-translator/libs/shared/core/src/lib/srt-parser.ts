// ===== SHARED CORE UTILITY: SRT PARSER =====
// This module contains pure, reusable functions for handling the SRT subtitle format.
// It is framework-agnostic and can be used by any part of the application.

// ===== IMPORTS & DEPENDENCIES =====
import { Parser } from 'srt-parser-2';
import { BadRequestException } from '@nestjs/common';

// ===== CONFIGURATION & CONSTANTS =====
// Instantiate the parser once for reuse.
const parser = new Parser();

// ===== TYPES & INTERFACES =====
/**
 * Represents a standardized, parsed subtitle line. This is our internal, type-safe representation.
 */
export interface SrtLine {
  /** The sequence number of the subtitle line (e.g., 1). */
  sequence: number;
  /** The start timestamp string in SRT format (e.g., "00:00:20,490"). */
  startTime: string;
  /** The end timestamp string in SRT format (e.g., "00:00:22,490"). */
  endTime: string;
  /** The calculated duration of the line in seconds. */
  duration: number;
  /** The sanitized (HTML-stripped and trimmed) text of the subtitle. */
  text: string;
}

// ===== PRIVATE HELPER FUNCTIONS =====

/**
 * Maps a line object from the srt-parser-2 library to our internal SrtLine format.
 * @private
 * @param libLine - The line object from the srt-parser-2 library.
 * @returns Our standardized SrtLine object.
 */
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

/**
 * Maps our internal SrtLine object back to the format expected by the srt-parser-2 library.
 * @private
 * @param srtLine - Our standardized SrtLine object.
 * @returns The line object for the srt-parser-2 library.
 */
function _mapFromSrtLine(srtLine: SrtLine): any {
  return {
    id: srtLine.sequence.toString(),
    startTime: srtLine.startTime,
    endTime: srtLine.endTime,
    text: srtLine.text,
  };
}

// ===== PUBLIC API FUNCTIONS =====

/**
 * Parses a raw SRT string into a structured array of subtitle lines.
 * @param srtContent - The full content of an SRT file.
 * @returns An array of structured SrtLine objects.
 * @throws {BadRequestException} If the SRT content is invalid or malformed.
 */
export function parseSrt(srtContent: string): SrtLine[] {
  if (typeof srtContent !== 'string' || !srtContent.trim()) {
    throw new BadRequestException('SRT content must be a non-empty string.');
  }
  try {
    const srtArray = parser.fromSrt(srtContent);
    return srtArray.map(_mapToSrtLine);
  } catch (error) {
    // Wrap the library's generic error in our standard NestJS exception.
    // This ensures consistent error responses across the API.
    throw new BadRequestException('Failed to parse malformed SRT content.', {
      cause: error,
      description: error.message,
    });
  }
}

/**
 * Converts an array of SrtLine objects back into a valid SRT formatted string.
 * @param srtLines - An array of SrtLine objects.
 * @returns A valid SRT string.
 */
export function toSrtString(srtLines: SrtLine[]): string {
  if (!Array.isArray(srtLines)) {
    return '';
  }
  const srtArrayForLibrary = srtLines.map(_mapFromSrtLine);
  return parser.toSrt(srtArrayForLibrary);
}

/**
 * Formats a batch of SrtLine objects into a simple, clean format for an AI prompt.
 * @param batch - An array of parsed SRT line objects.
 * @returns A string where each line is formatted as "sequence | text".
 */
export function toSrtPromptFormat(batch: SrtLine[]): string {
  if (!Array.isArray(batch)) {
    return '';
  }
  return batch.map((line) => `${line.sequence} | ${line.text}`).join('\n');
}
