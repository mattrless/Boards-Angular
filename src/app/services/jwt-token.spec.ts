import { TestBed } from '@angular/core/testing';

import { JwtTokenService } from './jwt-token.service';

describe('JwtToken', () => {
  let service: JwtTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
