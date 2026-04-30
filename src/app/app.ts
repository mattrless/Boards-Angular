import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { AuthSessionService } from './services/auth-session.service';
import { BoardsWebsocketService } from './services/boards-websocket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToasterImports],
  templateUrl: './app.html',
})
export class App {
  private readonly authSessionService = inject(AuthSessionService);
  private readonly boardsWebsocketService = inject(BoardsWebsocketService);
  // connect to websockets
  constructor() {
    effect(() => {
      if (this.authSessionService.isAuthenticated()) {
        this.boardsWebsocketService.connect();
      } else {
        this.boardsWebsocketService.disconnect();
      }
    });
  }

}
