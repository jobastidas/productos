import { TestBed } from '@angular/core/testing';

import { PeticonesService } from './peticones.service';

describe('PeticonesService', () => {
  let service: PeticonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeticonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
