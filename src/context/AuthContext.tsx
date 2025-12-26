import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isMobileApp: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Detect if running in Capacitor/WebView environment
const detectMobileApp = (): boolean => {
    if (typeof window === 'undefined') return false;

    const url = document.URL;
    const userAgent = navigator.userAgent.toLowerCase();

    return (
        url.startsWith('capacitor://') ||
        url.startsWith('ionic://') ||
        url.includes('localhost:') ||
        userAgent.includes('wv') || // WebView
        (window as any).Capacitor !== undefined
    );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileApp] = useState(detectMobileApp);

    useEffect(() => {
        // Check for redirect result when app loads
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    console.log('Redirect login successful:', result.user.email);
                    setUser(result.user);
                }
            } catch (error: any) {
                if (error.code !== 'auth/redirect-cancelled-by-user') {
                    console.error('Redirect result error:', error.message);
                }
            }
        };

        handleRedirectResult();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            // For web browsers, use popup
            if (!isMobileApp) {
                await signInWithPopup(auth, googleProvider);
                return;
            }

            // For mobile apps, try redirect first
            console.log('Mobile detected, using redirect...');
            await signInWithRedirect(auth, googleProvider);

        } catch (error: any) {
            console.error('Auth error:', error.code, error.message);

            // Handle specific errors
            if (error.code === 'auth/popup-blocked') {
                // Fallback to redirect
                await signInWithRedirect(auth, googleProvider);
            } else if (error.message?.includes('missing initial state')) {
                // WebView storage issue - show helpful message
                throw new Error('LOGIN_WEBVIEW_ERROR');
            } else {
                throw error;
            }
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, isMobileApp }}>
            {children}
        </AuthContext.Provider>
    );
};
