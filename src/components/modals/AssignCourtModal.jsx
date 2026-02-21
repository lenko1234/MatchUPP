import React, { useState } from 'react';
import { Bell, MapPin } from 'lucide-react';

export const AssignCourtModal = ({ match, courts = [], onClose, onAssign }) => {
    const [selectedCourtId, setSelectedCourtId] = useState('');

    const handleAssign = () => {
        if (selectedCourtId) {
            onAssign(match.id, selectedCourtId);
        }
    };

    const playersCount = match?.playerIds?.length || 0;
    const totalPlayers = match?.totalPlayers || 10;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center animate-in fade-in duration-200 px-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-6 space-y-5 animate-in zoom-in duration-300 shadow-2xl">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                        <Bell size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">¡Partido Completo!</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        El partido tiene {playersCount}/{totalPlayers} jugadores. Asignale una cancha para confirmar.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Asignar Cancha</label>
                    <div className="space-y-2">
                        {courts.map(court => (
                            <button
                                key={court.id}
                                onClick={() => setSelectedCourtId(court.id)}
                                className={`w-full p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${selectedCourtId === court.id
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-600/10'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <div className={`p-2 rounded-xl ${selectedCourtId === court.id ? 'bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-800 dark:text-white">{court.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{court.surface} • {court.coverType?.replace('_', ' ')}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Después
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedCourtId}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};
