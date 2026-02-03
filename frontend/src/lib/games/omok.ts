import { Player, BoardPosition, OmokState } from '@/types/game';

// 바둑판 크기 (15x15)
export const BOARD_SIZE = 15;

// 승리에 필요한 연속 돌 개수
const WIN_COUNT = 5;

// 8방향 체크용 (상, 하, 좌, 우, 대각선 4방향)
// 실제로는 4쌍의 반대 방향만 체크하면 됨
const DIRECTIONS: [number, number][] = [
  [0, 1],   // 가로
  [1, 0],   // 세로
  [1, 1],   // 대각선 (좌상-우하)
  [1, -1],  // 대각선 (우상-좌하)
];

/**
 * 초기 게임 상태 생성
 */
export function createInitialState(): OmokState {
  const board: Player[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill('EMPTY'));

  return {
    board,
    currentPlayer: 'BLACK', // 흑돌 선공
    winner: null,
    isGameOver: false,
    lastMove: null,
    moveCount: 0,
  };
}

/**
 * 특정 위치에 돌을 놓을 수 있는지 확인
 */
export function canPlaceStone(state: OmokState, position: BoardPosition): boolean {
  const { row, col } = position;

  // 게임이 끝났으면 돌을 놓을 수 없음
  if (state.isGameOver) return false;

  // 범위 체크
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;

  // 이미 돌이 있으면 놓을 수 없음
  if (state.board[row][col] !== 'EMPTY') return false;

  return true;
}

/**
 * 특정 방향으로 연속된 같은 색 돌 개수 세기
 */
function countInDirection(
  board: Player[][],
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): number {
  let count = 0;
  let r = row + dr;
  let c = col + dc;

  while (
    r >= 0 && r < BOARD_SIZE &&
    c >= 0 && c < BOARD_SIZE &&
    board[r][c] === player
  ) {
    count++;
    r += dr;
    c += dc;
  }

  return count;
}

/**
 * 승리 판정: 5개 연속인지 확인
 */
export function checkWin(board: Player[][], position: BoardPosition, player: Player): boolean {
  const { row, col } = position;

  // 4방향에 대해 양쪽으로 연속된 돌 개수 확인
  for (const [dr, dc] of DIRECTIONS) {
    // 한 방향으로 센 개수
    const countPositive = countInDirection(board, row, col, dr, dc, player);
    // 반대 방향으로 센 개수
    const countNegative = countInDirection(board, row, col, -dr, -dc, player);

    // 본인 포함 총 연속 개수
    const totalCount = 1 + countPositive + countNegative;

    if (totalCount >= WIN_COUNT) {
      return true;
    }
  }

  return false;
}

/**
 * 돌을 놓고 새로운 게임 상태 반환
 */
export function placeStone(state: OmokState, position: BoardPosition): OmokState {
  if (!canPlaceStone(state, position)) {
    return state; // 놓을 수 없으면 기존 상태 반환
  }

  const { row, col } = position;
  const { currentPlayer, board, moveCount } = state;

  // 새로운 보드 생성 (불변성 유지)
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = currentPlayer;

  // 승리 판정
  const isWin = checkWin(newBoard, position, currentPlayer);

  // 무승부 체크 (모든 칸이 차면)
  const isBoardFull = moveCount + 1 >= BOARD_SIZE * BOARD_SIZE;

  return {
    board: newBoard,
    currentPlayer: currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK',
    winner: isWin ? currentPlayer : null,
    isGameOver: isWin || isBoardFull,
    lastMove: position,
    moveCount: moveCount + 1,
  };
}

/**
 * 플레이어 이름 반환
 */
export function getPlayerName(player: Player): string {
  switch (player) {
    case 'BLACK':
      return '흑';
    case 'WHITE':
      return '백';
    default:
      return '';
  }
}
