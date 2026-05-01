import { CardResponseDto } from './../../../api/generated/model/cardResponseDto';

export interface CardDropData {
  listId: number | undefined;
  cards: CardResponseDto[]
};
