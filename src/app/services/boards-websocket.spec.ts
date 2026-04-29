import { TestBed } from '@angular/core/testing';

import { BoardsWebsocketService } from './boards-websocket.service';

describe('BoardsWebsocket', () => {
  let service: BoardsWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardsWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
