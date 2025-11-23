
import React from 'react';
import { GameState, GameStats } from '../core/types';
import { Play, RotateCcw, Trophy, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ControlsProps {
  gameState: GameState;
  stats: GameStats;
  onStart: () => void;
  onRestart: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ gameState, stats, onStart, onRestart }) => {
  if (gameState === 'PLAYING') return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 p-4">
      <div className="bg-[#1a1a24] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
        
        {gameState === 'MENU' && (
          <>
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
              <Play size={40} className="text-primary ml-1" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">KataCannon</h2>
            <p className="text-gray-400 mb-8">Shoot the correct Japanese word!</p>
            <button 
              onClick={onStart}
              className="w-full py-4 bg-primary hover:bg-violet-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
            >
              Start Game
            </button>
          </>
        )}

        {gameState === 'GAME_OVER' && (
          <>
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} className="text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
            <div className="text-5xl font-bold text-primary mb-2 font-mono">{stats.score}</div>
            <p className="text-gray-400 mb-8">Best Streak: {stats.maxStreak}</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={onRestart}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> Play Again
              </button>
              <Link 
                to="/"
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
