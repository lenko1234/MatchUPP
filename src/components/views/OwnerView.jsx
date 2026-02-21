import React from 'react';
import { Bell, PlusCircle, Users, Wallet, ShieldCheck, TrendingUp, Clock, MapPin, Check, DollarSign, X } from 'lucide-react';

// Helpers
const formatARS = (amount) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);

const STATUS_CONFIG = {
    reserved: { label: 'Reservado', bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300' },
    matchmaking: { label: 'Matchmaking', bg: 'bg-emerald-50 dark:bg-emerald-600/20', text: 'text-emerald-700 dark:text-emerald-400' },
    blocked: { label: 'Bloqueado', bg: 'bg-red-50 dark:bg-red-600/20', text: 'text-red-600 dark:text-red-400' },
    available: { label: 'Libre', bg: 'bg-emerald-50/50 dark:bg-emerald-600/10', text: 'text-emerald-600 dark:text-emerald-400' },
};

export const OwnerView = ({ courts = [], bookings = [], matches = [], balance = {}, complex = {}, onCreateBooking, onTogglePaid }) => {

    // Agrupar los bookings de hoy para mostrarlos en el dashboard
    const todayReserved = bookings.filter(b => b.status === 'reserved');
    const todayMatchmaking = bookings.filter(b => b.status === 'matchmaking');
    const pendingPayment = bookings.filter(b => b.status === 'reserved' && b.paid === false);

    return (
        <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-28">

            {/* ── HEADER ── */}
            <header className="flex justify-between items-center pt-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Hola, <span className="text-emerald-600">{complex.name || 'Mi Complejo'}</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gestión de tus canchas</p>
                </div>
                <div className="p-2 rounded-full relative bg-emerald-100 dark:bg-emerald-600/20">
                    <Bell size={20} className="text-emerald-700 dark:text-emerald-400" />
                    {pendingPayment.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[9px] font-bold text-white flex items-center justify-center">
                            {pendingPayment.length}
                        </span>
                    )}
                </div>
            </header>

            {/* ── BALANCE DINÁMICO ── */}
            <section className="grid grid-cols-3 gap-3">
                <div className="col-span-2 p-4 rounded-2xl shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Ingresos de hoy</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{formatARS(balance.today || 0)}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <TrendingUp size={12} className="text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-bold">
                            {todayReserved.length} turnos reservados
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="p-3 rounded-2xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Matchmaking</p>
                        <p className="text-lg font-black text-emerald-600">{todayMatchmaking.length}</p>
                    </div>
                    <div className="p-3 rounded-2xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Pendientes</p>
                        <p className={`text-lg font-black ${pendingPayment.length > 0 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                            {pendingPayment.length}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── ACCIONES RÁPIDAS ── */}
            <section className="flex gap-4 overflow-x-auto pb-2">
                <button
                    onClick={onCreateBooking}
                    className="flex flex-col items-center gap-2 min-w-[80px] group"
                >
                    <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                        <PlusCircle size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400">Crear</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px] group">
                    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-all">
                        <Users size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400">Jugadores</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px] group">
                    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-all">
                        <Wallet size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400">Precios</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px] group">
                    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-all">
                        <ShieldCheck size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400">Permisos</span>
                </button>
            </section>

            {/* ── TURNOS DE HOY ── */}
            <section className="space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 dark:text-white">Turnos de Hoy</h2>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{bookings.length} total</span>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                        <MapPin size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No hay turnos para hoy</p>
                        <p className="text-xs mt-1">Tocá "Crear" para agregar</p>
                    </div>
                ) : (
                    bookings
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((booking) => {
                            const court = courts.find(c => c.id === booking.courtId);
                            const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.available;

                            return (
                                <div key={booking.id} className="p-4 rounded-3xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 space-y-3">
                                    <div className="flex items-center justify-between">
                                        {/* Hora + Cancha */}
                                        <div className="flex gap-3 items-center">
                                            <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <Clock size={14} className="text-emerald-600 mb-0.5" />
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-200 leading-none">{booking.time}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white">
                                                    {booking.status === 'matchmaking' ? 'Partido Público' :
                                                        booking.status === 'blocked' ? 'Bloqueado' :
                                                            booking.clientName || 'Sin nombre'}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{court?.name || '—'}</p>
                                            </div>
                                        </div>

                                        {/* Badge de estado */}
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${cfg.bg} ${cfg.text}`}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* Acciones rápidas de pago */}
                                    {booking.status === 'reserved' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onTogglePaid(booking.id)}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${booking.paid
                                                    ? 'bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                    }`}
                                            >
                                                {booking.paid
                                                    ? <><Check size={14} /> Pagado</>
                                                    : <><DollarSign size={14} /> Marcar Pagado</>
                                                }
                                            </button>
                                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                <span>{formatARS(booking.price || 0)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                )}
            </section>
        </div>
    );
};
