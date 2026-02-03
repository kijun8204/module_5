// 플레이어 타입: 흑돌(BLACK), 백돌(WHITE), 빈 칸(EMPTY)
export type Player = 'BLACK' | 'WHITE' | 'EMPTY';

// 바둑판 좌표
export interface BoardPosition {
  row: number;
  col: number;
}

// 오목 게임 상태
export interface OmokState {
  // 15x15 바둑판 (각 셀은 Player 타입)
  board: Player[][];
  // 현재 차례
  currentPlayer: Exclude<Player, 'EMPTY'>;
  // 승자 (게임 중이면 null)
  winner: Exclude<Player, 'EMPTY'> | null;
  // 게임 종료 여부
  isGameOver: boolean;
  // 마지막 착수 위치 (하이라이트용)
  lastMove: BoardPosition | null;
  // 총 수 (턴 수)
  moveCount: number;
}

// 게임 타입
export interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  path: string;
}
