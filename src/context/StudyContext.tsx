import React, { createContext, useContext, useEffect, useState } from 'react';

interface StudySettings {
    showFurigana: boolean;
    reverseCards: boolean; // If true, show meaning first, then Japanese
    autoPlayAudio: boolean;
}

interface StudyContextType extends StudySettings {
    setShowFurigana: (show: boolean) => void;
    setReverseCards: (reverse: boolean) => void;
    setAutoPlayAudio: (play: boolean) => void;
}

const defaultSettings: StudySettings = {
    showFurigana: true,
    reverseCards: false,
    autoPlayAudio: false,
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showFurigana, setShowFuriganaState] = useState<boolean>(() => {
        const saved = localStorage.getItem('study-showFurigana');
        return saved !== null ? JSON.parse(saved) : defaultSettings.showFurigana;
    });

    const [reverseCards, setReverseCardsState] = useState<boolean>(() => {
        const saved = localStorage.getItem('study-reverseCards');
        return saved !== null ? JSON.parse(saved) : defaultSettings.reverseCards;
    });

    const [autoPlayAudio, setAutoPlayAudioState] = useState<boolean>(() => {
        const saved = localStorage.getItem('study-autoPlayAudio');
        return saved !== null ? JSON.parse(saved) : defaultSettings.autoPlayAudio;
    });

    useEffect(() => {
        localStorage.setItem('study-showFurigana', JSON.stringify(showFurigana));
    }, [showFurigana]);

    useEffect(() => {
        localStorage.setItem('study-reverseCards', JSON.stringify(reverseCards));
    }, [reverseCards]);

    useEffect(() => {
        localStorage.setItem('study-autoPlayAudio', JSON.stringify(autoPlayAudio));
    }, [autoPlayAudio]);

    const setShowFurigana = (show: boolean) => setShowFuriganaState(show);
    const setReverseCards = (reverse: boolean) => setReverseCardsState(reverse);
    const setAutoPlayAudio = (play: boolean) => setAutoPlayAudioState(play);

    return (
        <StudyContext.Provider
            value={{
                showFurigana,
                setShowFurigana,
                reverseCards,
                setReverseCards,
                autoPlayAudio,
                setAutoPlayAudio,
            }}
        >
            {children}
        </StudyContext.Provider>
    );
};

export const useStudySettings = () => {
    const context = useContext(StudyContext);
    if (context === undefined) {
        throw new Error('useStudySettings must be used within a StudyProvider');
    }
    return context;
};
