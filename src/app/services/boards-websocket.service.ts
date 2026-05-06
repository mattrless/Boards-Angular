import { inject, Injectable } from '@angular/core';
import { RxStomp, StompHeaders } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { map, share } from 'rxjs';
import { Subscription } from 'rxjs';

import { JwtTokenService } from './jwt-token.service';
import { BoardPermissionsService } from './board-permissions.service';
import { BoardsStateService } from './boards-state.service';
import { BoardDetailStateService } from './board-detail-state.service';
import { CardDetailStateService } from './card-detail-state.service';
import { AuthSessionService } from './auth-session.service';
import { Router } from '@angular/router';

import { BoardWsEvent } from '../types/BoardWsEvent';
import { boardsRxStompConfig } from './rx-stomp.config';
import { environment } from '@env/environment';
import { toast } from '@spartan-ng/brain/sonner';

@Injectable({
  providedIn: 'root',
})
export class BoardsWebsocketService extends RxStomp {
  private readonly jwt = inject(JwtTokenService);
  private readonly boardPermissions = inject(BoardPermissionsService);
  private readonly boardsState = inject(BoardsStateService);
  private readonly boardDetail = inject(BoardDetailStateService);
  private readonly auth = inject(AuthSessionService);
  private readonly cardDetail = inject(CardDetailStateService);
  private readonly router = inject(Router);

  private eventsSub?: Subscription;
  private isConnected = false;

  readonly events$ = this.watch('/user/queue/boards').pipe(
    map((msg: Message) => JSON.parse(msg.body) as BoardWsEvent),
    share()
  );

  constructor() {
    super();
    this.configure(boardsRxStompConfig);
  }

  connect(): void {
    const token = this.jwt.getToken();
    if (!token || this.isConnected) return;

    const headers: StompHeaders = {
      Authorization: `Bearer ${token}`,
    };

    this.configure({ ...boardsRxStompConfig, connectHeaders: headers });
    this.activate();

    this.eventsSub = this.events$.subscribe((event) =>
      this.handleEvent(event)
    );

    this.isConnected = true;
  }

  disconnect(): void {
    if (!this.isConnected) return;

    this.eventsSub?.unsubscribe();
    this.eventsSub = undefined;

    this.deactivate();
    this.isConnected = false;
  }

  private handleEvent(event: BoardWsEvent) {
    switch (event.event) {
      case 'board:memberAdded':
      case 'board:memberRemoved': {
        this.boardsState.reload();

        const currentBoardId = this.boardDetail.boardId();

        if (event.boardId === currentBoardId) {
          this.boardDetail.clear();
          void this.router.navigate(['/boards']);
          toast.info('You were removed from the board');
        }
        break;
      }

      case 'board:memberRoleUpdated': {
        this.boardsState.reload();
        if (event.boardId) {
          this.boardPermissions.reload(event.boardId);
        }
        break;
      }

      case 'board:updated': {
        this.boardsState.reload();

        if (event.boardId === this.boardDetail.boardId()) {
          this.boardDetail.reloadBoard();
        }
        break;
      }

      case 'board:removed': {
        this.boardsState.reload();

        if (event.boardId === this.boardDetail.boardId()) {
          this.boardDetail.clear();
          void this.router.navigate(['/boards']);
          toast.info('This board was removed');
        }
        break;
      }

      case 'board:membersUpdated': {
        const currentUserId = this.auth.user()?.id;

        if (!event.boardId || !event.userId) break;
        if (event.userId === currentUserId) break;

        this.boardsState.reload();
        this.boardPermissions.reload(event.boardId);

        if (this.boardDetail.boardId() === event.boardId) {
          this.boardDetail.reloadMembers();
          this.boardDetail.reloadBoard();
        }
        break;
      }

      case 'list:updated':
      case 'list:created':
      case 'list:removed':
      case 'list:moved':
        this.boardDetail.reloadLists();
        break;

      case 'card:moved': {
        const currentUserId = this.auth.user()?.id;

        if (!event.sourceBoardListId || !event.targetBoardList || !event.userId) break;
        if (event.userId === currentUserId) break;

        this.boardDetail.reloadCardsForList(event.sourceBoardListId);

        if (event.sourceBoardListId !== event.targetBoardList) {
          this.boardDetail.reloadCardsForList(event.targetBoardList);
        }
        break;
      }

      case 'card:created':
      case 'card:removed':
      case 'card:updated': {
        if (event.targetBoardList) {
          this.boardDetail.reloadCardsForList(event.targetBoardList);
        }

        if (event.cardId === this.cardDetail.cardId()) {
          this.cardDetail.reloadCard();
        }
        break;
      }

      case 'card:membersUpdated': {
        if (event.cardId === this.cardDetail.cardId()) {
          this.cardDetail.reloadMembers();
        }
        break;
      }

      default:
        if (!environment.production) {
          console.warn('Unhandled board ws event', event);
        }
    }
  }
}
