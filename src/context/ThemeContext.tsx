import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'violet' | 'dracula' | 'tokyo-night' | 'nord' | 'cyberpunk' | 'synthwave' | 'monokai' | 'catppuccin';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEMES: { id: Theme; name: string; primary: string; secondary: string; bg: string }[] = [
    { id: 'violet', name: 'Default', primary: '#7c3aed', secondary: '#c084fc', bg: '#050508' },
    { id: 'dracula', name: 'Dracula', primary: '#bd93f9', secondary: '#ff79c6', bg: '#282a36' },
    { id: 'tokyo-night', name: 'Tokyo Night', primary: '#7aa2f7', secondary: '#bb9af7', bg: '#1a1b26' },
    { id: 'nord', name: 'Nord', primary: '#88c0d0', secondary: '#81a1c1', bg: '#2e3440' },
    { id: 'cyberpunk', name: 'Cyberpunk', primary: '#f7e018', secondary: '#00f0ff', bg: '#050505' },
    { id: 'synthwave', name: 'Synthwave', primary: '#ff71ce', secondary: '#01cdfe', bg: '#2b213a' },
    { id: 'monokai', name: 'Monokai', primary: '#a6e22e', secondary: '#f92672', bg: '#272822' },
    { id: 'catppuccin', name: 'Catppuccin', primary: '#f5c2e7', secondary: '#cba6f7', bg: '#1e1e2e' },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('violet');

    useEffect(() => {
        // Load theme from local storage
        const savedTheme = localStorage.getItem('katasensei-theme') as Theme;
        if (savedTheme && THEMES.find(t => t.id === savedTheme)) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Apply theme class to body
        const body = document.body;
        THEMES.forEach(t => body.classList.remove(`theme-${t.id}`));

        if (theme !== 'violet') {
            body.classList.add(`theme-${theme}`);
        }

        // Update meta theme-color
        const activeTheme = THEMES.find(t => t.id === theme);
        if (activeTheme) {
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', activeTheme.bg);
        }

        // Save to local storage
        localStorage.setItem('katasensei-theme', theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
