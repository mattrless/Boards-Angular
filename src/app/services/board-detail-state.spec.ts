import { TestBed } from '@angular/core/testing';

import { BoardDetailStateService } from './board-detail-state.service';

describe('BoardDetailStateService', () => {
  let service: BoardDetailStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardDetailStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
