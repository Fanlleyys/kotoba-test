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
