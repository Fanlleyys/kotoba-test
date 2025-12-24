// Task data model for scheduled reviews

export interface ReviewTask {
    id: string;
    cardIds: string[];          // Card IDs to review
    deckId?: string;            // Source deck (optional)
    scheduledTime: string;      // ISO Date string - when to review
    createdAt: string;          // When the task was created
    title: string;              // Display title, e.g. "Review 7 kata"
    completed: boolean;         // Whether the task has been completed
}

// Preset schedule options
export type SchedulePreset = '3h' | '6h' | 'tomorrow_morning' | 'tomorrow_evening' | 'custom';

export interface ScheduleOption {
    id: SchedulePreset;
    label: string;
    sublabel: string;
    getTime: () => Date;
}

export const SCHEDULE_PRESETS: ScheduleOption[] = [
    {
        id: '3h',
        label: '3 Jam',
        sublabel: 'Lagi',
        getTime: () => {
            const d = new Date();
            d.setHours(d.getHours() + 3);
            return d;
        }
    },
    {
        id: '6h',
        label: '6 Jam',
        sublabel: 'Lagi',
        getTime: () => {
            const d = new Date();
            d.setHours(d.getHours() + 6);
            return d;
        }
    },
    {
        id: 'tomorrow_morning',
        label: 'Besok',
        sublabel: 'Pagi (09:00)',
        getTime: () => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(9, 0, 0, 0);
            return d;
        }
    },
    {
        id: 'tomorrow_evening',
        label: 'Besok',
        sublabel: 'Malam (20:00)',
        getTime: () => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(20, 0, 0, 0);
            return d;
        }
    }
];
