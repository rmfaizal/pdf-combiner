import { TestBed } from '@angular/core/testing';

import { PdfIndexService } from './pdf-index.service';

describe('PdfIndexService', () => {
  let service: PdfIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
