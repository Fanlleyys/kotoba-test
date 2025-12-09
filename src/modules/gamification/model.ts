export interface UserStats {
    streak: number;
    lastStudyDate: string | null; // ISO Date YYYY-MM-DD
    maxStreak: number;
    totalXp: number; // Preparing for future XP feature
    level: number;
}

export const INITIAL_STATS: UserStats = {
    streak: 0,
    lastStudyDate: null,
    maxStreak: 0,
    totalXp: 0,
    level: 1,
};
