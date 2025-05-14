import { TestBed } from '@angular/core/testing';

import { PdfCombineService } from './pdf-combine.service';

describe('PdfCombineService', () => {
  let service: PdfCombineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfCombineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
