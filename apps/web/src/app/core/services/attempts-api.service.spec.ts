import { TestBed } from '@angular/core/testing';
import { AttemptsApiService } from './attempts-api.service';

describe('AttemptsApiService', () => {
  let service: AttemptsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttemptsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
