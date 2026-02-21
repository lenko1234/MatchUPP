import React, { useState } from 'react';
import {
    Calendar, Settings, MapPin, Check, DollarSign,
    Phone, PlusCircle, X, ChevronLeft, ChevronRight, Lock
} from 'lucide-react';
import { generateTimeSlots } from '../../data/mockData';

// Helpers
const formatARS = (n) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// Modal para crear/bloquear un turno nuevo
const BookingFormModal = ({ court, date, time, onClose, onCreate }) => {
    const [mode, setMode] = useState(null); // 'reserved' | 'blocked'
    const [form, setForm] = useState({ clientName: '', clientPhone: '', price: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({
            courtId: court.id,
            date,
            time,
            status: mode,
            clientName: form.clientName || null,
            clientPhone: form.clientPhone || null,
            price: parseFloat(form.price) || 0,
            notes: form.notes,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nuevo Turno</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{court.name} — {time} hs</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Modo */}
                {!mode ? (
                    <div className="space-y-3 pt-2">
                        <button
                            onClick={() => setMode('reserved')}
                            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition-colors group"
                        >
                            <p className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600">📋 Reserva Manual</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ingresá los datos del cliente (llamó por teléfono, WhatsApp, etc.)</p>
                        </button>
                        <button
                            onClick={() => setMode('blocked')}
                            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-left hover:border-red-400 transition-colors group"
                        >
                            <p className="font-bold text-slate-800 dark:text-white group-hover:text-red-500">🔒 Bloquear Horario</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mantenimiento, evento privado, etc.</p>
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'reserved' && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del cliente</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                                        placeholder="Ej: Juan Pérez"
                                        value={form.clientName}
                                        onChange={e => setForm({ ...form, clientName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                                        placeholder="+54 9 11..."
                                        value={form.clientPhone}
                                        onChange={e => setForm({ ...form, clientPhone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Precio</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                                        placeholder="15000"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Notas</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                                placeholder="Opcional..."
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setMode(null)}
                                className="flex-1 py-3 rounded-2xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                                Atrás
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${mode === 'blocked' ? 'bg-red-500 shadow-red-500/20' : 'bg-emerald-600 shadow-emerald-600/20'}`}
                            >
                                {mode === 'blocked' ? 'Bloquear' : 'Guardar Turno'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
export const OwnerScheduleView = ({
    courts = [],
    bookings = [],
    matches = [],
    complex = {},
    onCreateBooking,
    onTogglePaid,
    onCancelBooking,
    onCreateMatch,
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCourtId, setSelectedCourtId] = useState('all');
    const [bookingModal, setBookingModal] = useState(null); // { court, date, time }

    // ── Generar semana actual ──
    const getDaysOfWeek = () => {
        const days = [];
        const start = new Date();
        start.setDate(start.getDate() - start.getDay() + 1);
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    };
    const daysOfWeek = getDaysOfWeek();

    const dateStr = selectedDate.toISOString().split('T')[0];
    const monthName = selectedDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

    const timeSlots = generateTimeSlots(complex.openTime || '08:00', complex.closeTime || '23:00');

    // Canchas visibles según filtro
    const visibleCourts = selectedCourtId === 'all'
        ? courts
        : courts.filter(c => c.id === selectedCourtId);

    // Obtener booking para una (cancha, hora, fecha)
    const getBooking = (courtId, time) =>
        bookings.find(b => b.courtId === courtId && b.time === time && b.date === dateStr) || null;

    // Obtener partido (matchmaking) si el booking lo tiene
    const getMatch = (matchId) =>
        matchId ? matches.find(m => m.id === matchId) : null;

    return (
        <div className="min-h-screen pb-28 animate-in fade-in duration-500 bg-slate-50 dark:bg-slate-900">

            {/* ── HEADER ── */}
            <header className="px-5 pt-5 pb-3 rounded-b-[2.5rem] shadow-sm bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">

                {/* Mes + año */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-black flex items-center gap-2 text-slate-800 dark:text-white capitalize">
                        <Calendar size={26} className="text-emerald-600 dark:text-emerald-400" />
                        {monthName}
                    </h1>
                    <button className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        <Settings size={20} />
                    </button>
                </div>

                {/* Selector de días */}
                <div className="flex gap-1 pb-3 overflow-x-auto no-scrollbar">
                    {daysOfWeek.map((day, idx) => {
                        const isSelected = day.toISOString().split('T')[0] === dateStr;
                        const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(day)}
                                className={`flex flex-col items-center min-w-[46px] py-2.5 rounded-2xl transition-all duration-200 ${isSelected
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 scale-110'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-emerald-100' : ''}`}>
                                    {day.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')}
                                </span>
                                <span className="text-base font-black">{day.getDate()}</span>
                                {isToday && !isSelected && <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
                                {isSelected && <div className="w-1 h-1 rounded-full bg-white mt-0.5" />}
                            </button>
                        );
                    })}
                </div>

                {/* Filtro de canchas */}
                <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setSelectedCourtId('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCourtId === 'all'
                            ? 'bg-slate-800 dark:bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        Todas
                    </button>
                    {courts.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCourtId(c.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCourtId === c.id
                                ? 'bg-slate-800 dark:bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── GRILLA DE TURNOS ── */}
            <div className="px-4 pt-4 space-y-2">
                {timeSlots.map((time) => (
                    <div key={time}>
                        {/* Encabezado de hora */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 w-10">{time}</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        </div>

                        {/* Fila de canchas para este horario */}
                        <div className={`grid gap-2 ${visibleCourts.length === 1 ? 'grid-cols-1' : visibleCourts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {visibleCourts.map((court) => {
                                const booking = getBooking(court.id, time);
                                const match = booking ? getMatch(booking.matchId) : null;

                                // ── SLOT LIBRE ──
                                if (!booking) {
                                    return (
                                        <button
                                            key={court.id}
                                            onClick={() => setBookingModal({ court, date: dateStr, time })}
                                            className="rounded-2xl p-3 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-600/10 transition-all group text-left"
                                        >
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-emerald-600">{court.name}</p>
                                            <p className="text-xs font-black text-emerald-500 mt-0.5">Libre</p>
                                            <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-1">+ Reservar</p>
                                        </button>
                                    );
                                }

                                // ── TURNO BLOQUEADO ──
                                if (booking.status === 'blocked') {
                                    return (
                                        <div key={court.id} className="rounded-2xl p-3 border-2 border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20">
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{court.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Lock size={10} className="text-red-500" />
                                                <p className="text-xs font-black text-red-500">Bloqueado</p>
                                            </div>
                                            {booking.notes && <p className="text-[9px] text-red-400 mt-1 truncate">{booking.notes}</p>}
                                            <button
                                                onClick={() => onCancelBooking(booking.id)}
                                                className="text-[9px] text-red-400 hover:text-red-600 font-bold mt-1"
                                            >
                                                Desbloquear
                                            </button>
                                        </div>
                                    );
                                }

                                // ── MATCHMAKING ──
                                if (booking.status === 'matchmaking' && match) {
                                    const pct = (match.playerIds.length / match.totalPlayers) * 100;
                                    return (
                                        <div key={court.id} className="rounded-2xl p-3 border-2 border-emerald-500 bg-white dark:bg-slate-800 shadow-lg shadow-emerald-500/10">
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{court.name}</p>
                                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">Matchmaking</p>
                                            <div className="mt-2">
                                                <div className="flex justify-between text-[9px] font-bold mb-1">
                                                    <span className="text-emerald-600">{match.playerIds.length}/{match.totalPlayers}</span>
                                                    <span className="text-slate-400">Faltan {match.totalPlayers - match.playerIds.length}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                // ── RESERVA NORMAL ──
                                return (
                                    <div key={court.id} className="rounded-2xl p-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{court.name}</p>
                                        <p className="text-xs font-black text-slate-700 dark:text-white mt-0.5 truncate">{booking.clientName}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <button
                                                onClick={() => onTogglePaid(booking.id)}
                                                className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg transition-all ${booking.paid
                                                    ? 'bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400'
                                                    }`}
                                            >
                                                {booking.paid ? <><Check size={10} /> Pagado</> : <><DollarSign size={10} /> Pendiente</>}
                                            </button>
                                            {booking.clientPhone && (
                                                <a
                                                    href={`https://wa.me/${booking.clientPhone.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg bg-emerald-600 text-white active:scale-95 transition-transform"
                                                >
                                                    <Phone size={11} />
                                                </a>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onCancelBooking(booking.id)}
                                            className="text-[9px] text-red-400 hover:text-red-600 font-bold mt-1.5 flex items-center gap-0.5"
                                        >
                                            <X size={10} /> Cancelar
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── MODAL DE NUEVO TURNO ── */}
            {bookingModal && (
                <BookingFormModal
                    court={bookingModal.court}
                    date={bookingModal.date}
                    time={bookingModal.time}
                    onClose={() => setBookingModal(null)}
                    onCreate={onCreateBooking}
                />
            )}

            {/* ── FAB ── */}
            <button
                onClick={() => setBookingModal({ court: courts[0], date: dateStr, time: '18:00' })}
                className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 dark:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-slate-900 z-50"
            >
                <PlusCircle size={24} />
            </button>
        </div>
    );
};
