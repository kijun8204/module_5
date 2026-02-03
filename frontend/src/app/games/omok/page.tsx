'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import OmokBoard from '@/components/games/OmokBoard';
import { BoardPosition, OmokState } from '@/types/game';
import { createInitialState, placeStone, getPlayerName } from '@/lib/games/omok';

export default function OmokGamePage() {
  return (
    <ProtectedRoute>
      <OmokGameContent />
    </ProtectedRoute>
  );
}

function OmokGameContent() {
  const [gameState, setGameState] = useState<OmokState>(createInitialState);

  // 셀 클릭 핸들러
  const handleCellClick = useCallback((position: BoardPosition) => {
    setGameState(prevState => placeStone(prevState, position));
  }, []);

  // 게임 리셋
  const handleReset = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  const { currentPlayer, winner, isGameOver, moveCount } = gameState;

  return (
    <div className="min-h-screen bg-cyber-dark bg-cyber-grid">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 뒤로가기 */}
        <Link
          href="/games"
          className="inline-flex items-center text-neon-cyan hover:text-neon-cyan-bright transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          게임 목록으로
        </Link>

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neon-cyan text-glow-cyan mb-2">
            OMOK
          </h1>
          <p className="text-gray-400 terminal-text">
            // 5목을 먼저 완성하면 승리
          </p>
        </div>

        {/* 게임 정보 패널 */}
        <div className="cyber-card rounded-xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 현재 차례 / 결과 */}
            <div className="flex items-center space-x-4">
              {isGameOver ? (
                winner ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-neon-green text-glow-green">
                      WINNER
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full ${
                        winner === 'BLACK'
                          ? 'bg-gradient-to-br from-gray-800 to-black glow-cyan'
                          : 'bg-gradient-to-br from-white to-gray-200 glow-purple'
                      }`}
                    />
                    <span className="text-xl text-gray-300">
                      {getPlayerName(winner)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-neon-orange">
                    DRAW
                  </span>
                )
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400 uppercase tracking-wider">
                    Current Turn
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full transition-all duration-300 ${
                      currentPlayer === 'BLACK'
                        ? 'bg-gradient-to-br from-gray-800 to-black shadow-neon-cyan'
                        : 'bg-gradient-to-br from-white to-gray-200 shadow-neon-purple'
                    }`}
                  />
                  <span className="text-lg font-medium text-gray-300">
                    {getPlayerName(currentPlayer)}
                  </span>
                </div>
              )}
            </div>

            {/* 턴 카운터 */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase tracking-wider">
                  Moves
                </span>
                <span className="text-2xl font-bold text-neon-cyan terminal-text">
                  {moveCount.toString().padStart(3, '0')}
                </span>
              </div>
            </div>

            {/* 리셋 버튼 */}
            <button
              onClick={handleReset}
              className="cyber-btn px-6 py-3 rounded-lg transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>RESET</span>
              </span>
            </button>
          </div>
        </div>

        {/* 게임 보드 */}
        <div className="flex justify-center">
          <OmokBoard state={gameState} onCellClick={handleCellClick} />
        </div>

        {/* 승리 오버레이 */}
        {isGameOver && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="cyber-card rounded-2xl p-8 text-center max-w-md mx-4 border-glow-cyan">
              <div className="mb-6">
                {winner ? (
                  <>
                    <h2 className="text-3xl font-bold text-neon-green text-glow-green mb-4">
                      VICTORY!
                    </h2>
                    <div className="flex items-center justify-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full ${
                          winner === 'BLACK'
                            ? 'bg-gradient-to-br from-gray-800 to-black glow-cyan'
                            : 'bg-gradient-to-br from-white to-gray-200 glow-purple'
                        }`}
                      />
                      <span className="text-2xl text-gray-300">
                        {getPlayerName(winner)} 승리
                      </span>
                    </div>
                  </>
                ) : (
                  <h2 className="text-3xl font-bold text-neon-orange">
                    DRAW GAME
                  </h2>
                )}
              </div>

              <p className="text-gray-400 mb-6 terminal-text">
                // Total moves: {moveCount}
              </p>

              <button
                onClick={handleReset}
                className="cyber-btn-primary px-8 py-3 rounded-lg font-bold w-full"
              >
                NEW GAME
              </button>
            </div>
          </div>
        )}

        {/* 게임 규칙 */}
        <div className="mt-8 cyber-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-neon-cyan mb-3">GAME RULES</h3>
          <ul className="space-y-2 text-gray-400 text-sm terminal-text">
            <li>// 흑돌이 먼저 시작합니다</li>
            <li>// 가로, 세로, 대각선으로 5개의 돌을 연속으로 놓으면 승리</li>
            <li>// 빈 칸을 클릭하여 돌을 놓습니다</li>
            <li>// 마지막 착수 위치는 하이라이트됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
