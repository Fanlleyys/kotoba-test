import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { SCHEDULE_PRESETS, SchedulePreset } from '../modules/tasks/model';
import { createTask } from '../modules/tasks/api';

interface ScheduleModalProps {
    cardIds: string[];
    deckId?: string;
    cardCount: number;
    onClose: () => void;
    onScheduled?: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
    cardIds,
    deckId,
    cardCount,
    onClose,
    onScheduled
}) => {
    const [selectedPreset, setSelectedPreset] = useState<SchedulePreset | null>(null);
    const [customDate, setCustomDate] = useState('');
    const [customTime, setCustomTime] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePresetClick = (preset: SchedulePreset) => {
        setSelectedPreset(preset);
        setIsCustom(false);
    };

    const handleCustomClick = () => {
        setIsCustom(true);
        setSelectedPreset(null);
        // Set default date/time
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCustomDate(tomorrow.toISOString().split('T')[0]);
        setCustomTime('09:00');
    };

    const getScheduledTime = (): Date | null => {
        if (isCustom && customDate && customTime) {
            return new Date(`${customDate}T${customTime}`);
        }
        if (selectedPreset) {
            const preset = SCHEDULE_PRESETS.find(p => p.id === selectedPreset);
            return preset ? preset.getTime() : null;
        }
        return null;
    };

    const formatScheduledTime = (date: Date): string => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === now.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        if (isToday) {
            return `Hari ini ${timeStr}`;
        } else if (isTomorrow) {
            return `Besok ${timeStr}`;
        } else {
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const handleSave = () => {
        const scheduledTime = getScheduledTime();
        if (!scheduledTime) return;

        setIsSaving(true);

        createTask({
            cardIds,
            deckId,
            scheduledTime: scheduledTime.toISOString(),
            title: `Review ${cardCount} kata`,
        });

        setShowSuccess(true);

        setTimeout(() => {
            setIsSaving(false);
            onScheduled?.();
            onClose();
        }, 1500);
    };

    const scheduledTime = getScheduledTime();
    const canSave = scheduledTime !== null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1a24] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Jadwalkan Review</h2>
                            <p className="text-xs text-gray-400">{cardCount} kartu akan direview</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {showSuccess ? (
                        <div className="flex flex-col items-center py-8 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Terjadwal!</h3>
                            <p className="text-gray-400 text-sm text-center">
                                Kamu akan diingatkan pada<br />
                                <span className="text-white font-medium">{scheduledTime && formatScheduledTime(scheduledTime)}</span>
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Quick Presets */}
                            <div>
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 block">
                                    Pilih Cepat
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SCHEDULE_PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handlePresetClick(preset.id)}
                                            className={`p-4 rounded-2xl border transition-all text-left ${selectedPreset === preset.id
                                                    ? 'bg-primary/20 border-primary/50 text-white'
                                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="font-bold text-lg">{preset.label}</div>
                                            <div className="text-xs opacity-70">{preset.sublabel}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-xs text-gray-500 uppercase font-bold">atau</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Custom Date/Time */}
                            <div>
                                <button
                                    onClick={handleCustomClick}
                                    className={`w-full p-4 rounded-2xl border transition-all text-left ${isCustom
                                            ? 'bg-primary/20 border-primary/50'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="font-bold text-white">Pilih Sendiri</div>
                                            <div className="text-xs text-gray-400">Custom tanggal & waktu</div>
                                        </div>
                                    </div>
                                </button>

                                {isCustom && (
                                    <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
                                            <input
                                                type="date"
                                                value={customDate}
                                                onChange={(e) => setCustomDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Waktu</label>
                                            <input
                                                type="time"
                                                value={customTime}
                                                onChange={(e) => setCustomTime(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            {scheduledTime && (
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <div className="text-xs text-gray-500 mb-1">Akan dijadwalkan:</div>
                                    <div className="text-white font-bold">{formatScheduledTime(scheduledTime)}</div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!showSuccess && (
                    <div className="p-5 pt-0 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!canSave || isSaving}
                            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Task'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
