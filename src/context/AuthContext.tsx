import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, DEEP_LINK_CONFIG } from '../services/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isMobileApp: boolean;
    authError: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Detect if running in Capacitor environment
const detectMobileApp = (): boolean => {
    if (typeof window === 'undefined') return false;
    return (window as any).Capacitor !== undefined;
};

// Get Capacitor Browser plugin if available
const getCapacitorBrowser = async () => {
    if ((window as any).Capacitor?.Plugins?.Browser) {
        return (window as any).Capacitor.Plugins.Browser;
    }
    // Try dynamic import
    try {
        const { Browser } = await import('@capacitor/browser');
        return Browser;
    } catch {
        return null;
    }
};

// Build Firebase OAuth URL for external browser
const buildFirebaseOAuthUrl = (): string => {
    const authDomain = 'kotoba-f335d.firebaseapp.com';
    const clientId = '159368872578-xxxxxxxxx.apps.googleusercontent.com'; // Will be auto-detected
    const redirectUri = `${DEEP_LINK_CONFIG.scheme}://${DEEP_LINK_CONFIG.host}/${DEEP_LINK_CONFIG.callbackPath}`;

    // Firebase auth handler URL
    const baseUrl = `https://${authDomain}/__/auth/handler`;

    return baseUrl;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileApp] = useState(detectMobileApp);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        // Listen for deep link auth callbacks (from external browser)
        const setupDeepLinkListener = async () => {
            if ((window as any).Capacitor?.Plugins?.App) {
                const { App } = (window as any).Capacitor.Plugins;

                App.addListener('appUrlOpen', async (event: { url: string }) => {
                    console.log('Deep link received:', event.url);

                    // Check if this is our auth callback
                    if (event.url.includes(DEEP_LINK_CONFIG.scheme)) {
                        try {
                            const url = new URL(event.url);
                            const idToken = url.searchParams.get('id_token');
                            const accessToken = url.searchParams.get('access_token');

                            if (idToken) {
                                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                                await signInWithCredential(auth, credential);
                                console.log('Deep link auth successful!');

                                // Close the browser if still open
                                const Browser = await getCapacitorBrowser();
                                if (Browser) {
                                    await Browser.close();
                                }
                            }
                        } catch (error) {
                            console.error('Deep link auth error:', error);
                            setAuthError('Login gagal. Coba lagi.');
                        }
                    }
                });
            }
        };

        setupDeepLinkListener();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setAuthError(null);

        try {
            // For desktop browsers, use popup (works fine)
            if (!isMobileApp) {
                await signInWithPopup(auth, googleProvider);
                return;
            }

            // For Capacitor apps, try Browser plugin first
            const Browser = await getCapacitorBrowser();

            if (Browser) {
                console.log('Using Capacitor Browser for OAuth...');

                // Build the OAuth URL
                // Firebase will handle the OAuth flow and redirect back via deep link
                const authUrl = `https://kotoba-f335d.firebaseapp.com/__/auth/handler?` +
                    `apiKey=AIzaSyDYxerYUz36RVqLzHymld155pH65OoZUNo&` +
                    `authType=signInViaRedirect&` +
                    `providerId=google.com&` +
                    `redirectUrl=${encodeURIComponent(`${DEEP_LINK_CONFIG.scheme}://${DEEP_LINK_CONFIG.host}/${DEEP_LINK_CONFIG.callbackPath}`)}&` +
                    `v=10.7.0&` +
                    `scopes=email%20profile`;

                // Open in external browser
                await Browser.open({
                    url: authUrl,
                    presentationStyle: 'popover'
                });

                // The deep link listener will handle the callback
                return;
            }

            // Fallback: try popup anyway (might work on some devices)
            console.log('No Browser plugin, trying popup...');
            await signInWithPopup(auth, googleProvider);

        } catch (error: any) {
            console.error('Auth error:', error.code, error.message);

            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
                setAuthError('Login dibatalkan atau popup diblokir. Coba lagi.');
            } else if (error.message?.includes('missing initial state')) {
                setAuthError('WebView tidak mendukung login. Gunakan versi web.');
            } else {
                setAuthError(`Login gagal: ${error.message || 'Unknown error'}`);
            }

            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setAuthError(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, isMobileApp, authError }}>
            {children}
        </AuthContext.Provider>
    );
};
