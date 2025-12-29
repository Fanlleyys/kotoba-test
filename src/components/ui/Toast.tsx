import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-[#1a1a24] border-green-500/50 text-green-400',
        error: 'bg-[#1a1a24] border-red-500/50 text-red-400',
        info: 'bg-[#1a1a24] border-blue-500/50 text-blue-400',
    };

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
    };

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${bgColors[type]} animate-slide-down min-w-[300px] max-w-[90vw]`}>
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium text-white flex-1">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={16} className="text-gray-400" />
            </button>
        </div>
    );
};
