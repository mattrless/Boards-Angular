import { TestBed } from '@angular/core/testing';

import { BoardPermissionsService } from './board-permissions.service';

describe('BoardPermissionsService', () => {
  let service: BoardPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
