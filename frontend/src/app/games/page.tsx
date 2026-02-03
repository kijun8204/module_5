'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Game } from '@/types/game';

// 게임 목록 데이터
const games: Game[] = [
  {
    id: 'omok',
    name: '오목',
    description: '15x15 바둑판에서 5개의 돌을 먼저 연속으로 놓으면 승리하는 전략 게임',
    path: '/games/omok',
  },
  // 추후 다른 게임 추가 가능
];

export default function GamesPage() {
  return (
    <ProtectedRoute>
      <GamesContent />
    </ProtectedRoute>
  );
}

function GamesContent() {
  return (
    <div className="min-h-screen bg-cyber-dark bg-cyber-grid">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-neon-cyan text-glow-cyan mb-4">
            GAME CENTER
          </h1>
          <p className="text-gray-400 terminal-text text-lg">
            // SELECT YOUR GAME
          </p>
        </div>

        {/* 게임 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}

          {/* Coming Soon 카드 */}
          <div className="cyber-card rounded-xl p-6 opacity-50 cursor-not-allowed">
            <div className="h-40 flex items-center justify-center mb-4 bg-cyber-darker rounded-lg border border-neon-cyan/10">
              <span className="text-4xl text-gray-600">?</span>
            </div>
            <h3 className="text-xl font-bold text-gray-500 mb-2">COMING SOON</h3>
            <p className="text-gray-600 text-sm terminal-text">
              // 새로운 게임이 곧 추가됩니다
            </p>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm terminal-text">
            // 로그인한 사용자만 게임을 플레이할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  return (
    <Link href={game.path}>
      <div className="cyber-card rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-neon-cyan group">
        {/* 게임 썸네일/아이콘 */}
        <div className="h-40 flex items-center justify-center mb-4 bg-cyber-darker rounded-lg border border-neon-cyan/20 group-hover:border-neon-cyan/50 transition-colors overflow-hidden">
          {game.id === 'omok' ? (
            <OmokThumbnail />
          ) : (
            <span className="text-4xl text-neon-cyan">{game.name[0]}</span>
          )}
        </div>

        {/* 게임 정보 */}
        <h3 className="text-xl font-bold text-neon-cyan group-hover:text-glow-cyan transition-all mb-2">
          {game.name.toUpperCase()}
        </h3>
        <p className="text-gray-400 text-sm terminal-text leading-relaxed">
          {game.description}
        </p>

        {/* 플레이 버튼 */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-neon-green uppercase tracking-wider">
            READY
          </span>
          <div className="flex items-center text-neon-cyan group-hover:text-neon-cyan-bright transition-colors">
            <span className="text-sm mr-2">PLAY</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 오목 썸네일 컴포넌트
function OmokThumbnail() {
  return (
    <div className="relative w-24 h-24">
      {/* 간단한 바둑판 미리보기 */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* 격자 */}
        {[0, 25, 50, 75, 100].map((pos) => (
          <g key={pos}>
            <line
              x1={pos}
              y1="0"
              x2={pos}
              y2="100"
              stroke="rgba(0, 217, 255, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1={pos}
              x2="100"
              y2={pos}
              stroke="rgba(0, 217, 255, 0.3)"
              strokeWidth="1"
            />
          </g>
        ))}
        {/* 샘플 돌 */}
        <circle cx="50" cy="50" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
        <circle cx="25" cy="50" r="8" fill="#f0f0f0" stroke="#ccc" strokeWidth="1" />
        <circle cx="50" cy="25" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
        <circle cx="75" cy="50" r="8" fill="#f0f0f0" stroke="#ccc" strokeWidth="1" />
        <circle cx="50" cy="75" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      </svg>
    </div>
  );
}
