import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { StudySession } from '../../modules/gamification/model';

interface AccuracyTrendProps {
    data: StudySession[];
}

export const AccuracyTrend: React.FC<AccuracyTrendProps> = ({ data }) => {
    // Transform data for chart - calculate accuracy per day
    const chartData = data.map((session) => {
        const total = session.correctCount + session.wrongCount;
        const accuracy = total > 0 ? Math.round((session.correctCount / total) * 100) : null;
        const date = new Date(session.date);

        return {
            name: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            date: session.date,
            accuracy,
            correct: session.correctCount,
            wrong: session.wrongCount,
            total,
        };
    });

    // Filter out days with no activity
    const activeData = chartData.filter(d => d.accuracy !== null);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            if (data.accuracy === null) return null;

            return (
                <div className="bg-[#1a1a24] border border-white/20 rounded-lg p-3 shadow-xl">
                    <p className="text-gray-400 text-xs mb-1">
                        {new Date(data.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'short'
                        })}
                    </p>
                    <p className="text-white font-bold text-lg">{data.accuracy}% akurasi</p>
                    <p className="text-xs text-gray-400">
                        {data.correct} benar dari {data.total} kartu
                    </p>
                </div>
            );
        }
        return null;
    };

    if (activeData.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <p className="text-sm">Belum ada data akurasi</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#666"
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={{ stroke: '#333' }}
                    />
                    <YAxis
                        stroke="#666"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        axisLine={{ stroke: '#333' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fill="url(#accuracyGradient)"
                        dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#22c55e' }}
                        connectNulls
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
