import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { Card } from '../../modules/decks/model';

interface MasteryChartProps {
    cards: Card[];
}

// SRS Level Categories based on repetitions
const getMasteryLevel = (repetitions: number): string => {
    if (repetitions === 0) return 'New';
    if (repetitions <= 2) return 'Learning';
    if (repetitions <= 5) return 'Young';
    return 'Mature';
};

const COLORS = {
    'New': '#ef4444',      // Red
    'Learning': '#f59e0b', // Amber
    'Young': '#22c55e',    // Green
    'Mature': '#3b82f6',   // Blue
};

export const MasteryChart: React.FC<MasteryChartProps> = ({ cards }) => {
    // Count cards by mastery level
    const masteryData = cards.reduce((acc, card) => {
        const level = getMasteryLevel(card.reviewMeta.repetitions);
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = [
        { name: 'New', value: masteryData['New'] || 0, color: COLORS['New'] },
        { name: 'Learning', value: masteryData['Learning'] || 0, color: COLORS['Learning'] },
        { name: 'Young', value: masteryData['Young'] || 0, color: COLORS['Young'] },
        { name: 'Mature', value: masteryData['Mature'] || 0, color: COLORS['Mature'] },
    ].filter(d => d.value > 0);

    const total = cards.length;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage = total > 0 ? Math.round((data.value / total) * 100) : 0;
            return (
                <div className="bg-[#1a1a24] border border-white/20 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-medium flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                        {data.name}
                    </p>
                    <p className="text-violet-300 text-lg font-bold">{data.value} kartu ({percentage}%)</p>
                </div>
            );
        }
        return null;
    };

    const renderLegend = () => (
        <div className="flex flex-wrap justify-center gap-3 mt-2">
            {data.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-400">{entry.name} ({entry.value})</span>
                </div>
            ))}
        </div>
    );

    if (cards.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <p className="text-sm">Belum ada kartu</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {renderLegend()}
        </div>
    );
};
