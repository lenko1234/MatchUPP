import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Calendar, PlusCircle, MessageSquare, Settings } from 'lucide-react';

// Hooks
import { useTheme } from './hooks/useTheme';

// UI Components
import { ToastContainer } from './components/ui/Toast';

// Modal Components
import { CreateMatchModal } from './components/modals/CreateMatchModal';
import { OwnerCreateMatchModal } from './components/modals/OwnerCreateMatchModal';
import { AssignCourtModal } from './components/modals/AssignCourtModal';
import { RatingModal } from './components/modals/RatingModal';

// View Components
import { OwnerView } from './components/views/OwnerView';
import { PlayerView } from './components/views/PlayerView';
import { OwnerScheduleView } from './components/views/OwnerScheduleView';
import { PlayerSearchView } from './components/views/PlayerSearchView';
import { ChatView } from './components/views/ChatView';
import { SettingsView } from './components/views/SettingsView';

// Mock Data — TODO Firebase: reemplazar con listeners de Firestore
import {
    MOCK_BOOKINGS,
    MOCK_MATCHES,
    MOCK_COURTS,
    MOCK_COMPLEXES,
    CURRENT_USER,
} from './data/mockData';

// =============================================================
//  APP PRINCIPAL — ORQUESTADOR DE ESTADO GLOBAL
//  ─────────────────────────────────────────────────────────────
//  • Toda la mutación de datos vive aquí (CRUD functions).
//  • Las vistas son "tontas": reciben props, disparan callbacks.
//  • Migración a Firebase: useState(MOCK_X) → useFirestoreCollection
//    y los handlers → addDoc / updateDoc / deleteDoc.
// =============================================================

