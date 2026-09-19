import { firstValueFrom, lastValueFrom } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { recognize } from 'tesseract.js';
import { OcrService } from './ocr.service';

vi.mock('tesseract.js', () => ({
  recognize: vi.fn(),
}));

describe('OcrService', () => {
  const recognizeMock = vi.mocked(recognize);
  let service: OcrService;

  beforeEach(() => {
    service = new OcrService();
    recognizeMock.mockReset();
  });

  it('extracts text for a valid image file', async () => {
    recognizeMock.mockImplementation(async () => ({ data: { text: '2 + 3 = 5' } }) as never);

    const updates = await firstValueFrom(
      service
        .extractText(new File(['image-data'], 'sum.png', { type: 'image/png' }))
        .pipe(toArray()),
    );

    expect(updates.at(-1)).toEqual({
      status: 'Completed',
      progress: 1,
      text: '2 + 3 = 5',
      isComplete: true,
    });
    expect(recognizeMock).toHaveBeenCalledTimes(1);
  });

  it('emits progress updates from OCR logger', async () => {
    recognizeMock.mockImplementation(async (_file, _lang, options) => {
      options?.logger?.({ status: 'recognizing text', progress: 0.42 } as never);
      return { data: { text: 'progress text' } } as never;
    });

    const updates = await firstValueFrom(
      service
        .extractText(new File(['image-data'], 'progress.jpeg', { type: 'image/jpeg' }))
        .pipe(toArray()),
    );

    expect(updates.some((update) => update.status === 'recognizing text')).toBe(true);
    expect(updates.some((update) => update.progress === 0.42)).toBe(true);
  });

  it('returns a clear error for PDF input and does not call OCR', async () => {
    await expect(
      firstValueFrom(
        service.extractText(new File(['pdf-data'], 'worksheet.pdf', { type: 'application/pdf' })),
      ),
    ).rejects.toThrow('PDF extraction is not available yet. Please choose an image file.');

    expect(recognizeMock).not.toHaveBeenCalled();
  });

  it('returns a clear error for unsupported file type and does not call OCR', async () => {
    await expect(
      firstValueFrom(
        service.extractText(new File(['text-data'], 'notes.txt', { type: 'text/plain' })),
      ),
    ).rejects.toThrow('Unsupported file type. Choose a JPEG, PNG, or HEIC image.');

    expect(recognizeMock).not.toHaveBeenCalled();
  });

  it('surfaces OCR failures with a user-friendly message', async () => {
    recognizeMock.mockRejectedValue(new Error('worker failed'));

    await expect(
      lastValueFrom(
        service.extractText(new File(['image-data'], 'broken.png', { type: 'image/png' })),
      ),
    ).rejects.toThrow('Unable to read text from this image. Please try again.');
  });
});
