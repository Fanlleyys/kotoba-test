import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Play, BellRing } from 'lucide-react';
import { getCards } from '../modules/decks/api';
import { getDueTasks } from '../modules/tasks/api';

// Key untuk localStorage
const NOTIFICATION_DISMISSED_KEY = 'kotoba_notification_dismissed';
const NOTIFICATION_PERMISSION_ASKED = 'kotoba_notification_permission_asked';

export const ReviewReminder: React.FC = () => {
    const [dueCardCount, setDueCardCount] = useState(0);
    const [dueTaskCount, setDueTaskCount] = useState(0);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Cek apakah sudah di-dismiss dalam session ini
        const dismissed = sessionStorage.getItem(NOTIFICATION_DISMISSED_KEY);
        if (dismissed) {
            setIsDismissed(true);
        }

        // Hitung kartu yang due
        const allCards = getCards();
        const now = new Date().toISOString();
        const dueCards = allCards.filter(c => c.reviewMeta.nextReview <= now);
        setDueCardCount(dueCards.length);

        // Hitung task yang due
        const dueTasks = getDueTasks();
        setDueTaskCount(dueTasks.length);

        // Trigger browser notification jika ada kartu atau task due
        const totalDue = dueCards.length + dueTasks.length;
        if (totalDue > 0) {
            setIsVisible(true);
            requestBrowserNotification(dueCards.length, dueTasks.length);
        }
    }, []);

    // Request browser notification permission & send notification
    const requestBrowserNotification = async (cardCount: number, taskCount: number) => {
        // Cek apakah browser mendukung notifications
        if (!('Notification' in window)) {
            console.log('Browser tidak mendukung notifications');
            return;
        }

        // Jika sudah granted, langsung kirim
        if (Notification.permission === 'granted') {
            sendBrowserNotification(cardCount, taskCount);
            return;
        }

        // Jika belum pernah ditanya, minta permission
        const asked = localStorage.getItem(NOTIFICATION_PERMISSION_ASKED);
        if (Notification.permission === 'default' && !asked) {
            localStorage.setItem(NOTIFICATION_PERMISSION_ASKED, 'true');
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                sendBrowserNotification(cardCount, taskCount);
            }
        }
    };

    const sendBrowserNotification = (cardCount: number, taskCount: number) => {
        const parts: string[] = [];
        if (cardCount > 0) parts.push(`${cardCount} kartu`);
        if (taskCount > 0) parts.push(`${taskCount} task`);
        const message = parts.join(' dan ');

        const notification = new Notification('📚 Saatnya Review!', {
            body: `Kamu punya ${message} yang perlu direview. Yuk belajar sekarang!`,
            icon: '/favicon.ico',
            tag: 'kotoba-review-reminder',
            requireInteraction: false,
        });

        notification.onclick = () => {
            window.focus();
            window.location.href = taskCount > 0 ? '/tasks' : '/study';
            notification.close();
        };

        setTimeout(() => notification.close(), 10000);
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        sessionStorage.setItem(NOTIFICATION_DISMISSED_KEY, 'true');
    };

    const totalDue = dueCardCount + dueTaskCount;

    // Jangan render jika tidak ada yang due atau sudah di-dismiss
    if (totalDue === 0 || isDismissed || !isVisible) {
        return null;
    }

    // Build message
    const getNotificationMessage = () => {
        const parts: string[] = [];
        if (dueCardCount > 0) parts.push(`${dueCardCount} kartu`);
        if (dueTaskCount > 0) parts.push(`${dueTaskCount} task`);
        return parts.join(' dan ') + ' menunggu untuk direview';
    };

    return (
        <div className="fixed top-16 left-0 right-0 z-40 px-4 py-2 animate-slide-down">
            <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/90 to-purple-600/90 backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
                    {/* Pulse animation overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />

                    <div className="relative px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-4">
                        {/* Icon & Message */}
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="relative">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <BellRing className="w-5 h-5 md:w-6 md:h-6 text-white animate-wiggle" />
                                </div>
                                {/* Badge */}
                                <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                                    {totalDue > 99 ? '99+' : totalDue}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-white font-bold text-sm md:text-base">
                                    ⏰ Waktunya Review!
                                </h3>
                                <p className="text-violet-100 text-xs md:text-sm">
                                    {getNotificationMessage()}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <Link
                                to="/study"
                                className="flex items-center gap-2 bg-white text-violet-700 font-bold text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-xl hover:bg-violet-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
                            >
                                <Play size={16} fill="currentColor" />
                                <span className="hidden sm:inline">Review Sekarang</span>
                                <span className="sm:hidden">Mulai</span>
                            </Link>

                            <button
                                onClick={handleDismiss}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                                aria-label="Tutup notifikasi"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
