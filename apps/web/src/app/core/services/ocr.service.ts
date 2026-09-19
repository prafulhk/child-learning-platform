import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { recognize } from 'tesseract.js';
import { OcrExtractionUpdate } from '../models/ocr.model';

@Injectable({ providedIn: 'root' })
export class OcrService {
  readonly supportedImageMimeTypes = ['image/jpeg', 'image/png', 'image/heic'] as const;

  extractText(file: File): Observable<OcrExtractionUpdate> {
    return new Observable<OcrExtractionUpdate>((subscriber) => {
      try {
        this.validateInputFile(file);
      } catch (error) {
        subscriber.error(error);
        return;
      }

      subscriber.next({
        status: 'Reading image...',
        progress: 0,
        text: '',
        isComplete: false,
      });

      void recognize(file, 'eng', {
        logger: (message) => {
          if (!message || typeof message.progress !== 'number') {
            return;
          }

          subscriber.next({
            status: message.status ?? 'Reading image...',
            progress: this.normalizeProgress(message.progress),
            text: '',
            isComplete: false,
          });
        },
      })
        .then((result) => {
          subscriber.next({
            status: 'Completed',
            progress: 1,
            text: result.data.text ?? '',
            isComplete: true,
          });
          subscriber.complete();
        })
        .catch(() => {
          subscriber.error(new Error('Unable to read text from this image. Please try again.'));
        });
    });
  }

  private validateInputFile(file: File): void {
    if (file.type === 'application/pdf') {
      throw new Error('PDF extraction is not available yet. Please choose an image file.');
    }

    if (
      !this.supportedImageMimeTypes.includes(
        file.type as (typeof this.supportedImageMimeTypes)[number],
      )
    ) {
      throw new Error('Unsupported file type. Choose a JPEG, PNG, or HEIC image.');
    }
  }

  private normalizeProgress(value: number): number {
    if (value < 0) {
      return 0;
    }

    if (value > 1) {
      return 1;
    }

    return value;
  }
}
