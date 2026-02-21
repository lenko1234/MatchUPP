import React, { useState } from 'react';
import { MapPin, Clock, Star, ChevronRight, Search, SlidersHorizontal, X, Check, DollarSign, ArrowLeft } from 'lucide-react';
import { generateTimeSlots } from '../../data/mockData';

const formatARS = (n) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// ── Sub-vista: Detalle de un complejo con grilla de disponibilidad ──
const ComplexDetail = ({ complex, courts, bookings, matches, currentUser, onBook, onJoinMatch, onBack }) => {
    const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
    const timeSlots = generateTimeSlots(complex.openTime, complex.closeTime);

    const getBooking = (courtId, time) =>
        bookings.find(b => b.courtId === courtId && b.time === time && b.date === selectedDate) || null;

    const complexCourts = courts.filter(c => c.complexId === complex.id);

    return (
        <div className="min-h-screen pb-32 animate-in slide-in-from-right duration-300 bg-slate-50 dark:bg-slate-900">

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="p-4 pt-10 flex items-center gap-3">
                    <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="flex-1">
                        <h2 className="font-black text-slate-800 dark:text-white">{complex.name}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin size={10} /> {complex.address}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">{formatARS(complex.pricePerHour)}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">por hora</p>
                    </div>
                </div>

                {/* Info strips */}
                <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl whitespace-nowrap">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{complex.rating} ({complex.reviewCount} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl whitespace-nowrap">
                        <Clock size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{complex.openTime} – {complex.closeTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-600/20 px-3 py-1.5 rounded-xl whitespace-nowrap">
                        <DollarSign size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Seña {formatARS(complex.depositAmount)}</span>
                    </div>
                </div>
            </div>

            {/* Leyenda */}
            <div className="px-4 pt-4 pb-2 flex gap-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Libre</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Ocupado</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-600" />
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Matchmaking</span>
                </div>
            </div>

            {/* Grilla */}
            <div className="px-4 space-y-2">
                {timeSlots.map((time) => (
                    <div key={time}>
                        <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 w-10">{time}</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        </div>

                        <div className={`grid gap-2 ${complexCourts.length === 1 ? 'grid-cols-1' : complexCourts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {complexCourts.map(court => {
                                const booking = getBooking(court.id, time);
                                const matchForSlot = booking?.matchId ? matches.find(m => m.id === booking.matchId) : null;
                                const isJoined = matchForSlot?.playerIds?.includes(currentUser?.id);
                                const isFull = matchForSlot && matchForSlot.playerIds.length >= matchForSlot.totalPlayers;

                                if (!booking) {
                                    return (
                                        <button
                                            key={court.id}
                                            onClick={() => onBook({ court, time, date: selectedDate, complex })}
                                            className="rounded-2xl p-3 border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-600/10 hover:border-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-600/20 transition-all group text-left active:scale-95"
                                        >
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{court.name}</p>
                                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">Disponible</p>
                                            <p className="text-[9px] text-emerald-500 mt-1">Toca para reservar</p>
                                        </button>
                                    );
                                }

                                if (booking.status === 'matchmaking' && matchForSlot) {
                                    const pct = (matchForSlot.playerIds.length / matchForSlot.totalPlayers) * 100;
                                    return (
                                        <button
                                            key={court.id}
                                            onClick={() => !isJoined && !isFull && onJoinMatch(matchForSlot.id)}
                                            className={`rounded-2xl p-3 border-2 border-emerald-500 bg-white dark:bg-slate-800 text-left transition-all active:scale-95 ${isFull ? 'opacity-60' : 'hover:bg-emerald-50 dark:hover:bg-emerald-600/10'}`}
                                        >
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{court.name}</p>
                                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                {isJoined ? '✓ Anotado' : isFull ? 'Completo' : 'Matchmaking'}
                                            </p>
                                            <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                                                {matchForSlot.playerIds.length}/{matchForSlot.totalPlayers} jugadores
                                            </p>
                                        </button>
                                    );
                                }

                                return (
                                    <div key={court.id} className="rounded-2xl p-3 border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 opacity-60">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{court.name}</p>
                                        <p className="text-xs font-black text-slate-500 dark:text-slate-400 mt-0.5">Ocupado</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Modal para elegir tipo de reserva
const BookingTypeModal = ({ slot, onClose, onPrivate, onPublic }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {slot?.court?.name} — {slot?.time} hs
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">¿Qué tipo de reserva querés hacer?</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                    <X size={20} className="text-slate-400" />
                </button>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onPrivate}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-600/10 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">👥</div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600">Reserva Privada</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Jugás con tus amigos. Compartís el link para que se sumen.</p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={onPublic}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-600/10 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">🌍</div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600">Partido Público</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Se muestra a todos los jugadores de la zona. Se completan los lugares solos.</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </div>
);

// ── Vista principal: Lista de Complejos ──
export const PlayerSearchView = ({
    complexes = [],
    courts = [],
    bookings = [],
    matches = [],
    currentUser,
    onCreateBooking,
    onJoinMatch,
    onOpenCreateMatchModal,
}) => {
    const [selectedComplex, setSelectedComplex] = useState(null);
    const [bookingSlot, setBookingSlot] = useState(null); // { court, time, date, complex }
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = complexes.filter(cx =>
        cx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cx.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBook = (slot) => setBookingSlot(slot);

    const handlePrivateBooking = () => {
        if (!bookingSlot) return;
        onOpenCreateMatchModal({
            courtId: bookingSlot.court.id,
            complexId: bookingSlot.complex.id,
            date: bookingSlot.date,
            time: bookingSlot.time,
            price: bookingSlot.complex.pricePerHour / 10,
            city: bookingSlot.complex.city,
            type: 'private'
        });
        setBookingSlot(null);
    };

    const handlePublicMatch = () => {
        if (!bookingSlot) return;
        onOpenCreateMatchModal({
            courtId: bookingSlot.court.id,
            complexId: bookingSlot.complex.id,
            date: bookingSlot.date,
            time: bookingSlot.time,
            price: bookingSlot.complex.pricePerHour / 10,
            city: bookingSlot.complex.city,
            type: 'public',
        });
        setBookingSlot(null);
    };

    if (selectedComplex) {
        return (
            <>
                <ComplexDetail
                    complex={selectedComplex}
                    courts={courts}
                    bookings={bookings}
                    matches={matches}
                    currentUser={currentUser}
                    onBook={handleBook}
                    onJoinMatch={onJoinMatch}
                    onBack={() => setSelectedComplex(null)}
                />
                {bookingSlot && (
                    <BookingTypeModal
                        slot={bookingSlot}
                        onClose={() => setBookingSlot(null)}
                        onPrivate={handlePrivateBooking}
                        onPublic={handlePublicMatch}
                    />
                )}
            </>
        );
    }

    return (
        <div className="min-h-screen pb-28 animate-in fade-in duration-500">
            {/* Header */}
            <header className="p-5 pt-8 bg-white dark:bg-slate-800 rounded-b-[2rem] border-b border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Buscar Canchas</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Reservá o unite a un partido</p>
                </div>
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre o ciudad..."
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm font-medium"
                    />
                </div>
            </header>

            {/* Lista de complejos */}
            <div className="p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {filtered.length} complejo{filtered.length !== 1 ? 's' : ''} disponibles
                </p>

                {filtered.map(complex => {
                    const complexCourts = courts.filter(c => c.complexId === complex.id);
                    const today = new Date().toISOString().split('T')[0];
                    const todayBookings = bookings.filter(b =>
                        complexCourts.some(c => c.id === b.courtId) && b.date === today
                    );
                    const slots = generateTimeSlots(complex.openTime, complex.closeTime);
                    const availableSlots = slots.length * complexCourts.length - todayBookings.length;

                    return (
                        <button
                            key={complex.id}
                            onClick={() => setSelectedComplex(complex)}
                            className="w-full p-4 rounded-3xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/50 active:scale-[0.98] transition-all text-left shadow-sm space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-black text-slate-800 dark:text-white">{complex.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                        <MapPin size={11} /> {complex.address}
                                    </p>
                                </div>
                                <ChevronRight size={20} className="text-slate-400 dark:text-slate-500 mt-1 shrink-0" />
                            </div>

                            <div className="flex gap-2">
                                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-xl">
                                    <Star size={11} className="text-amber-400 fill-amber-400" />
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{complex.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-xl">
                                    <Clock size={11} className="text-slate-500 dark:text-slate-400" />
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{complex.openTime}–{complex.closeTime}</span>
                                </div>
                                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl ${availableSlots > 0 ? 'bg-emerald-50 dark:bg-emerald-600/20' : 'bg-slate-50 dark:bg-slate-900'}`}>
                                    <Check size={11} className={availableSlots > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
                                    <span className={`text-[11px] font-bold ${availableSlots > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {availableSlots} turnos libres
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-xs text-slate-500 dark:text-slate-400">{complexCourts.length} cancha{complexCourts.length !== 1 ? 's' : ''}</span>
                                <span className="text-sm font-black text-emerald-600">{formatARS(complex.pricePerHour)}<span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">/hora</span></span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
