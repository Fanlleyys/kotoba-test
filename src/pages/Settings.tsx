import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useStudySettings } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';
import { Palette, BookOpen, Info, Github, Heart, Zap, Upload, Database, ChevronRight, Cloud, LogOut, RefreshCw, Loader2, CheckCircle, Camera, X } from 'lucide-react';
import { syncData, saveToCloud } from '../services/cloudSync';
import { fileToBase64, resizeImage, saveProfilePhoto, getProfilePhoto, removeProfilePhoto } from '../services/profilePhoto';

export const Settings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { showFurigana, setShowFurigana, reverseCards, setReverseCards } = useStudySettings();
    const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cloud sync state
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [lastSyncResult, setLastSyncResult] = useState<string>('');

    // Profile photo state
    const [customPhoto, setCustomPhoto] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    // Load custom photo on mount
    useEffect(() => {
        if (user) {
            getProfilePhoto(user.uid).then(photo => {
                if (photo) setCustomPhoto(photo);
            });
        }
    }, [user]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploadingPhoto(true);
        try {
            const base64 = await fileToBase64(file);
            const resized = await resizeImage(base64, 200);
            await saveProfilePhoto(user.uid, resized);
            setCustomPhoto(resized);
        } catch (error) {
            console.error('Photo upload error:', error);
            alert('Gagal upload foto. Pastikan ukuran < 500KB.');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!user) return;
        setIsUploadingPhoto(true);
        try {
            await removeProfilePhoto(user.uid);
            setCustomPhoto(null);
        } catch (error) {
            console.error('Remove photo error:', error);
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSync = async () => {
        if (!user) return;
        setIsSyncing(true);
        setSyncStatus('idle');
        try {
            const result = await syncData(user.uid);
            setLastSyncResult(result === 'downloaded' ? 'Data diunduh dari cloud' :
                result === 'uploaded' ? 'Data diunggah ke cloud' : 'Data dimuat');
            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 3000);
        } catch (error) {
            console.error('Sync error:', error);
            setSyncStatus('error');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleBackup = async () => {
        if (!user) return;
        setIsSyncing(true);
        try {
            await saveToCloud(user.uid);
            setLastSyncResult('Backup berhasil!');
            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 3000);
        } catch (error) {
            console.error('Backup error:', error);
            setSyncStatus('error');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-violet-200">Customize your experience</p>
            </header>

            {/* Theme Section */}
            <section className="glass-panel p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 text-violet-300 font-semibold uppercase tracking-wider text-xs">
                    <Palette size={18} /> Theme
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
                    <BookOpen size={18} /> Study Preferences
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setShowFurigana(!showFurigana)}>
                        <div className="flex flex-col">
                            <span className="text-white font-medium">Show Furigana</span>
                            <span className="text-xs text-gray-400">Show reading aids above Kanji</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${showFurigana ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${showFurigana ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setReverseCards(!reverseCards)}>
                        <div className="flex flex-col">
                            <span className="text-white font-medium">Reverse Cards</span>
                            <span className="text-xs text-gray-400">Show meaning first, reveal Japanese</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${reverseCards ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${reverseCards ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Management - Useful for mobile */}
            <section className="glass-panel p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 text-violet-300 font-semibold uppercase tracking-wider text-xs">
                    <Database size={18} /> Data Management
                </div>
                <div className="space-y-3">
                    <Link
                        to="/import"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <Upload size={20} />
                            </div>
                            <div>
                                <span className="text-white font-medium">Import Vocabulary</span>
                                <span className="text-xs text-gray-400 block">Import JSON atau OCR</span>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-500 group-hover:text-white transition-colors" size={20} />
                    </Link>
                </div>
            </section>

            {/* Cloud Sync Section */}
            <section className="glass-panel p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-6 text-violet-300 font-semibold uppercase tracking-wider text-xs">
                    <Cloud size={18} /> Cloud Sync
                </div>

                {authLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                ) : user ? (
                    <div className="space-y-4">
                        {/* User Info with Photo Upload */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                            {/* Profile Photo with Edit */}
                            <div className="relative group flex-shrink-0">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
                                    <img
                                        src={customPhoto || user.photoURL || ''}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Edit overlay */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingPhoto}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {isUploadingPhoto ? (
                                        <Loader2 size={20} className="text-white animate-spin" />
                                    ) : (
                                        <Camera size={20} className="text-white" />
                                    )}
                                </button>
                                {/* Remove button */}
                                {customPhoto && (
                                    <button
                                        onClick={handleRemovePhoto}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} className="text-white" />
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">{user.displayName}</p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                                <p className="text-xs text-gray-500 mt-1">Hover foto untuk ganti</p>
                            </div>
                            <button
                                onClick={signOut}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>

                        {/* Sync Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="flex items-center justify-center gap-2 py-3 px-4 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                            >
                                {isSyncing ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <RefreshCw size={18} />
                                )}
                                Sync Now
                            </button>
                            <button
                                onClick={handleBackup}
                                disabled={isSyncing}
                                className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                            >
                                <Cloud size={18} />
                                Backup
                            </button>
                        </div>

                        {/* Sync Status */}
                        {syncStatus === 'success' && (
                            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-xl">
                                <CheckCircle size={16} />
                                {lastSyncResult}
                            </div>
                        )}
                        {syncStatus === 'error' && (
                            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">
                                Sync gagal. Coba lagi nanti.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <Cloud size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">Login untuk sync data ke cloud</p>
                        <button
                            onClick={signInWithGoogle}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Login with Google
                        </button>
                    </div>
                )}
            </section>

            {/* About & Credits */}
            <section className="glass-panel p-6 rounded-3xl mb-20 md:mb-0">
                <div className="flex items-center gap-3 mb-6 text-violet-300 font-semibold uppercase tracking-wider text-xs">
                    <Info size={18} /> About
                </div>

                <div className="space-y-4">
                    {/* App Info */}
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                            <Zap size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">KataSensei</h3>
                            <p className="text-gray-400 text-sm">Version 1.0.0</p>
                        </div>
                    </div>

                    {/* GitHub Link */}
                    <a
                        href="https://github.com/Fannzxyl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <Github size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                            <div>
                                <span className="text-white font-medium">GitHub</span>
                                <span className="text-xs text-gray-400 block">@Fannzxyl</span>
                            </div>
                        </div>
                        <span className="text-gray-500 group-hover:text-gray-300 text-sm">→</span>
                    </a>

                    {/* Credits */}
                    <div className="text-center pt-4 border-t border-white/10">
                        <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by <span className="text-white font-medium">Fannzxyl</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-1">© 2024 KataSensei. All rights reserved.</p>
                    </div>
                </div>
            </section>



        </div >
    );
};
