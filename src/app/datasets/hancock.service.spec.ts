import { TestBed } from '@angular/core/testing';

import { HancockService } from './hancock.service';

describe('HancockService', () => {
  let service: HancockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HancockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
