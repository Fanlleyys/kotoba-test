
import { useState, useEffect, useCallback } from 'react';
import { Deck, Card } from './model';
import { getDecks, getCards, createDeck, updateDeck, deleteDeck, restoreDeck } from './api';

export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshDecks = useCallback(() => {
    const data = getDecks();
    setDecks(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshDecks();
  }, [refreshDecks]);

  return {
    decks,
    isLoading,
    refreshDecks,
    createDeck: (name: string, desc: string, tags: string[]) => {
        const d = createDeck(name, desc, tags);
        refreshDecks();
        return d;
    },
    updateDeck: (id: string, updates: Partial<Deck>) => {
        updateDeck(id, updates);
        refreshDecks();
    },
    deleteDeck: (id: string) => {
        deleteDeck(id);
        refreshDecks();
    },
    restoreDeck: (deck: Deck, cards: Card[]) => {
        restoreDeck(deck, cards);
        refreshDecks();
    }
  };
};

export const useCards = (deckId?: string) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCards = useCallback(() => {
    const data = getCards(deckId);
    setCards(data);
    setIsLoading(false);
  }, [deckId]);

  useEffect(() => {
    refreshCards();
  }, [refreshCards]);

  return {
    cards,
    isLoading,
    refreshCards
  };
};
