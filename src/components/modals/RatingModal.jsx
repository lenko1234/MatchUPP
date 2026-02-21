import React, { useState } from 'react';
import { Star, AlertTriangle, Check, X } from 'lucide-react';

// Jugadores simulados que "jugaron el partido"
const MOCK_TEAMMATES = [
    { id: 'p2', name: 'Agustín', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus' },
    { id: 'p3', name: 'Florencia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Flor' },
    { id: 'p4', name: 'Marcelo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcelo' },
    { id: 'p5', name: 'Valentina', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vale' },
];

const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="transition-transform hover:scale-110 active:scale-90"
            >
                <Star
                    size={24}
                    className={star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}
                />
            </button>
        ))}
    </div>
);

export const RatingModal = ({ match, onClose, onSubmit }) => {
    const [ratings, setRatings] = useState(
        Object.fromEntries(MOCK_TEAMMATES.map(p => [p.id, { stars: 0, strike: false }]))
    );
    const [submitted, setSubmitted] = useState(false);

    const setStars = (playerId, stars) => {
        setRatings(prev => ({ ...prev, [playerId]: { ...prev[playerId], stars } }));
    };

    const toggleStrike = (playerId) => {
        setRatings(prev => ({
            ...prev,
            [playerId]: { ...prev[playerId], strike: !prev[playerId].strike }
        }));
    };

    const handleSubmit = () => {
        onSubmit(ratings);
        setSubmitted(true);
        setTimeout(onClose, 2000);
    };

    const allRated = Object.values(ratings).every(r => r.stars > 0);

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center animate-in fade-in duration-200 px-4">
                <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-8 text-center space-y-4 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto">
                        <Check size={40} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">¡Gracias!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Tu valoración ayuda a mantener la comunidad sana 🙌</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 pb-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white">Valorá el partido</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                ¿Cómo fueron tus compañeros de hoy?
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="mt-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                            Si alguien no se presentó sin avisar, marcá "Strike". A los 3 strikes, se suspende 15 días.
                        </p>
                    </div>
                </div>

                {/* Lista de jugadores */}
                <div className="p-6 space-y-4">
                    {MOCK_TEAMMATES.map((player) => {
                        const r = ratings[player.id];
                        return (
                            <div
                                key={player.id}
                                className={`p-4 rounded-2xl border-2 transition-all ${r.strike
                                    ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={player.avatar}
                                        alt={player.name}
                                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">{player.name}</p>
                                        {r.strike && (
                                            <p className="text-[10px] font-bold text-red-500">⚠️ Strike reportado</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => toggleStrike(player.id)}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${r.strike
                                            ? 'bg-red-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
                                            }`}
                                    >
                                        <AlertTriangle size={12} />
                                        Strike
                                    </button>
                                </div>

                                {!r.strike && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Calificación</p>
                                        <StarRating value={r.stars} onChange={(stars) => setStars(player.id, stars)} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Submit */}
                <div className="px-6 pb-8">
                    <button
                        onClick={handleSubmit}
                        disabled={!allRated}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                    >
                        {allRated ? 'Enviar Valoraciones' : 'Calificá a todos para continuar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
