import { storage } from '../../services/storage';
import { UserStats, INITIAL_STATS } from './model';

const STATS_KEY = 'katasensei_user_stats_v1';

export const getUserStats = (): UserStats => {
    return storage.get<UserStats>(STATS_KEY, INITIAL_STATS);
};

export const saveUserStats = (stats: UserStats) => {
    storage.set(STATS_KEY, stats);
};

/**
 * Updates the streak based on the current date.
 * Should be called when the user performs a learning action.
 * Returns the updated stats.
 */
export const updateStreak = (): UserStats => {
    const stats = getUserStats();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastDate = stats.lastStudyDate ? stats.lastStudyDate.split('T')[0] : null;

    // If already studied today, do nothing
    if (lastDate === today) {
        return stats;
    }

    let newStreak = stats.streak;

    if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDate === yesterdayStr) {
            // Continued streak
            newStreak += 1;
        } else {
            // Streak broken
            newStreak = 1;
        }
    } else {
        // First time ever
        newStreak = 1;
    }

    const newStats: UserStats = {
        ...stats,
        streak: newStreak,
        maxStreak: Math.max(stats.maxStreak, newStreak),
        lastStudyDate: new Date().toISOString(),
    };

    saveUserStats(newStats);
    return newStats;
};

// --- XP Logic ---
export const addXp = (amount: number) => {
    const stats = getUserStats();
    let { level, currentXp, nextLevelXp } = stats;

    currentXp += amount;

    // Check Level Up
    let levelUp = false;
    while (currentXp >= (nextLevelXp || 100)) {
        currentXp -= (nextLevelXp || 100);
        level += 1;
        levelUp = true;
        // Difficulty scaling: 100, 120, 144... (+20%)
        nextLevelXp = Math.floor((nextLevelXp || 100) * 1.2);
    }

    const updated: UserStats = {
        ...stats,
        level,
        currentXp,
        nextLevelXp: nextLevelXp || 100,
    };

    saveUserStats(updated);
    return { levelUp, newLevel: level, addedXp: amount };
};
