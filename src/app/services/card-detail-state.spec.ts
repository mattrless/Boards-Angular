import { TestBed } from '@angular/core/testing';

import { CardDetailStateService } from './card-detail-state.service';

describe('CardDetailState', () => {
  let service: CardDetailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardDetailStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
