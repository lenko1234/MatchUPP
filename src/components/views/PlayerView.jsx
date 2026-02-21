import React, { useState } from 'react';
import { ShieldCheck, MapPin, Clock, Users, MessageSquare, PlusCircle, SlidersHorizontal, X, Trophy } from 'lucide-react';

const GENDER_LABELS = { mixto: 'Mixto', masculino: 'Masculino', femenino: 'Femenino' };

const FilterBar = ({ filters, setFilters, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-5 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Filtros</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                    <X size={20} className="text-slate-400" />
                </button>
            </div>

            {/* Género */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Género</label>
                <div className="flex gap-2">
                    {['todos', 'mixto', 'masculino', 'femenino'].map(g => (
                        <button
                            key={g}
                            onClick={() => setFilters(f => ({ ...f, gender: g }))}
                            className={`flex-1 py-2 rounded-xl font-bold text-xs capitalize transition-all ${filters.gender === g
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {g === 'todos' ? 'Todos' : GENDER_LABELS[g]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Nivel */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nivel mínimo requerido</label>
                <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map(rank => (
                        <button
                            key={rank}
                            onClick={() => setFilters(f => ({ ...f, maxMinRanking: rank }))}
                            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${filters.maxMinRanking === rank
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {rank === 0 ? 'Todos' : `${rank}★`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Estado */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Estado</label>
                <div className="flex gap-2">
                    {[
                        { value: 'todos', label: 'Todos' },
                        { value: 'open', label: 'Con lugar' },
                        { value: 'full', label: 'Completos' },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFilters(f => ({ ...f, status: value }))}
                            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${filters.status === value
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
                Aplicar Filtros
            </button>
        </div>
    </div>
);

export const PlayerView = ({
    matches = [],
    joinedMatchIds = [],
    userProfile = {},
    onJoin,
    onLeave,
    onCreateMatch,
    onOpenChat,
    onOpenRating,
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ gender: 'todos', maxMinRanking: 0, status: 'todos' });

    const filtered = matches.filter(m => {
        if (filters.gender !== 'todos' && m.gender !== filters.gender) return false;
        if (filters.maxMinRanking > 0 && m.minRanking > filters.maxMinRanking) return false;
        if (filters.status === 'open' && m.playerIds.length >= m.totalPlayers) return false;
        if (filters.status === 'full' && m.playerIds.length < m.totalPlayers) return false;
        return true;
    });

    const activeFilters = (filters.gender !== 'todos' ? 1 : 0) +
        (filters.maxMinRanking > 0 ? 1 : 0) +
        (filters.status !== 'todos' ? 1 : 0);

    return (
        <div className="pb-28 animate-in slide-in-from-right duration-500">

            {/* ── HEADER ── */}
            <header className="p-4 pt-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 rounded-b-[2rem] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-600/20 border-2 border-emerald-500 overflow-hidden">
                            <img
                                src={userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}`}
                                alt="avatar"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none text-slate-800 dark:text-white">
                                Hola, {userProfile.name}
                            </h1>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {userProfile.ranking}★ · {userProfile.city}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onOpenRating}
                        className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-600/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-600/30 transition-colors"
                        title="Valorar último partido"
                    >
                        <Trophy size={20} />
                    </button>
                </div>
            </header>

            <div className="p-4 space-y-5">
                {/* ── CARD DE REPUTACIÓN ── */}
                <section className="rounded-[2rem] p-5 text-white flex items-center justify-between overflow-hidden relative shadow-xl bg-slate-900 dark:bg-slate-800">
                    <div className="space-y-1 relative z-10">
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Nivel {userProfile.ranking}★</p>
                        <h2 className="text-xl font-bold leading-tight">
                            {!userProfile.strikes ? 'Tu conducta es impecable' : `Tenés ${userProfile.strikes} strike${userProfile.strikes > 1 ? 's' : ''}`}
                        </h2>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded-lg">{userProfile.strikes || 0} Strikes</span>
                            <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded-lg">{userProfile.matchesPlayed || 0} Partidos</span>
                            <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded-lg">{userProfile.ranking}★ Rating</span>
                        </div>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] text-emerald-500/20 rotate-12">
                        <ShieldCheck size={120} />
                    </div>
                </section>

                {/* ── CABECERA CON FILTROS ── */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-lg text-slate-800 dark:text-white">Partidos Abiertos</h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{filtered.length} encontrado{filtered.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Live</span>
                        </div>
                        <button
                            onClick={() => setShowFilters(true)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilters > 0
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            <SlidersHorizontal size={14} />
                            {activeFilters > 0 ? `${activeFilters} filtro${activeFilters > 1 ? 's' : ''}` : 'Filtrar'}
                        </button>
                    </div>
                </div>

                {/* ── LISTA DE PARTIDOS ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                        <div className="text-5xl">⚽</div>
                        <p className="font-bold text-slate-600 dark:text-slate-300">No hay partidos con esos filtros</p>
                        <button
                            onClick={onCreateMatch}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                        >
                            <PlusCircle size={18} />
                            Crear Partido
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((m) => {
                            const isJoined = joinedMatchIds.includes(m.id);
                            const currentPlayers = m.playerIds?.length || 0;
                            const isFull = currentPlayers >= m.totalPlayers;
                            const pct = (currentPlayers / m.totalPlayers) * 100;

                            return (
                                <div key={m.id} className="rounded-3xl p-5 shadow-sm border space-y-4 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 dark:text-white">{m.city || 'Ciudad'}</h3>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {m.time} HS</span>
                                                    <span className="flex items-center gap-1"><Users size={12} /> {m.totalPlayers / 2}v{m.totalPlayers / 2}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">Nivel {m.minRanking}★+</span>
                                                    <span className="text-[10px] capitalize text-slate-400 dark:text-slate-500">{GENDER_LABELS[m.gender] || m.gender}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-800 dark:text-white">${m.price}</p>
                                            <p className="text-[10px] font-bold uppercase text-slate-400">Por Persona</p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-slate-500 dark:text-slate-400 font-medium">
                                            <span>{currentPlayers}/{m.totalPlayers} Jugadores</span>
                                            <span>{isFull ? '¡Listo!' : `Faltan ${m.totalPlayers - currentPlayers}`}</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ease-out ${pct < 50 ? 'bg-slate-400 dark:bg-slate-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Avatars de jugadores */}
                                    {currentPlayers > 0 && (
                                        <div className="flex -space-x-2">
                                            {[...Array(Math.min(5, currentPlayers))].map((_, i) => (
                                                <img key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}${i}`} alt="" />
                                            ))}
                                            {currentPlayers > 5 && (
                                                <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300">+{currentPlayers - 5}</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Botones */}
                                    <div className="flex gap-3">
                                        {isJoined ? (
                                            <button onClick={() => onLeave(m.id)} className="flex-1 font-bold py-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-100 dark:shadow-red-900/20 active:scale-95 transition-all">
                                                Salir del Partido
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onJoin(m.id)}
                                                disabled={isFull}
                                                className={`flex-1 font-bold py-3 rounded-2xl shadow-lg transition-all ${isFull
                                                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                                                    : 'bg-emerald-600 text-white shadow-emerald-100 dark:shadow-emerald-900/20 active:scale-95'
                                                    }`}
                                            >
                                                {isFull ? 'Partido Completo' : 'Unirme ahora'}
                                            </button>
                                        )}
                                        {isJoined && (
                                            <button
                                                onClick={() => onOpenChat(m.id)}
                                                className="p-3 rounded-2xl active:scale-95 transition-transform bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                                            >
                                                <MessageSquare size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showFilters && (
                <FilterBar filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
            )}
        </div>
    );
};
