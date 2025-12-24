import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { StudySession } from '../../modules/gamification/model';

interface WeeklyActivityChartProps {
    data: StudySession[];
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data }) => {
    // Transform data for chart
    const chartData = data.map((session) => {
        const date = new Date(session.date);
        const dayName = DAYS[date.getDay()];
        const isToday = session.date === new Date().toISOString().split('T')[0];

        return {
            name: dayName,
            date: session.date,
            cards: session.cardsReviewed,
            correct: session.correctCount,
            wrong: session.wrongCount,
            isToday,
            color: isToday ? '#a855f7' : '#6366f1',
        };
    });

    const maxCards = Math.max(...chartData.map(d => d.cards), 1);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const accuracy = (data.correct + data.wrong) > 0
                ? Math.round((data.correct / (data.correct + data.wrong)) * 100)
                : 0;

            return (
                <div className="bg-[#1a1a24] border border-white/20 rounded-lg p-3 shadow-xl">
                    <p className="text-gray-400 text-xs mb-1">
                        {new Date(data.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'short'
                        })}
                    </p>
                    <p className="text-white font-bold text-lg">{data.cards} kartu</p>
                    {data.cards > 0 && (
                        <p className="text-xs text-gray-400">
                            ✓ {data.correct} benar · ✗ {data.wrong} salah ({accuracy}%)
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const hasActivity = chartData.some(d => d.cards > 0);

    if (!hasActivity) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <p className="text-sm">Belum ada aktivitas minggu ini</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#666"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        axisLine={{ stroke: '#333' }}
                    />
                    <YAxis
                        stroke="#666"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        allowDecimals={false}
                        domain={[0, Math.max(maxCards + 2, 10)]}
                        axisLine={{ stroke: '#333' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="cards" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                opacity={entry.cards > 0 ? 1 : 0.3}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
