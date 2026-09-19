import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, Subject, of, throwError } from 'rxjs';
import { OcrExtractionUpdate } from '../../core/models/ocr.model';
import { Question } from '../../core/models/question.model';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { OcrService } from '../../core/services/ocr.service';
import { QuestionService } from '../../core/services/question.service';
import { QuestionBankComponent } from './question-bank.component';
import { QuestionFormComponent } from './question-form.component';

describe('QuestionBankComponent', () => {
  const validImportMimeTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];

  const buildQuestion = (overrides: Partial<Question>): Question => ({
    id: 'q001',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 3 }, { value: 2 }, { value: 4 }],
    options: [
      { id: 'opt_a', value: 4 },
      { id: 'opt_b', value: 7 },
      { id: 'opt_c', value: 8 },
      { id: 'opt_d', value: 9 },
    ],
    correctOptionId: 'opt_d',
    explanation: '3 + 2 + 4 = 9',
    createdAt: '2026-09-19T00:00:00Z',
    ...overrides,
  });

  const seededQuestions = [
    buildQuestion({ id: 'q001' }),
    buildQuestion({ id: 'q002', difficulty: 'MEDIUM' }),
    buildQuestion({ id: 'q003', rows: [{ value: 1 }, { value: 2 }, { value: 3 }] }),
  ];

  let mockQuestionService: { getQuestionsByTopic: ReturnType<typeof vi.fn> };
  let mockOcrService: { extractText: ReturnType<typeof vi.fn> };
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    localStorage.clear();
    mockQuestionService = {
      getQuestionsByTopic: vi.fn().mockReturnValue(seededQuestions),
    };
    mockOcrService = {
      extractText: vi.fn().mockReturnValue(
        of<OcrExtractionUpdate>({
          status: 'Completed',
          progress: 1,
          text: 'Seeded OCR text',
          isComplete: true,
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [QuestionBankComponent],
      providers: [
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: OcrService, useValue: mockOcrService },
      ],
    }).compileComponents();

    localStorageService = TestBed.inject(LocalStorageService);
  });

  const createFixture = (): ComponentFixture<QuestionBankComponent> => {
    const fixture = TestBed.createComponent(QuestionBankComponent);
    fixture.detectChanges();

    return fixture;
  };

  const clickButton = (fixture: ComponentFixture<QuestionBankComponent>, label: string): void => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const button = buttons.find((candidate) => candidate.textContent?.trim() === label);

    if (!button) {
      throw new Error(`Expected button with label ${label}`);
    }

    button.click();
    fixture.detectChanges();
  };

  const getCardById = (
    fixture: ComponentFixture<QuestionBankComponent>,
    questionId: string,
  ): HTMLElement => {
    const card = fixture.nativeElement.querySelector(
      `[data-testid="question-card"][data-question-id="${questionId}"]`,
    ) as HTMLElement | null;

    if (!card) {
      throw new Error(`Expected question card ${questionId}`);
    }

    return card;
  };

  const setInputValue = (input: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const createProgressStream = (): {
    stream: Observable<OcrExtractionUpdate>;
    push: (value: OcrExtractionUpdate) => void;
    complete: () => void;
  } => {
    const subject = new Subject<OcrExtractionUpdate>();

    return {
      stream: subject.asObservable(),
      push: (value: OcrExtractionUpdate) => subject.next(value),
      complete: () => subject.complete(),
    };
  };

  const getImportFileInput = (
    fixture: ComponentFixture<QuestionBankComponent>,
  ): HTMLInputElement => {
    const input = fixture.nativeElement.querySelector(
      '[data-testid="import-file-input"]',
    ) as HTMLInputElement | null;

    if (!input) {
      throw new Error('Expected import file input to exist');
    }

    return input;
  };

  const selectImportFile = (
    fixture: ComponentFixture<QuestionBankComponent>,
    file: File | null,
  ): void => {
    const input = getImportFileInput(fixture);
    const files = file ? [file] : [];

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: {
        0: file,
        length: files.length,
        item: (index: number) => files[index] ?? null,
      },
    });

    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
  };

  it('renders seeded questions', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(3);
    expect(fixture.nativeElement.textContent as string).toContain('Question Bank');
    expect(fixture.nativeElement.textContent as string).toContain('Abacus');
    expect(fixture.nativeElement.textContent as string).toContain('Single-Digit Addition');
  });

  it('initial load uses seeded questions when storage is empty', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(3);
    expect(mockQuestionService.getQuestionsByTopic).toHaveBeenCalledWith('single-digit-addition');
  });

  it('initial load uses persisted questions when storage exists', () => {
    const persistedQuestions = [buildQuestion({ id: 'persisted-1', difficulty: 'HARD' })];
    localStorageService.saveQuestionBankQuestions('single-digit-addition', persistedQuestions);

    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(1);
    expect(fixture.nativeElement.textContent as string).toContain('ID: persisted-1');
    expect(fixture.nativeElement.textContent as string).toContain('HARD');
  });

  it('renders Add Question button', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('+ Add Question');
  });

  it('renders Import Questions button', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Import Questions');
  });

  it('renders Edit/Delete buttons', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');

    expect(firstCard.textContent as string).toContain('Edit');
    expect(firstCard.textContent as string).toContain('Delete');
  });

  it('renders Back to Parent Tools', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Back to Parent Tools');
  });

  it('Add Question opens QuestionFormComponent', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');

    expect(fixture.nativeElement.querySelector('app-question-form')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="question-card"]')).toBeFalsy();
  });

  it('Import Questions opens the import placeholder view', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');

    expect(fixture.nativeElement.textContent as string).toContain('Import Questions');
    expect(fixture.nativeElement.textContent as string).toContain(
      'Choose an image or PDF from this device',
    );
    expect(getImportFileInput(fixture).accept.split(',')).toEqual(validImportMimeTypes);
    expect(fixture.nativeElement.querySelector('[data-testid="question-card"]')).toBeFalsy();
  });

  it('Back to Question Bank returns from the import view', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');
    clickButton(fixture, 'Back to Question Bank');

    expect(fixture.nativeElement.querySelector('[data-testid="question-card"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent as string).not.toContain('Choose Image or PDF');
  });

  it('valid image selection shows the file name, type, and size', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');

    selectImportFile(fixture, new File(['image-data'], 'worksheet.jpg', { type: 'image/jpeg' }));

    expect(fixture.nativeElement.textContent as string).toContain('worksheet.jpg');
    expect(
      fixture.nativeElement.querySelector('[data-testid="selected-import-file-type"]')
        ?.textContent as string,
    ).toContain('image/jpeg');
    expect(
      fixture.nativeElement.querySelector('[data-testid="selected-import-file-size"]')
        ?.textContent as string,
    ).toContain('B');
  });

  it('valid PDF selection enables Continue', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');

    selectImportFile(fixture, new File(['pdf-data'], 'lesson.pdf', { type: 'application/pdf' }));

    const continueButton = fixture.nativeElement.querySelector(
      '[data-testid="import-continue-button"]',
    ) as HTMLButtonElement | null;

    expect(continueButton?.disabled).toBe(false);
    expect(fixture.nativeElement.textContent as string).toContain('lesson.pdf');
  });

  it('Continue starts OCR for a selected image file', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');
    selectImportFile(fixture, new File(['image-data'], 'ocr-image.jpg', { type: 'image/jpeg' }));

    clickButton(fixture, 'Continue');

    expect(mockOcrService.extractText).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent as string).toContain('Extracted text');
    expect(fixture.nativeElement.textContent as string).toContain('Seeded OCR text');
  });

  it('unsupported file type shows a validation message', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');

    selectImportFile(fixture, new File(['text-data'], 'notes.txt', { type: 'text/plain' }));

    expect(
      fixture.nativeElement.querySelector('[data-testid="import-validation-message"]')
        ?.textContent as string,
    ).toContain('Choose a JPEG, PNG, HEIC, or PDF file.');
    expect(fixture.nativeElement.querySelector('[data-testid="selected-import-file"]')).toBeFalsy();
  });

  it('Remove File clears the current selection', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');
    selectImportFile(fixture, new File(['image-data'], 'worksheet.png', { type: 'image/png' }));

    clickButton(fixture, 'Remove File');

    expect(fixture.nativeElement.querySelector('[data-testid="selected-import-file"]')).toBeFalsy();
    expect(
      (
        fixture.nativeElement.querySelector(
          '[data-testid="import-continue-button"]',
        ) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });

  it('Continue stays disabled without a valid file', () => {
    const fixture = createFixture();

    clickButton(fixture, 'Import Questions');

    const continueButton = fixture.nativeElement.querySelector(
      '[data-testid="import-continue-button"]',
    ) as HTMLButtonElement | null;

    expect(continueButton?.disabled).toBe(true);
  });

  it('Continue with PDF shows OCR message and does not open extracted-text view', () => {
    const fixture = createFixture();
    mockOcrService.extractText.mockReturnValue(
      throwError(
        () => new Error('PDF extraction is not available yet. Please choose an image file.'),
      ),
    );

    clickButton(fixture, 'Import Questions');
    selectImportFile(fixture, new File(['pdf-data'], 'ready.pdf', { type: 'application/pdf' }));

    clickButton(fixture, 'Continue');

    expect(fixture.nativeElement.textContent as string).toContain(
      'PDF extraction is not available yet. Please choose an image file.',
    );
    expect(fixture.nativeElement.textContent as string).not.toContain('Extracted text');
  });

  it('shows loading/progress state while OCR is running', () => {
    const fixture = createFixture();
    const progressStream = createProgressStream();
    mockOcrService.extractText.mockReturnValue(progressStream.stream);

    clickButton(fixture, 'Import Questions');
    selectImportFile(fixture, new File(['image-data'], 'progress.png', { type: 'image/png' }));
    clickButton(fixture, 'Continue');

    progressStream.push({
      status: 'recognizing text',
      progress: 0.6,
      text: '',
      isComplete: false,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Reading image...');
    expect(
      fixture.nativeElement.querySelector('[data-testid="ocr-progress-label"]')
        ?.textContent as string,
    ).toContain('60%');
  });

  it('shows OCR failure and allows retry with the same selected image', () => {
    const fixture = createFixture();
    mockOcrService.extractText.mockReturnValue(
      throwError(() => new Error('Unable to read text from this image. Please try again.')),
    );

    clickButton(fixture, 'Import Questions');
    selectImportFile(fixture, new File(['image-data'], 'retry.png', { type: 'image/png' }));
    clickButton(fixture, 'Continue');

    expect(fixture.nativeElement.textContent as string).toContain(
      'Unable to read text from this image. Please try again.',
    );
    expect(fixture.nativeElement.textContent as string).toContain('retry.png');

    mockOcrService.extractText.mockReturnValue(
      of({
        status: 'Completed',
        progress: 1,
        text: 'Retry success',
        isComplete: true,
      }),
    );
    clickButton(fixture, 'Continue');

    expect(mockOcrService.extractText).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent as string).toContain('Retry success');
  });

  it('Retry OCR from extracted-text view re-runs OCR', () => {
    const fixture = createFixture();
    mockOcrService.extractText.mockReturnValue(
      of({
        status: 'Completed',
        progress: 1,
        text: 'Initial OCR',
        isComplete: true,
      }),
    );

    clickButton(fixture, 'Import Questions');
    selectImportFile(fixture, new File(['image-data'], 'retry-view.png', { type: 'image/png' }));
    clickButton(fixture, 'Continue');

    mockOcrService.extractText.mockReturnValue(
      of({
        status: 'Completed',
        progress: 1,
        text: 'Updated OCR',
        isComplete: true,
      }),
    );
    clickButton(fixture, 'Retry OCR');

    expect(mockOcrService.extractText).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent as string).toContain('Updated OCR');
  });

  it('OCR flow does not save Question Bank questions', () => {
    const fixture = createFixture();
    const saveSpy = vi.spyOn(localStorageService, 'saveQuestionBankQuestions');

    clickButton(fixture, 'Import Questions');
    selectImportFile(fixture, new File(['image-data'], 'nosave.png', { type: 'image/png' }));
    clickButton(fixture, 'Continue');

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('Cancel returns to list', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');
    clickButton(fixture, 'Cancel');

    expect(fixture.nativeElement.querySelector('app-question-form')).toBeFalsy();
    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(3);
  });

  it('Save from create adds a question to the in-memory list', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');
    clickButton(fixture, 'Save Question');

    expect(fixture.nativeElement.querySelector('app-question-form')).toBeFalsy();
    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(4);
  });

  it('create question persists the updated list', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');
    clickButton(fixture, 'Save Question');

    expect(localStorageService.getQuestionBankQuestions('single-digit-addition')).toHaveLength(4);
  });

  it('created question remains visible after reloading the component', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');
    clickButton(fixture, 'Save Question');

    const reloadedFixture = createFixture();

    expect(
      reloadedFixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length,
    ).toBe(4);
  });

  it('newly added question is displayed', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');
    clickButton(fixture, 'Save Question');

    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(4);
    expect(fixture.nativeElement.textContent as string).toContain('Question 1');
  });

  it('Edit opens QuestionFormComponent with the selected question', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-question-form')).toBeTruthy();
    expect(fixture.nativeElement.textContent as string).toContain('Edit Question');
  });

  it('saving edit updates that question', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    const formDebugElement = fixture.debugElement.query(By.directive(QuestionFormComponent));

    if (!formDebugElement) {
      throw new Error('Expected QuestionFormComponent to be rendered');
    }

    const formComponent = formDebugElement.componentInstance as QuestionFormComponent;
    formComponent.difficulty = 'HARD';
    formComponent.onSave();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-question-form')).toBeFalsy();
    expect(fixture.nativeElement.textContent as string).toContain('HARD');
  });

  it('edit question persists the updated list', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    const formDebugElement = fixture.debugElement.query(By.directive(QuestionFormComponent));

    if (!formDebugElement) {
      throw new Error('Expected QuestionFormComponent to be rendered');
    }

    const formComponent = formDebugElement.componentInstance as QuestionFormComponent;
    formComponent.difficulty = 'HARD';
    formComponent.onSave();
    fixture.detectChanges();

    expect(
      localStorageService.getQuestionBankQuestions('single-digit-addition')[0].difficulty,
    ).toBe('HARD');
  });

  it('edited question remains changed after reloading the component', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    const formDebugElement = fixture.debugElement.query(By.directive(QuestionFormComponent));

    if (!formDebugElement) {
      throw new Error('Expected QuestionFormComponent to be rendered');
    }

    const formComponent = formDebugElement.componentInstance as QuestionFormComponent;
    formComponent.difficulty = 'HARD';
    formComponent.onSave();
    fixture.detectChanges();

    const reloadedFixture = createFixture();

    expect(reloadedFixture.nativeElement.textContent as string).toContain('HARD');
  });

  it('question IDs remain unchanged during persistence', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    const formDebugElement = fixture.debugElement.query(By.directive(QuestionFormComponent));

    if (!formDebugElement) {
      throw new Error('Expected QuestionFormComponent to be rendered');
    }

    const formComponent = formDebugElement.componentInstance as QuestionFormComponent;
    formComponent.difficulty = 'HARD';
    formComponent.onSave();
    fixture.detectChanges();

    expect(localStorageService.getQuestionBankQuestions('single-digit-addition')[0].id).toBe(
      'q001',
    );
  });

  it('seeded questions are not duplicated', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');
    clickButton(fixture, 'Save Question');

    const reloadedFixture = createFixture();

    expect(
      reloadedFixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length,
    ).toBe(4);
  });

  it('newly created question remains after reloading from storage', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Question');
    clickButton(fixture, 'Save Question');

    const reloadedFixture = createFixture();

    expect(
      reloadedFixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length,
    ).toBe(4);
    expect(reloadedFixture.nativeElement.textContent as string).toContain('Question 1');
  });

  it('persisted questions for another topic are not loaded', () => {
    localStorageService.saveQuestionBankQuestions('single-digit-subtraction', [
      buildQuestion({ id: 'other-topic-1', topicId: 'single-digit-subtraction' }),
    ]);

    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(3);
    expect(fixture.nativeElement.textContent as string).not.toContain('other-topic-1');
  });

  it('edited question remains changed after reloading from storage', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    const formDebugElement = fixture.debugElement.query(By.directive(QuestionFormComponent));

    if (!formDebugElement) {
      throw new Error('Expected QuestionFormComponent to be rendered');
    }

    const formComponent = formDebugElement.componentInstance as QuestionFormComponent;
    formComponent.difficulty = 'HARD';
    formComponent.onSave();
    fixture.detectChanges();

    const reloadedFixture = createFixture();

    expect(reloadedFixture.nativeElement.textContent as string).toContain('HARD');
  });

  it('original question ID remains unchanged', () => {
    const fixture = createFixture();
    const firstCardBefore = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCardBefore.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    const explanation = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    setInputValue(explanation, 'Updated explanation');
    clickButton(fixture, 'Save Question');

    expect(fixture.nativeElement.textContent as string).toContain('ID: q001');
  });

  it('Cancel edit leaves the original unchanged', () => {
    const fixture = createFixture();
    const firstCard = getCardById(fixture, 'q001');
    const editButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    const explanation = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    setInputValue(explanation, 'Changed but not saved');
    clickButton(fixture, 'Cancel');

    expect(fixture.nativeElement.querySelector('app-question-form')).toBeFalsy();
    expect(fixture.nativeElement.textContent as string).not.toContain('Changed but not saved');
  });

  it('Delete remains non-functional', () => {
    const fixture = createFixture();
    const beforeCount = fixture.nativeElement.querySelectorAll(
      '[data-testid="question-card"]',
    ).length;
    const firstCard = getCardById(fixture, 'q001');
    const deleteButton = Array.from(firstCard.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'Delete',
    ) as HTMLButtonElement | undefined;

    if (!deleteButton) {
      throw new Error('Expected Delete button to exist');
    }

    deleteButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-card"]').length).toBe(
      beforeCount,
    );
  });

  it('3-row questions render correctly', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('3 rows');
    expect(fixture.nativeElement.textContent as string).toContain('3');
    expect(fixture.nativeElement.textContent as string).toContain('2');
    expect(fixture.nativeElement.textContent as string).toContain('4');
  });
});
