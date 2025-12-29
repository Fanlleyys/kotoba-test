import React from 'react';
import { StudySession } from '../../modules/gamification/model';

interface ActivityHeatmapProps {
    data: StudySession[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {

    // 1. Generate last 365 days dates
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        // Shift to end of week (Saturday) to make the grid look nice and aligned to the right
        // or just end exactly today. GitHub ends today.
        // Let's end today.
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const dates = generateDates();

    // 2. Map data to dates
    const getLevel = (date: string) => {
        const session = data.find(s => s.date === date);
        if (!session) return 0;

        // Logic intensity based on cards reviewed
        const cards = session.cardsReviewed;
        if (cards === 0) return 0;
        if (cards <= 5) return 1;
        if (cards <= 20) return 2;
        if (cards <= 50) return 3;
        return 4;
    };

    const getTooltip = (date: string) => {
        const session = data.find(s => s.date === date);
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        if (!session || session.cardsReviewed === 0) return `No study on ${dateStr}`;
        return `${session.cardsReviewed} cards on ${dateStr}`;
    };

    // Theme-aware colors
    // We can use the CSS variables we defined, but need to construct the RGBA or rely on specific classes.
    // Easiest is to use inline styles or specific classes mapping to levels 0-4.
    // But our themes use variable colors. Let's try to leverage opacity of the primary color.

    return (
        <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <div className="min-w-[700px] flex gap-1">
                {/* We need columns (weeks). 365 days is ~52 weeks. */}
                {/* It's easier to verify weeks by index. */}
                {/* Grid is row-first in HTML usually, but we want column-first (Weeks). */}
                {/* So: Outer map = Weeks, Inner map = Days (0-6) */}

                {Array.from({ length: 53 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            // Calculate absolute index
                            const dataIndex = weekIndex * 7 + dayIndex;
                            if (dataIndex >= dates.length) return null;

                            const date = dates[dataIndex];
                            const level = getLevel(date);

                            // Color logic using CSS variables and opacity
                            // Level 0: bg-white/5
                            // Level 1: primary/20
                            // Level 2: primary/40
                            // Level 3: primary/70
                            // Level 4: primary/100

                            let bgClass = "bg-white/5";
                            let style = {};

                            if (level > 0) {
                                const opacity = level === 1 ? 0.3 : level === 2 ? 0.5 : level === 3 ? 0.75 : 1;
                                // We rely on `rgb(var(--color-primary))` syntax if using Tailwind with custom vars,
                                // or just raw style since we don't have utility classes for every opacity of a custom var easily unless configured.
                                // Let's assume --color-primary is defined as space separated numbers "R G B" like in index.css
                                style = { backgroundColor: `rgba(var(--color-primary), ${opacity})` };
                                bgClass = "";
                            }

                            return (
                                <div
                                    key={date}
                                    className={`w-3 h-3 rounded-sm ${bgClass} transition-all hover:scale-125 hover:z-10 relative group`}
                                    style={style}
                                    title={getTooltip(date)} // Native tooltip for simplicity first
                                >
                                    {/* Custom Tooltip via CSS */}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 justify-end">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-white/5"></div>
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(var(--color-primary), 0.3)' }}></div>
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(var(--color-primary), 0.5)' }}></div>
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(var(--color-primary), 0.75)' }}></div>
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(var(--color-primary), 1)' }}></div>
                <span>More</span>
            </div>
        </div>
    );
};
