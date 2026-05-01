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
import { BoardDetailStateService } from './board-detail-state.service';
import { AuthSessionService } from './auth-session.service';

@Injectable({
  providedIn: 'root',
})
export class BoardsWebsocketService extends RxStomp {
  private readonly jwtTokenService = inject(JwtTokenService);
  private readonly boardPermissionsService = inject(BoardPermissionsService);
  private readonly boardsStateService = inject(BoardsStateService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly authSessionService = inject(AuthSessionService);

  readonly events = this.watch('/user/queue/boards').pipe(
    map((msg: Message) => JSON.parse(msg.body) as BoardWsEvent),
    share()
  );

  constructor() {
    super();
    this.configure(boardsRxStompConfig);

    this.events.subscribe((boardWsEvent: BoardWsEvent) => {
      switch (boardWsEvent.event) {
        // board events
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
        // list events
        case 'list:updated':
        case 'list:created':
        case 'list:removed':
        case 'list:moved':
          this.boardDetailStateService.reloadLists();
        break;
        // card events
        case 'card:moved': {
          const sourceListId = boardWsEvent.sourceBoardListId;
          const targetListId = boardWsEvent.targetBoardList;
          const actorUserId = boardWsEvent.userId;
          const currentUserId = this.authSessionService.user()?.id;

          if (sourceListId == null || targetListId == null || actorUserId == null) break;
          if (currentUserId == null || actorUserId === currentUserId) break;

          this.boardDetailStateService.reloadCardsForList(sourceListId);
          if (sourceListId !== targetListId) {
            this.boardDetailStateService.reloadCardsForList(targetListId);
          }
          break;
        }
        case 'card:created':
          const targetListId = boardWsEvent.targetBoardList;
          if (targetListId == null) break;
          this.boardDetailStateService.reloadCardsForList(targetListId);
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
