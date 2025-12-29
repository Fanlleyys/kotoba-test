export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (!navigator.vibrate) return;

    switch (type) {
        case 'light':
            navigator.vibrate(10); // Tiny tick
            break;
        case 'medium':
            navigator.vibrate(40); // Standard click
            break;
        case 'heavy':
            navigator.vibrate(70); // Deep press
            break;
        case 'success':
            navigator.vibrate([30, 50, 30]); // Da-da-da
            break;
        case 'error':
            navigator.vibrate([50, 30, 50, 30, 50]); // Buzz-buzz-buzz
            break;
    }
};
