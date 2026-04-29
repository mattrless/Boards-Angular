import { BoardsStateService } from './boards-state.service';
import { BoardPermissionsService } from './board-permissions.service';
import { RxStomp, StompHeaders } from '@stomp/rx-stomp';
import { JwtTokenService } from './jwt-token.service';
import { inject, Injectable } from '@angular/core';
import { BoardWsEvent } from '../types/BoardWsEvent';
import { map, share } from 'rxjs';
import { boardsRxStompConfig } from './rx-stomp.config';
import { Message } from '@stomp/stompjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardsWebsocketService extends RxStomp {
  private readonly jwtTokenService = inject(JwtTokenService);
  private readonly boardPermissionsService = inject(BoardPermissionsService);
  private readonly boardsStateService = inject(BoardsStateService);

  readonly events = this.watch('/user/queue/boards').pipe(
    map((msg: Message) => JSON.parse(msg.body) as BoardWsEvent),
    share()
  );

  constructor() {
    super();
    this.configure(boardsRxStompConfig);

    this.events.subscribe((boardWsEvent: BoardWsEvent) => {
      switch (boardWsEvent.event) {
        case 'board:updated':
        case 'board:removed':
        case 'board:memberAdded':
        case 'board:memberRemoved':
          this.boardsStateService.reload();
        break;
        case 'board:memberRoleUpdated':
          this.boardsStateService.reload();
          if (boardWsEvent.boardId) {
            this.boardPermissionsService.reload(boardWsEvent.boardId);
          }
        break;

        default:
          if (!environment.production) {
            console.warn('Unhandled board ws event', boardWsEvent);
          }
        break;
      }
    });
  }

  connect(): void {
    const token = this.jwtTokenService.getToken();
    if (!token || this.connected()) return;

    const headers: StompHeaders = { Authorization: `Bearer ${token}` };
    this.configure({ ...boardsRxStompConfig, connectHeaders: headers });
    this.activate();
  }

  disconnect(): void {
    if (this.active) this.deactivate();
  }
}
