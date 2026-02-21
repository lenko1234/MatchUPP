import React, { useEffect } from 'react';
import { X, Bell, ShieldCheck } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${type === 'success'
            ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
            : type === 'error'
                ? 'bg-red-500 border-red-400 text-white shadow-red-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white'
            }`}>
            {type === 'success' ? <ShieldCheck size={20} /> : <Bell size={20} />}
            <span className="font-bold text-sm flex-1">{message}</span>
            <button onClick={onClose} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] space-y-2 w-full max-w-md px-4">
        {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
    </div>
);
