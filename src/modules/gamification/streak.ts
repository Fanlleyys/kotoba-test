import { storage } from '../../services/storage';
import { UserStats, StudySession, INITIAL_STATS } from './model';

const STATS_KEY = 'katasensei_user_stats_v1';

/**
 * Get user stats with migration for old data
 * Ensures all new fields have default values
 */
export const getUserStats = (): UserStats => {
    const stored = storage.get<Partial<UserStats> | null>(STATS_KEY, null);

    // Merge stored data with initial stats to ensure all fields exist
    // This handles migration from old data format
    const stats: UserStats = {
        ...INITIAL_STATS,
        ...(stored || {}),
        // Ensure arrays are never undefined
        studyHistory: stored?.studyHistory ?? [],
    };

    return stats;
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

// --- Analytics Tracking ---

const getTodayKey = (): string => new Date().toISOString().split('T')[0];

const getOrCreateTodaySession = (stats: UserStats): StudySession => {
    const today = getTodayKey();
    const existing = stats.studyHistory.find(s => s.date === today);
    if (existing) return existing;
    return {
        date: today,
        cardsReviewed: 0,
        correctCount: 0,
        wrongCount: 0,
        studyTimeMs: 0,
    };
};

const updateTodaySession = (stats: UserStats, session: StudySession): StudySession[] => {
    const history = stats.studyHistory.filter(s => s.date !== session.date);
    history.push(session);
    // Keep only last 30 days
    history.sort((a, b) => b.date.localeCompare(a.date));
    return history.slice(0, 30);
};

/**
 * Record a card answer (correct or wrong)
 */
export const recordAnswer = (isCorrect: boolean): void => {
    const stats = getUserStats();
    const session = getOrCreateTodaySession(stats);

    session.cardsReviewed += 1;
    if (isCorrect) {
        session.correctCount += 1;
    } else {
        session.wrongCount += 1;
    }

    const updated: UserStats = {
        ...stats,
        totalCardsReviewed: stats.totalCardsReviewed + 1,
        totalCorrect: stats.totalCorrect + (isCorrect ? 1 : 0),
        totalWrong: stats.totalWrong + (isCorrect ? 0 : 1),
        studyHistory: updateTodaySession(stats, session),
    };

    saveUserStats(updated);
};

/**
 * Record study time for today's session
 */
export const recordStudyTime = (durationMs: number): void => {
    const stats = getUserStats();
    const session = getOrCreateTodaySession(stats);

    session.studyTimeMs += durationMs;

    const updated: UserStats = {
        ...stats,
        totalStudyTimeMs: stats.totalStudyTimeMs + durationMs,
        studyHistory: updateTodaySession(stats, session),
    };

    saveUserStats(updated);
};

/**
 * Get study data for the last 7 days (for weekly chart)
 */
export const getWeeklyStudyData = (): StudySession[] => {
    const stats = getUserStats();
    const result: StudySession[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        const existing = stats.studyHistory.find(s => s.date === dateKey);
        result.push(existing || {
            date: dateKey,
            cardsReviewed: 0,
            correctCount: 0,
            wrongCount: 0,
            studyTimeMs: 0,
        });
    }

    return result;
};

/**
 * Get overall accuracy percentage
 */
export const getAccuracyRate = (): number => {
    const stats = getUserStats();
    const total = stats.totalCorrect + stats.totalWrong;
    if (total === 0) return 0;
    return Math.round((stats.totalCorrect / total) * 100);
};

/**
 * Format milliseconds to human readable string
 */
export const formatStudyTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};
