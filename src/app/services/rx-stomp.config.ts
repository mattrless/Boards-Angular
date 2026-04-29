import { environment } from '@env/environment';
import { RxStompConfig } from '@stomp/rx-stomp';

const wsUrl: string = environment.wsUrl;

export const boardsRxStompConfig: RxStompConfig = {
  brokerURL: wsUrl,
  reconnectDelay: 5000,
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
};
