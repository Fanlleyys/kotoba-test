import React, { useEffect, useState } from 'react';
import { Zap, Star, Trophy } from 'lucide-react';

interface LevelUpCelebrationProps {
    level: number;
    isVisible: boolean;
    onClose: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
    level,
    isVisible,
    onClose
}) => {
    const [particles, setParticles] = useState<{ id: number; x: number; delay: number; color: string }[]>([]);

    useEffect(() => {
        if (isVisible) {
            // Generate confetti particles
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.5,
                color: ['#a855f7', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6'][Math.floor(Math.random() * 5)]
            }));
            setParticles(newParticles);

            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            onClick={onClose}
        >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-3 h-3 rounded-sm animate-confetti"
                        style={{
                            left: `${particle.x}%`,
                            top: '-10px',
                            backgroundColor: particle.color,
                            animationDelay: `${particle.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Level Up Card */}
            <div className="relative animate-bounce-in pointer-events-auto">
                <div className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 shadow-2xl border border-white/20 text-center max-w-sm mx-4">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl" />

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Trophy icon */}
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>

                        {/* Stars */}
                        <div className="flex justify-center gap-2 mb-4">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-wiggle" style={{ animationDelay: '0.1s' }} />
                            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-wiggle" />
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-wiggle" style={{ animationDelay: '0.2s' }} />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            🎉 Level Up!
                        </h2>

                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                Level {level}
                            </span>
                        </div>

                        <p className="text-violet-200 text-sm">
                            Terus belajar, Sensei! 🚀
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
