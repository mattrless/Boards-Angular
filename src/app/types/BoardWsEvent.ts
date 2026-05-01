export type BoardWsEvent = {
  event: string;
  boardId?: number;
  boardListId?: number;
  cardId?: number;
  targetBoardList?: number;
  sourceBoardListId?: number;
  userId?: number;
};
