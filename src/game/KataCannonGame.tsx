
import React, { useState, useRef, useEffect } from 'react';
import { GameCanvas } from './ui/GameCanvas';
import { Hud } from './ui/Hud';
import { Controls } from './ui/Controls';
import { GameEngine } from './core/engine';
import { RoundManager } from './logic/roundManager';
import { GameState, GameStats, TargetEntity } from './core/types';
import { SAMPLE_CARDS } from './data/sampleCards';

export const KataCannonGame: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [prompt, setPrompt] = useState<string>('');
  const [promptMode, setPromptMode] = useState<'meaning' | 'romaji'>('meaning');
  
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    wrongCount: 0,
    lives: 3,
    level: 1,
    round: 0
  });

  // Refs
  const engineRef = useRef<GameEngine | null>(null);
  const roundManagerRef = useRef<RoundManager>(new RoundManager(SAMPLE_CARDS));
  
  // Sound Effects (Mocked)
  const playSound = (type: 'shoot' | 'hit' | 'wrong') => {
    // const audio = new Audio(`/sfx/${type}.mp3`);
    // audio.play().catch(() => {});
    // console.log(`Playing sound: ${type}`);
  };

  const startGame = () => {
    setStats({
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      lives: 3,
      level: 1,
      round: 0
    });
    setGameState('PLAYING');
    if (engineRef.current) engineRef.current.start();
    nextRound();
  };

  const nextRound = () => {
    if (!engineRef.current) return;

    const rm = roundManagerRef.current;
    // Increase difficulty every 3 rounds
    const currentLevel = Math.floor(stats.round / 3) + 1;
    
    const roundData = rm.generateRound(currentLevel);
    
    // Update UI state
    setPrompt(roundData.promptText);
    setPromptMode(roundData.promptMode);
    setStats(prev => ({ ...prev, round: prev.round + 1, level: currentLevel }));

    // Update Engine
    const targets = rm.createTargetsFromRound(roundData, engineRef.current.canvas.width, engineRef.current.canvas.height);
    engineRef.current.setTargets(targets);
  };

  const handleTargetHit = (target: TargetEntity) => {
    playSound('hit');
    
    setStats(prev => {
      const newStreak = prev.streak + 1;
      return {
        ...prev,
        score: prev.score + (100 * newStreak), // Combo multiplier
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        correctCount: prev.correctCount + 1
      };
    });

    // Delay slightly before next round for animation
    setTimeout(() => {
       nextRound();
    }, 1000);
  };

  const handleWrongTarget = (target: TargetEntity) => {
    playSound('wrong');
    
    setStats(prev => {
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        endGame();
      }
      return {
        ...prev,
        streak: 0,
        lives: newLives,
        wrongCount: prev.wrongCount + 1
      };
    });
  };

  const endGame = () => {
    setGameState('GAME_OVER');
    if (engineRef.current) engineRef.current.stop();
  };

  return (
    <div className="w-full h-[600px] md:h-[700px] relative rounded-3xl overflow-hidden border border-white/10 bg-[#0f0f16] shadow-2xl">
      <GameCanvas 
        onEngineReady={(engine) => engineRef.current = engine}
        onTargetHit={handleTargetHit}
        onWrongTarget={handleWrongTarget}
      />
      
      <Hud 
        stats={stats} 
        prompt={prompt} 
        promptMode={promptMode} 
      />
      
      <Controls 
        gameState={gameState}
        stats={stats}
        onStart={startGame}
        onRestart={startGame}
      />
    </div>
  );
};
