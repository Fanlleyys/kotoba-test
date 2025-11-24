export interface Card {
  id: string;
  word: string;
  romaji: string;
  meaning: string;
  srsLevel: number;

  // Optional, dipakai di sampleCards.ts
  jlptLevel?: string;
}

export interface TargetEntity {
  id: string;

  // Tambahan: referensi ke kartu sumber
  card: Card;

  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isCorrect: boolean;
  isAlive: boolean;
  scale: number;
  state: 'normal' | 'wrong';
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isActive: boolean;
  color: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface CannonState {
  x: number;
  y: number;
  angle: number;
  targetAngle: number;
  recoil: number;
}

export interface GameConfig {
  baseTargetSpeed: number;
  maxTargetsPerRound: number;
  roundDurationMs: number;
  projectileSpeed: number;
  canvasWidth: number;
  canvasHeight: number;
  spawnPadding: number;
}

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

export interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  wrongCount: number;
  lives: number;
  level: number;
  round: number;
}
