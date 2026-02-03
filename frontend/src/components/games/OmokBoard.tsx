'use client';

import { Player, BoardPosition, OmokState } from '@/types/game';
import { BOARD_SIZE } from '@/lib/games/omok';

interface OmokBoardProps {
  state: OmokState;
  onCellClick: (position: BoardPosition) => void;
}

export default function OmokBoard({ state, onCellClick }: OmokBoardProps) {
  const { board, lastMove, isGameOver } = state;

  // 마지막 수인지 확인
  const isLastMove = (row: number, col: number): boolean => {
    return lastMove !== null && lastMove.row === row && lastMove.col === col;
  };

  // 돌 스타일 결정
  const getStoneStyle = (player: Player, row: number, col: number): string => {
    if (player === 'EMPTY') return '';

    const baseStyle = player === 'BLACK'
      ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg'
      : 'bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-lg';

    const lastMoveHighlight = isLastMove(row, col)
      ? player === 'BLACK'
        ? 'ring-2 ring-neon-cyan glow-cyan'
        : 'ring-2 ring-neon-purple glow-purple'
      : '';

    return `${baseStyle} ${lastMoveHighlight}`;
  };

  // 셀 호버 스타일
  const getCellHoverStyle = (player: Player): string => {
    if (player !== 'EMPTY' || isGameOver) return '';
    return 'cursor-pointer hover:bg-neon-cyan/20 transition-colors duration-150';
  };

  return (
    <div className="relative p-4 cyber-card rounded-xl">
      {/* 바둑판 그리드 배경 */}
      <div className="relative bg-cyber-light rounded-lg p-2 border border-neon-cyan/30">
        {/* 격자 라인 SVG */}
        <svg
          className="absolute inset-2"
          width="100%"
          height="100%"
          viewBox={`0 0 ${(BOARD_SIZE - 1) * 30} ${(BOARD_SIZE - 1) * 30}`}
          preserveAspectRatio="none"
        >
          {/* 가로선 */}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 30}
              x2={(BOARD_SIZE - 1) * 30}
              y2={i * 30}
              stroke="rgba(0, 217, 255, 0.3)"
              strokeWidth="1"
            />
          ))}
          {/* 세로선 */}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 30}
              y1="0"
              x2={i * 30}
              y2={(BOARD_SIZE - 1) * 30}
              stroke="rgba(0, 217, 255, 0.3)"
              strokeWidth="1"
            />
          ))}
          {/* 화점 (천원, 꽃점) */}
          {[3, 7, 11].map(row =>
            [3, 7, 11].map(col => (
              <circle
                key={`dot-${row}-${col}`}
                cx={col * 30}
                cy={row * 30}
                r="4"
                fill="rgba(0, 217, 255, 0.5)"
              />
            ))
          )}
        </svg>

        {/* 셀 그리드 (클릭 영역) */}
        <div
          className="relative grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 30px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 30px)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`relative flex items-center justify-center w-[30px] h-[30px] ${getCellHoverStyle(cell)}`}
                onClick={() => {
                  if (cell === 'EMPTY' && !isGameOver) {
                    onCellClick({ row: rowIndex, col: colIndex });
                  }
                }}
              >
                {/* 돌 */}
                {cell !== 'EMPTY' && (
                  <div
                    className={`w-6 h-6 rounded-full ${getStoneStyle(cell, rowIndex, colIndex)} transform transition-all duration-200`}
                  >
                    {/* 마지막 수 표시 점 */}
                    {isLastMove(rowIndex, colIndex) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            cell === 'BLACK' ? 'bg-neon-cyan' : 'bg-neon-purple'
                          } animate-pulse`}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 좌표 표시 (선택적) */}
      <div className="flex justify-center mt-2">
        <span className="text-xs text-neon-cyan/50 terminal-text">
          {BOARD_SIZE}x{BOARD_SIZE} GRID
        </span>
      </div>
    </div>
  );
}
