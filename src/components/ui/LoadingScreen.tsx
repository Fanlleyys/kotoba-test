import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const QUOTES = [
    "Learning a language is a treasure that will follow its owner everywhere.",
    "千里の道も一歩から (A journey of a thousand miles begins with a single step).",
    "継続は力なり (Continuity is power).",
    "七転び八起き (Fall seven times, stand up eight).",
    "Loading your personalized dashboard...",
    "Preparing your flashcards...",
];

export const LoadingScreen: React.FC = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center animate-fade-in">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">KataSensei</h3>
            <p className="mt-2 text-gray-400 max-w-sm italic">
                "{quote}"
            </p>
        </div>
    );
};
