import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Deck, Card } from '../modules/decks/model';
import { UserStats, INITIAL_STATS } from '../modules/gamification/model';
import { getDecks, getCards, saveDecks, saveCards } from '../modules/decks/api';
import { getUserStats, saveUserStats } from '../modules/gamification/streak';

export interface CloudData {
    decks: Deck[];
    cards: Card[];
    stats: UserStats;
    lastSyncedAt: string;
}

/**
 * Save all data to Firestore for the current user
 */
export const saveToCloud = async (userId: string): Promise<void> => {
    const decks = getDecks();
    const cards = getCards();
    const stats = getUserStats();

    const userDocRef = doc(db, 'users', userId, 'data', 'main');

    await setDoc(userDocRef, {
        decks,
        cards,
        stats,
        lastSyncedAt: serverTimestamp(),
        updatedAt: new Date().toISOString(),
    });

    console.log('✅ Data saved to cloud');
};

/**
 * Load data from Firestore and merge with local data
 */
export const loadFromCloud = async (userId: string): Promise<CloudData | null> => {
    const userDocRef = doc(db, 'users', userId, 'data', 'main');
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        const data = docSnap.data() as CloudData;
        console.log('✅ Data loaded from cloud');
        return data;
    }

    console.log('ℹ️ No cloud data found');
    return null;
};

/**
 * Sync data: Load from cloud and merge, or save to cloud if no cloud data
 */
export const syncData = async (userId: string): Promise<'downloaded' | 'uploaded' | 'merged'> => {
    const cloudData = await loadFromCloud(userId);

    if (!cloudData) {
        // No cloud data, upload local data
        await saveToCloud(userId);
        return 'uploaded';
    }

    // Get local data for comparison
    const localCards = getCards();
    const localStats = getUserStats();

    // Simple merge strategy: Use data with more content or more recent stats
    const localCardCount = localCards.length;
    const cloudCardCount = cloudData.cards?.length || 0;

    if (cloudCardCount >= localCardCount) {
        // Cloud has more or equal data, use cloud data
        if (cloudData.decks) saveDecks(cloudData.decks);
        if (cloudData.cards) saveCards(cloudData.cards);
        if (cloudData.stats) {
            // Merge stats - keep higher values
            const mergedStats: UserStats = {
                ...INITIAL_STATS,
                ...cloudData.stats,
                streak: Math.max(localStats.streak, cloudData.stats.streak || 0),
                maxStreak: Math.max(localStats.maxStreak, cloudData.stats.maxStreak || 0),
                level: Math.max(localStats.level, cloudData.stats.level || 1),
                currentXp: localStats.level > (cloudData.stats.level || 1)
                    ? localStats.currentXp
                    : (cloudData.stats.currentXp || 0),
                totalCardsReviewed: Math.max(
                    localStats.totalCardsReviewed || 0,
                    cloudData.stats.totalCardsReviewed || 0
                ),
            };
            saveUserStats(mergedStats);
        }
        return 'downloaded';
    } else {
        // Local has more data, upload to cloud
        await saveToCloud(userId);
        return 'uploaded';
    }
};

/**
 * Get last sync time for a user
 */
export const getLastSyncTime = async (userId: string): Promise<Date | null> => {
    const cloudData = await loadFromCloud(userId);
    if (cloudData?.lastSyncedAt) {
        return new Date(cloudData.lastSyncedAt);
    }
    return null;
};
