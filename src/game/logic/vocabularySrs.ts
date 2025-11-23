
import { Card } from '../core/types';

export interface SrsResult {
  updatedCard: Card;
  nextIntervalDays: number; // mocked
  grade: number;
}

/**
 * Updates the SRS level of a card based on game performance.
 * In this mini-game context, we focus on 'srsLevel' integer adjustments.
 * 
 * @param card The card being reviewed
 * @param isCorrect Whether the user shot the correct target
 * @returns Updated Card and metadata
 */
export function updateSrsForAnswer(card: Card, isCorrect: boolean): SrsResult {
  const newCard = { ...card };
  let grade = 0;

  if (isCorrect) {
    // Correct answer promotes the card
    newCard.srsLevel = (newCard.srsLevel || 0) + 1;
    grade = 4; // "Easy/Good" equivalent
  } else {
    // Wrong answer resets or demotes
    newCard.srsLevel = Math.max(0, (newCard.srsLevel || 0) - 1);
    grade = 1; // "Again" equivalent
  }

  // Mock interval calculation based on level (fibonacci-ish)
  const nextIntervalDays = Math.min(30, Math.pow(2, newCard.srsLevel));

  return {
    updatedCard: newCard,
    nextIntervalDays,
    grade
  };
}
