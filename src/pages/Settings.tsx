import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useStudySettings } from '../context/StudyContext';
import { Globe, Palette, BookOpen } from 'lucide-react';

export const Settings: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, setTheme } = useTheme();
    const { showFurigana, setShowFurigana, reverseCards, setReverseCards } = useStudySettings();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title')}</h1>
                <p className="text-violet-200">Customize your experience</p>
            </header>

            {/* Language Section */}
            <section className="glass-panel p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 text-violet-300 font-semibold uppercase tracking-wider text-xs">
                    <Globe size={18} /> {t('settings.language')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { code: 'en', label: 'English', flag: '🇺🇸' },
                        { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
                        { code: 'ja', label: '日本語', flag: '🇯🇵' },
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code as any)}
                            className={`
                flex items-center gap-3 p-4 rounded-xl border transition-all
                ${language === lang.code
                                    ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}
              `}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-medium">{lang.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Theme Section */}
            <section className="glass-panel p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 text-violet-300 font-semibold uppercase tracking-wider text-xs">
                    <Palette size={18} /> {t('settings.theme')}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {THEMES.map((tItem) => (
                        <button
                            key={tItem.id}
                            onClick={() => setTheme(tItem.id)}
                            className={`
                group relative p-3 rounded-xl border transition-all overflow-hidden text-left
                ${theme === tItem.id
                                    ? 'border-white/40 bg-white/10 shadow-lg'
                                    : 'border-transparent hover:bg-white/5'}
              `}
                        >
                            <div
                                className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30"
                                style={{ background: `linear-gradient(135deg, ${tItem.primary}, ${tItem.secondary})` }}
                            />
                            <div className="relative z-10 flex flex-col gap-2">
                                <div className="flex gap-1">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tItem.primary }} />
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tItem.secondary }} />
                                </div>
                                <span className={`text-sm font-medium ${theme === tItem.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                    {tItem.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Study Preferences */}
            <section className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 text-violet-300 font-semibold uppercase tracking-wider text-xs">
                    <BookOpen size={18} /> {t('settings.study')}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setShowFurigana(!showFurigana)}>
                        <div className="flex flex-col">
                            <span className="text-white font-medium">{t('study.furigana')}</span>
                            <span className="text-xs text-gray-400">Show reading aids above Kanji</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${showFurigana ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${showFurigana ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setReverseCards(!reverseCards)}>
                        <div className="flex flex-col">
                            <span className="text-white font-medium">{t('study.reverse')}</span>
                            <span className="text-xs text-gray-400">Show meaning first, reveal Japanese</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${reverseCards ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${reverseCards ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
