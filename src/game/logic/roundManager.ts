
import { Card, TargetEntity } from '../core/types';

export interface RoundData {
  correctCard: Card;
  distractors: Card[];
  promptMode: 'meaning' | 'romaji';
  promptText: string;
  targetCount: number;
}

export class RoundManager {
  private cards: Card[];
  private currentLevel: number = 1;

  constructor(cards: Card[]) {
    this.cards = cards;
  }

  /**
   * Generates a new round configuration.
   * Prioritizes cards with lower SRS levels.
   */
  generateRound(level: number): RoundData {
    this.currentLevel = level;

    // 1. Filter eligible cards (simple logic: just shuffle all for now, 
    // but ideally weight by srsLevel ascending)
    const weightedDeck = [...this.cards].sort((a, b) => a.srsLevel - b.srsLevel + (Math.random() - 0.5));
    
    // 2. Pick Correct Card
    const correctCard = weightedDeck[0];

    // 3. Pick Distractors (must not be the correct card)
    const otherCards = weightedDeck.slice(1).sort(() => Math.random() - 0.5);
    
    // Difficulty scaling: Level 1 = 3 targets total, Level 5+ = 5 targets, etc.
    const totalTargets = Math.min(6, 3 + Math.floor(level / 3));
    const distractorCount = totalTargets - 1;
    const distractors = otherCards.slice(0, distractorCount);

    // 4. Determine Prompt Mode (random mix)
    const modeRoll = Math.random();
    const promptMode: 'meaning' | 'romaji' = modeRoll > 0.5 ? 'meaning' : 'romaji';
    
    let promptText = '';
    if (promptMode === 'meaning') {
      promptText = correctCard.meaning;
    } else {
      promptText = correctCard.romaji;
    }

    return {
      correctCard,
      distractors,
      promptMode,
      promptText,
      targetCount: totalTargets
    };
  }

  createTargetsFromRound(round: RoundData, canvasWidth: number, canvasHeight: number): TargetEntity[] {
    const targets: TargetEntity[] = [];
    const allCards = [round.correctCard, ...round.distractors].sort(() => Math.random() - 0.5);

    const padding = 60;
    const spawnAreaW = canvasWidth - padding * 2;
    
    // Speed scales with level
    const baseSpeed = 1 + (this.currentLevel * 0.2);

    allCards.forEach((card, index) => {
      const isCorrect = card.id === round.correctCard.id;
      
      targets.push({
        id: `t-${Date.now()}-${index}`,
        card,
        x: padding + Math.random() * spawnAreaW,
        y: Math.random() * (canvasHeight * 0.4) + 50, // Spawn in top 40%
        radius: 40, // base radius
        vx: (Math.random() - 0.5) * baseSpeed,
        vy: (Math.random() * 0.5 + 0.2) * baseSpeed * 0.5, // Slow vertical drift
        isAlive: true,
        isCorrect,
        state: 'normal',
        scale: 0, // Animate in
      });
    });

    return targets;
  }
}
