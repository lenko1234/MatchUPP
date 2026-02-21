import React, { useState } from 'react';
import { X, Check, Copy, Phone, Users, Lock } from 'lucide-react';

export const OwnerCreateMatchModal = ({ courts = [], onClose, onCreate }) => {
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        courtId: '',
        date: today,
        time: '',
        type: 'public',
        gender: 'mixto',
        minAge: '',
        maxAge: '',
        minRanking: 1,
        totalPlayers: 10,
        price: '',
    });

    const [shareLink, setShareLink] = useState('');
    const [createdMatchId, setCreatedMatchId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.courtId || !formData.time) return;

        const matchId = `m${Date.now()}`;
        setCreatedMatchId(matchId);

        const matchData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            minAge: parseInt(formData.minAge) || 0,
            maxAge: parseInt(formData.maxAge) || 99,
        };

        if (formData.type === 'private') {
            const link = `https://matchup.app/partido/${matchId}`;
            setShareLink(link);
            // Guardamos de todos modos para tenerlo en el estado
            onCreate(matchData);
        } else {
            onCreate(matchData);
            onClose();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
    };

    const shareWhatsApp = () => {
        const message = `¡Unite al partido privado! 🏃‍♂️⚽\n${shareLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Pantalla de éxito para partidos privados
    if (shareLink) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                            <Check size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">¡Partido Creado!</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Compartí este link para que se sumen tus amigos</p>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-xs text-slate-600 dark:text-slate-400 break-all font-mono">{shareLink}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                <Copy size={18} />
                                Copiar
                            </button>
                            <button
                                onClick={shareWhatsApp}
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
                            >
                                <Phone size={18} />
                                WhatsApp
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full text-slate-500 dark:text-slate-400 py-2 font-bold hover:text-slate-700 dark:hover:text-white transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto">
                <div className="flex justify-between items-center text-slate-800 dark:text-white">
                    <h2 className="text-xl font-bold">Crear Partido</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tipo de Partido</label>
                        <div className="flex gap-2">
                            {[
                                { value: 'public', label: 'Público', icon: Users },
                                { value: 'private', label: 'Privado', icon: Lock },
                            ].map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: value })}
                                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${formData.type === value
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cancha */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cancha</label>
                        <select
                            value={formData.courtId}
                            onChange={(e) => setFormData({ ...formData, courtId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                            required
                        >
                            <option value="">Seleccionar cancha</option>
                            {courts.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fecha</label>
                            <input
                                type="date"
                                value={formData.date}
                                min={today}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Hora</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                                required
                            />
                        </div>
                    </div>

                    {/* Precio y Total Players */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Precio/persona</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="1500"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jugadores</label>
                            <select
                                value={formData.totalPlayers}
                                onChange={(e) => setFormData({ ...formData, totalPlayers: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                            >
                                <option value={6}>6 (3v3)</option>
                                <option value={8}>8 (4v4)</option>
                                <option value={10}>10 (5v5)</option>
                                <option value={12}>12 (6v6)</option>
                            </select>
                        </div>
                    </div>

                    {/* Género */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Género</label>
                        <div className="flex gap-2">
                            {['mixto', 'masculino', 'femenino'].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: g })}
                                    className={`flex-1 py-2 rounded-xl font-bold text-sm capitalize transition-all ${formData.gender === g
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nivel mínimo */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nivel Mínimo</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(rank => (
                                <button
                                    key={rank}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, minRanking: rank })}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.minRanking === rank
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    {rank}★
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
                    >
                        {formData.type === 'private' ? 'Crear y Generar Link' : 'Crear Partido Público'}
                    </button>
                </form>
            </div>
        </div>
    );
};
