// Study session record for daily tracking
export interface StudySession {
    date: string;           // YYYY-MM-DD
    cardsReviewed: number;  // Total cards reviewed that day
    correctCount: number;   // Correct answers
    wrongCount: number;     // Wrong answers
    studyTimeMs: number;    // Time spent studying (ms)
}

export interface UserStats {
    streak: number;
    lastStudyDate: string | null; // ISO Date YYYY-MM-DD
    maxStreak: number;
    level: number;
    currentXp: number;
    nextLevelXp: number;
    // New stats for analytics
    totalStudyTimeMs: number;      // Total study time across all sessions
    totalCardsReviewed: number;    // Total cards ever reviewed
    totalCorrect: number;          // Total correct answers
    totalWrong: number;            // Total wrong answers
    studyHistory: StudySession[];  // Daily history (last 30 days)
}

export const INITIAL_STATS: UserStats = {
    streak: 0,
    lastStudyDate: null,
    maxStreak: 0,
    level: 1,
    currentXp: 0,
    nextLevelXp: 100,
    // New defaults
    totalStudyTimeMs: 0,
    totalCardsReviewed: 0,
    totalCorrect: 0,
    totalWrong: 0,
    studyHistory: [],
};
