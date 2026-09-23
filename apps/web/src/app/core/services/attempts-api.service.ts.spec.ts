import { TestBed } from '@angular/core/testing';
import { AttemptsApiServiceTs } from './attempts-api.service.ts';

describe('AttemptsApiServiceTs', () => {
  let service: AttemptsApiServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttemptsApiServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
