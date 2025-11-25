import { Card, Deck, DeckExport } from './model';
import { getInitialReviewMeta } from '../../services/sm2';
import { storage } from '../../services/storage';

const CARD_STORAGE_KEY = 'katasensei_cards_v1';
const DECK_STORAGE_KEY = 'katasensei_decks_v1';

const SEED_DECKS: Deck[] = [
  {
    id: 'deck-makanan',
    name: 'Makanan',
    description: 'Kosakata tentang makanan dan minuman',
    tags: ['vocab', 'makanan'],
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'deck-minuman',
    name: 'Minuman',
    description: 'Jenis-jenis minuman dalam bahasa Jepang',
    tags: ['vocab', 'minuman'],
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'deck-basics',
    name: 'Greetings & Basics',
    description: 'Essential phrases for daily conversation',
    tags: ['basics', 'sapaan'],
    createdAt: new Date('2025-01-02').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SEED_CARDS: Card[] = [
  {
    id: 'm1',
    deckId: 'deck-makanan',
    romaji: 'tamago',
    japanese: '卵',
    indonesia: 'Telur',
    example: '卵を割る。',
    tags: ['makanan'],
    createdAt: new Date().toISOString(),
    reviewMeta: getInitialReviewMeta(),
  },
  {
    id: 'm2',
    deckId: 'deck-makanan',
    romaji: 'sushi',
    japanese: '寿司',
    indonesia: 'Sushi',
    example: '寿司は美味しい。',
    tags: ['makanan'],
    createdAt: new Date().toISOString(),
    reviewMeta: getInitialReviewMeta(),
  },
  {
    id: 'm3',
    deckId: 'deck-makanan',
    romaji: 'tempura',
    japanese: '天ぷら',
    indonesia: 'Tempura',
    example: '天ぷらを食べる。',
    tags: ['makanan'],
    createdAt: new Date().toISOString(),
    reviewMeta: getInitialReviewMeta(),
  },
  {
    id: 'd1',
    deckId: 'deck-minuman',
    romaji: 'juusu',
    japanese: 'ジュース',
    indonesia: 'Jus',
    example: 'ジュースを飲む。',
    tags: ['minuman'],
    createdAt: new Date().toISOString(),
    reviewMeta: getInitialReviewMeta(),
  },
  {
    id: 'd2',
    deckId: 'deck-minuman',
    romaji: 'ocha',
    japanese: 'お茶',
    indonesia: 'Teh',
    example: 'お茶を飲む。',
    tags: ['minuman'],
    createdAt: new Date().toISOString(),
    reviewMeta: getInitialReviewMeta(),
  },
  {
    id: 'k1',
    deckId: 'deck-basics',
    romaji: 'konnichiwa',
    japanese: 'こんにちは',
    indonesia: 'Selamat siang / Halo',
    example: 'こんにちは、元気ですか？',
    tags: ['sapaan', 'dasar'],
    createdAt: new Date().toISOString(),
    reviewMeta: getInitialReviewMeta(),
  },
  {
    id: 'k2',
    deckId: 'deck-basics',
    romaji: 'arigatou',
    japanese: 'ありがとう',
    indonesia: 'Terima kasih',
    example: '手伝ってくれてありがとう。',
    tags: ['politeness'],
    createdAt: new Date().toISOString(),
    reviewMeta: getInitialReviewMeta(),
  },
];

// --- Decks Operations ---

export const getDecks = (): Deck[] => {
  const decks = storage.get<Deck[] | null>(DECK_STORAGE_KEY, null);

  if (!decks) {
    // Init seed decks
    saveDecks(SEED_DECKS);

    // Sekalian seed cards kalau belum ada
    const cards = storage.get<Card[] | null>(CARD_STORAGE_KEY, null);
    if (!cards) saveCards(SEED_CARDS);

    return SEED_DECKS;
  }

  return decks;
};

export const saveDecks = (decks: Deck[]) => {
  storage.set(DECK_STORAGE_KEY, decks);
};

export const createDeck = (name: string, description: string, tags: string[]): Deck => {
  const decks = getDecks();
  const newDeck: Deck = {
    id: 'deck-' + Date.now(),
    name,
    description,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveDecks([...decks, newDeck]);
  return newDeck;
};

export const updateDeck = (id: string, updates: Partial<Deck>) => {
  const decks = getDecks();
  const index = decks.findIndex((d) => d.id === id);
  if (index !== -1) {
    decks[index] = {
      ...decks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDecks(decks);
  }
};

export const deleteDeck = (id: string) => {
  const decks = getDecks();
  saveDecks(decks.filter((d) => d.id !== id));

  // Hapus semua card yang belong ke deck ini
  const cards = getCards();
  saveCards(cards.filter((c) => c.deckId !== id));
};

export const restoreDeck = (deck: Deck, cards: Card[]) => {
  const decks = getDecks();
  saveDecks([...decks, deck]);
  addCards(cards);
};

// --- Card Operations ---

export const getCards = (deckId?: string): Card[] => {
  const allCards = storage.get<Card[]>(CARD_STORAGE_KEY, []);

  if (deckId) {
    return allCards.filter((c) => c.deckId === deckId);
  }
  return allCards;
};

export const saveCards = (cards: Card[]) => {
  storage.set(CARD_STORAGE_KEY, cards);
};

export const addCards = (newCards: Card[]) => {
  const current = getCards();
  const currentIds = new Set(current.map((c) => c.id));

  // Dedup by id biar kalau import ulang / AI generate ga dobel
  const filteredNew = newCards.filter((c) => !currentIds.has(c.id));

  saveCards([...current, ...filteredNew]);
};

export const updateCard = (updatedCard: Card) => {
  const current = getCards();
  const index = current.findIndex((c) => c.id === updatedCard.id);
  if (index !== -1) {
    current[index] = updatedCard;
    saveCards(current);
  }
};

export const deleteCard = (cardId: string) => {
  const current = getCards();
  const filtered = current.filter((c) => c.id !== cardId);
  saveCards(filtered);
};

export const exportDeckToJSON = (deckId: string): string => {
  const decks = getDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return '';

  const cards = getCards(deckId);

  const exportData: DeckExport = {
    id: deck.id,
    title: deck.name,
    description: deck.description || '',
    tags: deck.tags || [],
    cards,
  };

  return JSON.stringify(exportData, null, 2);
};

// --- NEW: SYSTEM WIDE BACKUP & RESTORE ---

export interface BackupPayload {
  version: number;
  exportedAt: string;
  decks: Deck[];
  cards: Card[];
}

/**
 * Export semua deck + cards ke JSON string.
 */
export const exportAllDataToJSON = (): string => {
  const decks = getDecks();
  const cards = getCards();

  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    decks,
    cards,
  };

  return JSON.stringify(payload, null, 2);
};

/**
 * Import full backup: replace semua deck + cards yang ada.
 */
export const importAllDataFromJSON = (json: string): boolean => {
  try {
    const parsed = JSON.parse(json) as BackupPayload;

    if (
      !parsed ||
      !Array.isArray(parsed.decks) ||
      !Array.isArray(parsed.cards)
    ) {
      console.error('Invalid backup format: missing decks or cards array');
      return false;
    }

    saveDecks(parsed.decks);
    saveCards(parsed.cards);

    return true;
  } catch (err) {
    console.error('Failed to import backup', err);
    return false;
  }
};
