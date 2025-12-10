import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id' | 'ja';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        'app.title': 'KataSensei',
        'nav.dashboard': 'Dashboard',
        'nav.study': 'Study',
        'nav.decks': 'Decks',
        'nav.arcade': 'Arcade',
        'nav.import': 'Import',
        'nav.settings': 'Settings',
        'settings.title': 'Settings',
        'settings.language': 'Language',
        'settings.theme': 'Theme',
        'settings.study': 'Study Preferences',
        'study.furigana': 'Show Furigana',
        'study.reverse': 'Reverse Cards (Meaning First)',
    },
    id: {
        'app.title': 'KataSensei',
        'nav.dashboard': 'Beranda',
        'nav.study': 'Belajar',
        'nav.decks': 'Koleksi',
        'nav.arcade': 'Arcade',
        'nav.import': 'Impor',
        'nav.settings': 'Pengaturan',
        'settings.title': 'Pengaturan',
        'settings.language': 'Bahasa',
        'settings.theme': 'Tema',
        'settings.study': 'Preferensi Belajar',
        'study.furigana': 'Tampilkan Furigana',
        'study.reverse': 'Balik Kartu (Arti Duluan)',
    },
    ja: {
        'app.title': 'KataSensei',
        'nav.dashboard': 'ダッシュボード',
        'nav.study': '学習',
        'nav.decks': 'デッキ',
        'nav.arcade': 'アーケード',
        'nav.import': 'インポート',
        'nav.settings': '設定',
        'settings.title': '設定',
        'settings.language': '言語',
        'settings.theme': 'テーマ',
        'settings.study': '学習設定',
        'study.furigana': 'ふりがなを表示',
        'study.reverse': 'カードを反転 (意味から)',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem('app-language') as Language) || 'en';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
    }, [language]);

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
