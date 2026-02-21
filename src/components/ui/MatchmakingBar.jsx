import React from 'react';

export const MatchmakingBar = ({ current, max }) => {
    const percentage = (current / max) * 100;
    const isFull = current === max;

    return (
        <div className="w-full mt-2">
            <div className="flex justify-between text-xs mb-1 text-slate-500 dark:text-slate-400 font-medium">
                <span>{current} / {max} Jugadores</span>
                <span>{isFull ? '¡Listo!' : `Faltan ${max - current}`}</span>
            </div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${percentage < 50 ? 'bg-slate-400 dark:bg-slate-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
