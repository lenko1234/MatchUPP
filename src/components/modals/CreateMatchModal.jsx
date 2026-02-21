import React, { useState } from 'react';
import { X, Users, Lock, Check, Copy, Phone } from 'lucide-react';

const CITIES = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata'];

// ─── Pantalla de éxito para partido PRIVADO ──────────────────
const PrivateSuccessScreen = ({ matchId, formData, onClose }) => {
    const link = `https://matchup.app/partido/${matchId}`;
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const shareWhatsApp = () => {
        const msg = `¡Te invito a mi partido! 🏃⚽\n📍 ${formData.city} · ${formData.gender}\n👥 ${formData.totalPlayers / 2} vs ${formData.totalPlayers / 2}\n⭐ Nivel mínimo ${formData.minRanking}★\n\nUníte acá: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="space-y-5 pt-2">
            <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto">
                    <Check size={40} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">¡Partido creado!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Compartí el link para que tus amigos se sumen
                    </p>
                </div>
            </div>

            {/* Resumen del partido */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Ciudad</span>
                    <span className="font-bold text-slate-800 dark:text-white">{formData.city}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Formato</span>
                    <span className="font-bold text-slate-800 dark:text-white">{formData.totalPlayers / 2} vs {formData.totalPlayers / 2}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Género</span>
                    <span className="font-bold text-slate-800 dark:text-white capitalize">{formData.gender}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Nivel mínimo</span>
                    <span className="font-bold text-slate-800 dark:text-white">{formData.minRanking}★</span>
                </div>
            </div>

            {/* Link */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Link de invitación</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 break-all font-mono">{link}</p>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
                <button
                    onClick={copyLink}
                    className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white'
                        }`}
                >
                    {copied ? <><Check size={18} /> Copiado</> : <><Copy size={18} /> Copiar Link</>}
                </button>
                <button
                    onClick={shareWhatsApp}
                    className="flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                >
                    <Phone size={18} />
                    WhatsApp
                </button>
            </div>

            <button
                onClick={onClose}
                className="w-full text-slate-400 dark:text-slate-500 py-2 font-bold text-sm hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
                Cerrar
            </button>
        </div>
    );
};

// ─── Modal principal ─────────────────────────────────────────
export const CreateMatchModal = ({ initialData, onClose, onCreate, userRanking }) => {
    const [step, setStep] = useState('form'); // 'form' | 'success'
    const [createdMatchId, setCreatedMatchId] = useState(null);

    const [formData, setFormData] = useState({
        type: initialData?.type || 'public',       // 'public' | 'private'
        city: initialData?.city || '',
        gender: 'mixto',
        minAge: '',
        maxAge: '',
        minRanking: 1,
        totalPlayers: 10,
        ...initialData, // pisamos con courtId, date, time etc si existen
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.city) return;

        const matchId = `m${Date.now()}`;
        setCreatedMatchId(matchId);
        onCreate({ ...formData, _matchId: matchId });

        if (formData.type === 'private') {
            // Para privado: mostramos la pantalla de éxito con link
            setStep('success');
        } else {
            // Para público: cerramos directamente (el partido ya aparece en la lista)
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {step === 'success' ? '¡Todo listo!' : 'Crear Partido'}
                        </h2>
                        {step === 'form' && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {formData.date && formData.time
                                    ? `Turno: ${formData.date} - ${formData.time} hs`
                                    : `Tu nivel actual: ${userRanking}★`}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {step === 'success' ? (
                    <PrivateSuccessScreen
                        matchId={createdMatchId}
                        formData={formData}
                        onClose={onClose}
                    />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pb-4">

                        {/* Tipo: Público / Privado */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tipo de Partido</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'public' })}
                                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'public'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    <Users size={16} />
                                    Público
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'private' })}
                                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${formData.type === 'private'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                        }`}
                                >
                                    <Lock size={16} />
                                    Privado
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 px-1">
                                {formData.type === 'public'
                                    ? '🌍 Visible para todos los jugadores de la zona. Se llenan solos.'
                                    : '🔒 Solo entran con el link. Vos invitás a quien quieras.'}
                            </p>
                        </div>

                        {/* Ciudad */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ciudad</label>
                            <select
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium transition-colors"
                                required
                            >
                                <option value="">Seleccioná una ciudad</option>
                                {CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
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

                        {/* Jugadores */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Formato</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[6, 8, 10, 12].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, totalPlayers: n })}
                                        className={`py-3 rounded-xl font-bold text-sm transition-all ${formData.totalPlayers === n
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                            : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        {n / 2}v{n / 2}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Nivel Mínimo — solo para público */}
                        {formData.type === 'public' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nivel Mínimo Requerido</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(rank => (
                                        <button
                                            key={rank}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, minRanking: rank })}
                                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.minRanking === rank
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                                : rank > userRanking
                                                    ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 opacity-50 cursor-not-allowed'
                                                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                                                }`}
                                            disabled={rank > userRanking}
                                        >
                                            {rank}★
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                                    No podés pedir un nivel más alto que el tuyo ({userRanking}★)
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all mt-2"
                        >
                            {formData.type === 'private' ? 'Crear y Obtener Link 🔗' : 'Publicar Partido 🌍'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