const App = () => {
    const { theme, setTheme } = useTheme();

    // ─── NAVEGACIÓN ────────────────────────────────────────────
    const [role, setRole] = useState(CURRENT_USER.role); // 'player' | 'owner'
    const [activeTab, setActiveTab] = useState('inicio');

    // ─── DATOS GLOBALES ─────────────────────────────────────────
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [matches, setMatches] = useState(MOCK_MATCHES);
    const [courts] = useState(MOCK_COURTS);
    const [complexes] = useState(MOCK_COMPLEXES);

    // ─── USUARIO ACTIVO ──────────────────────────────────────────
    const [currentUser, setCurrentUser] = useState(CURRENT_USER);

    // ─── ESTADO DE UI ──────────────────────────────────────────
    const [toasts, setToasts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createModalData, setCreateModalData] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [chatMatchId, setChatMatchId] = useState(null); // para navegar directo al chat

    // =========================================================
    //  TOASTS
    // =========================================================
    const addToast = (message, type = 'info') =>
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    const removeToast = (id) =>
        setToasts(prev => prev.filter(t => t.id !== id));

    // =========================================================
    //  BOOKINGS (RESERVAS)
    //  TODO Firebase: addDoc / updateDoc / deleteDoc
    // =========================================================

    const handleCreateBooking = (data) => {
        const newBooking = {
            id: `b${Date.now()}`,
            complexId: complexes[0].id,
            paid: data.status === 'blocked' ? null : false,
            matchId: null,
            clientId: null,
            ...data,
        };
        setBookings(prev => [...prev, newBooking]);
        addToast('✅ Turno creado correctamente', 'success');
    };

    const handleTogglePaid = (bookingId) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, paid: !b.paid } : b
        ));
        addToast('💰 Estado de pago actualizado', 'success');
    };

    const handleCancelBooking = (bookingId) => {
        const booking = bookings.find(b => b.id === bookingId);
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        if (booking?.matchId) {
            setMatches(prev => prev.filter(m => m.id !== booking.matchId));
        }
        addToast('🗑️ Turno cancelado', 'info');
    };

    // =========================================================
    //  MATCHMAKING
    //  TODO Firebase: addDoc / updateDoc en 'matches' y 'bookings'
    // =========================================================

    const handleCreateMatch = (formData) => {
        const matchId = `m${Date.now()}`;
        const bookingId = `b${Date.now() + 1}`;

        const newMatch = {
            id: matchId,
            bookingId,
            complexId: formData.complexId || complexes[0].id,
            courtId: formData.courtId || null,
            date: formData.date || new Date().toISOString().split('T')[0],
            time: formData.time || '00:00',
            type: formData.type || 'public',
            gender: formData.gender || 'mixto',
            minRanking: formData.minRanking || 1,
            minAge: formData.minAge || 0,
            maxAge: formData.maxAge || 99,
            totalPlayers: formData.totalPlayers || 10,
            playerIds: [currentUser.id],
            createdBy: currentUser.id,
            status: 'open',
            price: parseFloat(formData.price) || 0,
            city: formData.city || currentUser.city,
        };

        // Crear el booking asociado si viene con cancha asignada
        if (formData.courtId) {
            const newBooking = {
                id: bookingId,
                courtId: formData.courtId,
                complexId: newMatch.complexId,
                date: newMatch.date,
                time: newMatch.time,
                status: 'matchmaking',
                clientName: null,
                clientPhone: null,
                clientId: currentUser.id,
                price: newMatch.price * newMatch.totalPlayers,
                paid: null,
                notes: '',
                matchId,
            };
            setBookings(prev => [newBooking, ...prev]);
        }

        setMatches(prev => [newMatch, ...prev]);
        // ⚠️  NO llamamos setShowCreateModal(false) aquí.
        // El modal maneja su propio cierre:
        //   - partido público  → llama onClose() él mismo al hacer submit
        //   - partido privado  → muestra la pantalla de link primero,
        //                        y el usuario cierra cuando quiere.
        if (formData.type !== 'private') {
            addToast('⚽ ¡Partido publicado! Ya aparece en la lista', 'success');
        }
    };

    const handleJoinMatch = (matchId) => {
        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        if (match.playerIds.length >= match.totalPlayers) {
            addToast('El partido está completo', 'error'); return;
        }
        if (currentUser.ranking < match.minRanking) {
            addToast(`Necesitás Nivel ${match.minRanking}★ para entrar`, 'error'); return;
        }
        if (match.playerIds.includes(currentUser.id)) {
            addToast('Ya estás anotado', 'info'); return;
        }

        setMatches(prev => prev.map(m =>
            m.id === matchId
                ? { ...m, playerIds: [...m.playerIds, currentUser.id] }
                : m
        ));
        addToast('🏃 ¡Te uniste al partido!', 'success');
    };

    const handleLeaveMatch = (matchId) => {
        setMatches(prev => prev.map(m =>
            m.id === matchId
                ? { ...m, playerIds: m.playerIds.filter(id => id !== currentUser.id) }
                : m
        ));
        addToast('Saliste del partido', 'info');
    };

    const handleAssignCourt = (matchId, courtId) => {
        const court = courts.find(c => c.id === courtId);
        setMatches(prev => prev.map(m =>
            m.id === matchId ? { ...m, courtId, status: 'full' } : m
        ));
        addToast(`✅ ${court?.name || 'Cancha'} asignada`, 'success');
        setShowAssignModal(null);
    };

    // =========================================================
    //  RATING POST-PARTIDO
    // =========================================================
    const handleSubmitRating = (ratings) => {
        // TODO Firebase: iterar los ratings y escribir en Firestore
        // por ahora solo mostramos el toast de éxito (el modal ya muestra animación interna)
        addToast('⭐ ¡Valoraciones enviadas!', 'success');
        setShowRatingModal(false);
    };

    // =========================================================
    //  DATOS DERIVADOS (computed) — a futuro: Firestore queries
    // =========================================================

    const joinedMatchIds = useMemo(() =>
        matches.filter(m => m.playerIds.includes(currentUser.id)).map(m => m.id),
        [matches, currentUser.id]
    );

    const playerVisibleMatches = useMemo(() =>
        matches.filter(m =>
            m.status === 'open' &&
            (m.type === 'public' || m.playerIds.includes(currentUser.id))
        ),
        [matches, currentUser.id]
    );

    const ownerBalance = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return {
            today: bookings
                .filter(b => b.date === today && b.paid === true)
                .reduce((sum, b) => sum + (b.price || 0), 0),
            weekly: bookings
                .filter(b => b.paid === true)
                .reduce((sum, b) => sum + (b.price || 0), 0),
        };
    }, [bookings]);

    const todayBookings = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter(b => b.date === today);
    }, [bookings]);

    // =========================================================
    //  NAVEGACIÓN A CHAT (desde tarjeta de partido)
    // =========================================================
    const handleOpenChat = (matchId) => {
        setChatMatchId(matchId);
        setActiveTab('chat');
    };

    // =========================================================
    //  RENDERIZADO DE VISTAS
    // =========================================================
    const renderView = () => {
        // ── AJUSTES (ambos roles) ──
        if (activeTab === 'perfil') {
            return <SettingsView theme={theme} setTheme={setTheme} user={currentUser} />;
        }

        // ── CHAT (ambos roles) ──
        if (activeTab === 'chat') {
            return (
                <ChatView
                    matches={matches}
                    joinedMatchIds={joinedMatchIds}
                    currentUser={currentUser}
                    initialMatchId={chatMatchId}
                />
            );
        }

        // ──────────── OWNER ────────────
        if (role === 'owner') {
            if (activeTab === 'buscar') {
                return (
                    <OwnerScheduleView
                        courts={courts}
                        bookings={bookings}
                        matches={matches}
                        complex={complexes[0]}
                        onCreateBooking={handleCreateBooking}
                        onTogglePaid={handleTogglePaid}
                        onCancelBooking={handleCancelBooking}
                        onCreateMatch={handleCreateMatch}
                        onShowAssignModal={setShowAssignModal}
                    />
                );
            }
            return (
                <OwnerView
                    courts={courts}
                    bookings={todayBookings}
                    matches={matches}
                    balance={ownerBalance}
                    complex={complexes[0]}
                    onCreateBooking={() => setShowCreateModal(true)}
                    onTogglePaid={handleTogglePaid}
                />
            );
        }

        // ──────────── PLAYER ────────────
        if (activeTab === 'buscar') {
            return (
                <PlayerSearchView
                    complexes={complexes}
                    courts={courts}
                    bookings={bookings}
                    matches={matches}
                    currentUser={currentUser}
                    onCreateBooking={handleCreateBooking}
                    onJoinMatch={handleJoinMatch}
                    onOpenCreateMatchModal={(data) => {
                        setCreateModalData(data);
                        setShowCreateModal(true);
                    }}
                />
            );
        }

        return (
            <PlayerView
                matches={playerVisibleMatches}
                joinedMatchIds={joinedMatchIds}
                userProfile={currentUser}
                onJoin={handleJoinMatch}
                onLeave={handleLeaveMatch}
                onCreateMatch={() => {
                    setCreateModalData(null);
                    setShowCreateModal(true);
                }}
                onOpenChat={handleOpenChat}
                onOpenRating={() => setShowRatingModal(true)}
            />
        );
    };

    return (
        <div className="max-w-md mx-auto min-h-screen font-sans relative shadow-2xl overflow-hidden border-x border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">

            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* ── MODALES ── */}
            {showCreateModal && role === 'player' && (
                <CreateMatchModal
                    initialData={createModalData}
                    onClose={() => {
                        setShowCreateModal(false);
                        setCreateModalData(null);
                    }}
                    onCreate={handleCreateMatch}
                    userRanking={currentUser.ranking}
                />
            )}
            {showCreateModal && role === 'owner' && (
                <OwnerCreateMatchModal
                    courts={courts}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateMatch}
                />
            )}
            {showAssignModal && (
                <AssignCourtModal
                    match={showAssignModal}
                    courts={courts}
                    onClose={() => setShowAssignModal(null)}
                    onAssign={handleAssignCourt}
                />
            )}
            {showRatingModal && (
                <RatingModal
                    onClose={() => setShowRatingModal(false)}
                    onSubmit={handleSubmitRating}
                />
            )}

            {/* ── SWITCHER DE ROL (Demo — reemplazar con Firebase Auth) ── */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-1 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex gap-1">
                <button
                    onClick={() => { setRole('player'); setActiveTab('inicio'); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${role === 'player' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Jugador
                </button>
                <button
                    onClick={() => { setRole('owner'); setActiveTab('inicio'); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${role === 'owner' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Dueño
                </button>
            </div>

            {/* ── CONTENIDO PRINCIPAL ── */}
            <main className="pt-10">
                {renderView()}
            </main>

            {/* ── TAB BAR ── */}
            <nav className="fixed bottom-0 w-full max-w-md backdrop-blur-xl border-t px-8 py-4 flex justify-between items-center z-40 transition-colors duration-300 bg-white/90 dark:bg-slate-800/90 border-slate-100 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('inicio')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'inicio' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    <LayoutDashboard size={22} />
                    <span className="text-[10px] font-bold">Inicio</span>
                </button>
                <button
                    onClick={() => setActiveTab('buscar')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'buscar' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    <Calendar size={22} />
                    <span className="text-[10px] font-bold">{role === 'owner' ? 'Agenda' : 'Buscar'}</span>
                </button>

                <div className="relative -top-4">
                    <button
                        onClick={() => {
                            setCreateModalData(null);
                            setShowCreateModal(true);
                        }}
                        className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-600/20 active:scale-90 transition-all ring-4 ring-slate-50 dark:ring-slate-900"
                    >
                        <PlusCircle size={28} />
                    </button>
                </div>

                <button
                    onClick={() => { setChatMatchId(null); setActiveTab('chat'); }}
                    className={`flex flex-col items-center gap-1 transition-colors relative ${activeTab === 'chat' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    <MessageSquare size={22} />
                    {joinedMatchIds.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                            {joinedMatchIds.length}
                        </span>
                    )}
                    <span className="text-[10px] font-bold">Mensajes</span>
                </button>
                <button
                    onClick={() => setActiveTab('perfil')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'perfil' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    <Settings size={22} />
                    <span className="text-[10px] font-bold">Ajustes</span>
                </button>
            </nav>
        </div>
    );
};

export default App;