import React, { useState, useEffect } from 'react';
import { X, Save, Languages } from 'lucide-react';
import { Card } from '../modules/decks/model';

interface EditCardModalProps {
    card: Card | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedCard: Card) => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
    card,
    isOpen,
    onClose,
    onSave
}) => {
    const [japanese, setJapanese] = useState('');
    const [furigana, setFurigana] = useState('');
    const [romaji, setRomaji] = useState('');
    const [indonesia, setIndonesia] = useState('');
    const [example, setExample] = useState('');

    useEffect(() => {
        if (card) {
            setJapanese(card.japanese || '');
            setFurigana(card.furigana || '');
            setRomaji(card.romaji || '');
            setIndonesia(card.indonesia || '');
            setExample(card.example || '');
        }
    }, [card]);

    const handleSave = () => {
        if (!card) return;

        const updatedCard: Card = {
            ...card,
            japanese,
            furigana,
            romaji,
            indonesia,
            example,
        };

        onSave(updatedCard);
        onClose();
    };

    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1a1a24] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in ring-1 ring-white/10 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Languages className="text-primary" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Edit Card</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="text-gray-400 hover:text-white" size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Japanese */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1.5">
                            Japanese (日本語)
                        </label>
                        <input
                            type="text"
                            value={japanese}
                            onChange={(e) => setJapanese(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-jp focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="漢字 / ひらがな"
                        />
                    </div>

                    {/* Furigana */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1.5">
                            Furigana (読み方)
                        </label>
                        <input
                            type="text"
                            value={furigana}
                            onChange={(e) => setFurigana(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="ひらがな"
                        />
                    </div>

                    {/* Romaji */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1.5">
                            Romaji
                        </label>
                        <input
                            type="text"
                            value={romaji}
                            onChange={(e) => setRomaji(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="romaji"
                        />
                    </div>

                    {/* Indonesian Meaning */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1.5">
                            Arti (Indonesia)
                        </label>
                        <input
                            type="text"
                            value={indonesia}
                            onChange={(e) => setIndonesia(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Arti dalam Bahasa Indonesia"
                        />
                    </div>

                    {/* Example Sentence */}
                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1.5">
                            Contoh Kalimat (Optional)
                        </label>
                        <textarea
                            value={example}
                            onChange={(e) => setExample(e.target.value)}
                            rows={2}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            placeholder="例文を入力..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!japanese.trim() || !indonesia.trim()}
                        className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};
