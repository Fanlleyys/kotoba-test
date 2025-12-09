export interface UserStats {
    streak: number;
    lastStudyDate: string | null; // ISO Date YYYY-MM-DD
    maxStreak: number;
    level: number;
    currentXp: number;
    nextLevelXp: number;
}

export const INITIAL_STATS: UserStats = {
    streak: 0,
    lastStudyDate: null,
    maxStreak: 0,
    level: 1,
    currentXp: 0,
    nextLevelXp: 100, // Level 1 -> 2 needs 100 XP
};
