import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider as GoogleAuthProviderClass
} from 'firebase/auth';
import { auth, googleProvider, DEEP_LINK_CONFIG } from '../services/firebase';

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
        url.startsWith(`${DEEP_LINK_CONFIG.scheme}://`) ||
        userAgent.includes('wv') || // WebView
        (window as any).Capacitor !== undefined
    );
};

// Parse deep link URL for OAuth token
const parseDeepLinkAuth = (): { idToken?: string; accessToken?: string } | null => {
    if (typeof window === 'undefined') return null;
    
    const url = window.location.href;
    
    // Check if this is a deep link callback
    if (url.includes(`${DEEP_LINK_CONFIG.scheme}://`) || 
        url.includes(`/${DEEP_LINK_CONFIG.callbackPath}`)) {
        
        // Try to extract tokens from URL hash or query params
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        const idToken = hashParams.get('id_token') || queryParams.get('id_token');
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        
        if (idToken || accessToken) {
            return { idToken: idToken || undefined, accessToken: accessToken || undefined };
        }
    }
    
    return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileApp] = useState(detectMobileApp);

    useEffect(() => {
        // Handle deep link OAuth callback
        const handleDeepLinkAuth = async () => {
            const tokens = parseDeepLinkAuth();
            if (tokens?.idToken) {
                try {
                    console.log('Deep link auth detected, signing in with credential...');
                    const credential = GoogleAuthProviderClass.credential(tokens.idToken, tokens.accessToken);
                    await signInWithCredential(auth, credential);
                    
                    // Clean up URL
                    window.history.replaceState({}, document.title, '/');
                } catch (error) {
                    console.error('Deep link auth error:', error);
                }
            }
        };

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

        // Try deep link first, then redirect result
        handleDeepLinkAuth();
        handleRedirectResult();

        // Listen for Capacitor app URL open events (deep links)
        const setupAppUrlListener = async () => {
            if ((window as any).Capacitor?.Plugins?.App) {
                const { App } = (window as any).Capacitor.Plugins;
                App.addListener('appUrlOpen', async (event: { url: string }) => {
                    console.log('App URL opened:', event.url);
                    
                    // Parse the URL for auth tokens
                    if (event.url.includes(DEEP_LINK_CONFIG.callbackPath)) {
                        const urlObj = new URL(event.url);
                        const idToken = urlObj.searchParams.get('id_token');
                        
                        if (idToken) {
                            try {
                                const credential = GoogleAuthProviderClass.credential(idToken);
                                await signInWithCredential(auth, credential);
                            } catch (error) {
                                console.error('Capacitor URL auth error:', error);
                            }
                        }
                    }
                });
            }
        };

        setupAppUrlListener();

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

            // For mobile apps, use redirect (deep link will handle callback)
            console.log('Mobile detected, using redirect with deep link...');
            await signInWithRedirect(auth, googleProvider);

        } catch (error: any) {
            console.error('Auth error:', error.code, error.message);

            // Handle specific errors
            if (error.code === 'auth/popup-blocked') {
                await signInWithRedirect(auth, googleProvider);
            } else if (error.message?.includes('missing initial state')) {
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
