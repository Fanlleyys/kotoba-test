import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, Play, Trash2, AlertCircle,
    CheckCircle2, ChevronRight, RefreshCw
} from 'lucide-react';
import { ReviewTask } from '../modules/tasks/model';
import { getTasksGrouped, deleteTask, completeTask } from '../modules/tasks/api';

export const Tasks: React.FC = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<{
        overdue: ReviewTask[];
        today: ReviewTask[];
        upcoming: ReviewTask[];
        completed: ReviewTask[];
    }>({ overdue: [], today: [], upcoming: [], completed: [] });
    const [showCompleted, setShowCompleted] = useState(false);

    const refreshTasks = () => {
        setTasks(getTasksGrouped());
    };

    useEffect(() => {
        refreshTasks();
        // Refresh every minute
        const interval = setInterval(refreshTasks, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleStartTask = (task: ReviewTask) => {
        // Navigate to study with the task's cards
        const params = new URLSearchParams();
        params.set('ids', task.cardIds.join(','));
        if (task.deckId) {
            params.set('deckId', task.deckId);
        }
        // Mark task as completed
        completeTask(task.id);
        navigate(`/study?${params.toString()}`);
    };

    const handleDeleteTask = (taskId: string) => {
        deleteTask(taskId);
        refreshTasks();
    };

    const formatTime = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === now.toDateString()) {
            return 'Hari ini';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Besok';
        } else {
            return date.toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
        }
    };

    const getRelativeTime = (isoString: string): string => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);

        if (diffMs < 0) {
            const absMins = Math.abs(diffMins);
            if (absMins < 60) return `${absMins} menit yang lalu`;
            const absHours = Math.abs(diffHours);
            if (absHours < 24) return `${absHours} jam yang lalu`;
            return formatDate(isoString);
        }

        if (diffMins < 60) return `${diffMins} menit lagi`;
        if (diffHours < 24) return `${diffHours} jam lagi`;
        return formatDate(isoString);
    };

    const totalPending = tasks.overdue.length + tasks.today.length + tasks.upcoming.length;

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Review Tasks</h1>
                    <p className="text-gray-400">
                        {totalPending > 0
                            ? `${totalPending} task menunggu`
                            : 'Tidak ada task yang dijadwalkan'}
                    </p>
                </div>
                <button
                    onClick={refreshTasks}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Empty State */}
            {totalPending === 0 && tasks.completed.length === 0 && (
                <div className="glass-panel rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Belum Ada Task</h2>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Jadwalkan review setelah menyelesaikan study session untuk mengingatkanmu kapan harus review lagi.
                    </p>
                    <Link
                        to="/study"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-violet-600 transition-all"
                    >
                        <Play size={18} fill="currentColor" />
                        Mulai Belajar
                    </Link>
                </div>
            )}

            {/* Overdue Tasks */}
            {tasks.overdue.length > 0 && (
                <TaskSection
                    title="Terlambat"
                    icon={<AlertCircle className="text-red-400" size={20} />}
                    tasks={tasks.overdue}
                    variant="overdue"
                    onStart={handleStartTask}
                    onDelete={handleDeleteTask}
                    formatTime={formatTime}
                    getRelativeTime={getRelativeTime}
                />
            )}

            {/* Today's Tasks */}
            {tasks.today.length > 0 && (
                <TaskSection
                    title="Hari Ini"
                    icon={<Clock className="text-yellow-400" size={20} />}
                    tasks={tasks.today}
                    variant="today"
                    onStart={handleStartTask}
                    onDelete={handleDeleteTask}
                    formatTime={formatTime}
                    getRelativeTime={getRelativeTime}
                />
            )}

            {/* Upcoming Tasks */}
            {tasks.upcoming.length > 0 && (
                <TaskSection
                    title="Mendatang"
                    icon={<Calendar className="text-blue-400" size={20} />}
                    tasks={tasks.upcoming}
                    variant="upcoming"
                    onStart={handleStartTask}
                    onDelete={handleDeleteTask}
                    formatTime={formatTime}
                    getRelativeTime={getRelativeTime}
                    formatDate={formatDate}
                />
            )}

            {/* Completed Tasks */}
            {tasks.completed.length > 0 && (
                <div className="glass-panel rounded-3xl overflow-hidden">
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <span className="font-bold text-white">Selesai</span>
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-400">
                                {tasks.completed.length}
                            </span>
                        </div>
                        <ChevronRight
                            className={`text-gray-400 transition-transform ${showCompleted ? 'rotate-90' : ''}`}
                            size={20}
                        />
                    </button>
                    {showCompleted && (
                        <div className="border-t border-white/10 p-5 space-y-3">
                            {tasks.completed.slice(0, 5).map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl opacity-60"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-green-400" size={18} />
                                        <span className="text-gray-300 line-through">{task.title}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Task Section Component
interface TaskSectionProps {
    title: string;
    icon: React.ReactNode;
    tasks: ReviewTask[];
    variant: 'overdue' | 'today' | 'upcoming';
    onStart: (task: ReviewTask) => void;
    onDelete: (taskId: string) => void;
    formatTime: (iso: string) => string;
    getRelativeTime: (iso: string) => string;
    formatDate?: (iso: string) => string;
}

const TaskSection: React.FC<TaskSectionProps> = ({
    title,
    icon,
    tasks,
    variant,
    onStart,
    onDelete,
    formatTime,
    getRelativeTime,
    formatDate
}) => {
    const variantStyles = {
        overdue: 'border-red-500/20 bg-red-500/5',
        today: 'border-yellow-500/20 bg-yellow-500/5',
        upcoming: 'border-blue-500/20 bg-blue-500/5',
    };

    const buttonStyles = {
        overdue: 'bg-red-500 hover:bg-red-600',
        today: 'bg-primary hover:bg-violet-600',
        upcoming: 'bg-blue-500 hover:bg-blue-600',
    };

    return (
        <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
                {icon}
                <span className="font-bold text-white">{title}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-400">
                    {tasks.length}
                </span>
            </div>
            <div className="p-5 space-y-3">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={`p-4 rounded-2xl border ${variantStyles[variant]} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">{task.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Clock size={14} />
                                <span>
                                    {variant === 'upcoming' && formatDate
                                        ? `${formatDate(task.scheduledTime)} ${formatTime(task.scheduledTime)}`
                                        : `${formatTime(task.scheduledTime)} (${getRelativeTime(task.scheduledTime)})`
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onStart(task)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold transition-all ${buttonStyles[variant]}`}
                            >
                                <Play size={16} fill="currentColor" />
                                Mulai
                            </button>
                            <button
                                onClick={() => onDelete(task.id)}
                                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
