import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const MAX_FILE_SIZE = 500 * 1024; // 500KB max

export interface UserProfile {
    photoURL: string | null;
    displayName: string | null;
    updatedAt: string;
}

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.size > MAX_FILE_SIZE) {
            reject(new Error('File too large. Max 500KB.'));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Resize image to max dimensions
 */
export const resizeImage = (base64: string, maxSize: number = 200): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height) {
                if (width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert to JPEG for smaller size
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
    });
};

/**
 * Save custom profile photo to Firestore
 */
export const saveProfilePhoto = async (userId: string, photoBase64: string): Promise<void> => {
    const profileRef = doc(db, 'users', userId, 'profile', 'main');

    await setDoc(profileRef, {
        photoURL: photoBase64,
        updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log('✅ Profile photo saved');
};

/**
 * Get custom profile photo from Firestore
 */
export const getProfilePhoto = async (userId: string): Promise<string | null> => {
    const profileRef = doc(db, 'users', userId, 'profile', 'main');
    const docSnap = await getDoc(profileRef);

    if (docSnap.exists()) {
        return docSnap.data().photoURL || null;
    }

    return null;
};

/**
 * Remove custom profile photo
 */
export const removeProfilePhoto = async (userId: string): Promise<void> => {
    const profileRef = doc(db, 'users', userId, 'profile', 'main');

    await setDoc(profileRef, {
        photoURL: null,
        updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log('✅ Profile photo removed');
};
