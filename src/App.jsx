import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Wallet,
    Settings,
    Search,
    MessageSquare,
    ShieldCheck,
    PlusCircle,
    TrendingUp,
    MapPin,
    Clock,
    Lock,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Bell,
    DollarSign,
    Phone,
    X,
    Check,
    AlertCircle,
    Star,
    Link as LinkIcon,
    Copy
} from 'lucide-react';

// ========== SISTEMA DE TOASTS ==========
const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-amber-600 text-white',
        info: 'bg-blue-600 text-white'
    };

    return (
        <div className={`${styles[type]} px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300`}>
            <span className="font-bold text-sm">{message}</span>
            <button onClick={onClose} className="ml-2">
                <X size={16} />
            </button>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] space-y-2 w-full max-w-md px-4">
        {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
    </div>
);

// ========== COMPONENTE DE BARRA DE PROGRESO ==========
const MatchmakingBar = ({ current, max }) => {
    const percentage = (current / max) * 100;
    const isFull = current === max;

    return (
        <div className="w-full mt-2">
            <div className="flex justify-between text-xs mb-1 text-slate-500 font-medium">
                <span>{current} / {max} Jugadores</span>
                <span>{isFull ? '¡Listo!' : `Faltan ${max - current}`}</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${percentage < 50 ? 'bg-slate-400' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// ========== MODAL CREAR PARTIDO (JUGADOR) ==========
const CreateMatchModal = ({ onClose, onCreate, userRanking }) => {
    const [formData, setFormData] = useState({
        city: '',
        gender: 'mixto',
        minAge: '',
        maxAge: '',
        minRanking: 1,
        totalPlayers: 10
    });

    const cities = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.city) return;
        onCreate(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Crear Partido</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Ciudad */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad</label>
                        <select
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                            required
                        >
                            <option value="">Seleccioná una ciudad</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Género */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Género</label>
                        <div className="flex gap-2">
                            {['mixto', 'masculino', 'femenino'].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: g })}
                                    className={`flex-1 py-2 rounded-xl font-bold text-sm capitalize ${formData.gender === g
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Edad */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Edad Mín.</label>
                            <input
                                type="number"
                                value={formData.minAge}
                                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                                placeholder="18"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Edad Máx.</label>
                            <input
                                type="number"
                                value={formData.maxAge}
                                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                                placeholder="50"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Ranking Mínimo */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nivel Mínimo</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(rank => (
                                <button
                                    key={rank}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, minRanking: rank })}
                                    className={`flex-1 py-3 rounded-xl font-bold ${formData.minRanking === rank
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {rank}★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Jugadores */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Total de Jugadores</label>
                        <select
                            value={formData.totalPlayers}
                            onChange={(e) => setFormData({ ...formData, totalPlayers: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                        >
                            <option value={6}>6 (3 vs 3)</option>
                            <option value={8}>8 (4 vs 4)</option>
                            <option value={10}>10 (5 vs 5)</option>
                            <option value={12}>12 (6 vs 6)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
                    >
                        Crear Partido
                    </button>
                </form>
            </div>
        </div>
    );
};

// ========== MODAL CREAR PARTIDO (DUEÑO) ==========
const OwnerCreateMatchModal = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        court: '',
        time: '',
        type: 'public',
        gender: 'mixto',
        minAge: '',
        maxAge: '',
        minRanking: 1,
        totalPlayers: 10,
        price: ''
    });

    const [shareLink, setShareLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMatch = {
            ...formData,
            id: Date.now(),
            players: 0,
            status: 'active'
        };

        if (formData.type === 'private') {
            const link = `https://matchup.app/partido/${newMatch.id}`;
            setShareLink(link);
        } else {
            onCreate(newMatch);
            onClose();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
    };

    const shareWhatsApp = () => {
        const message = `¡Unite al partido! ${shareLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (shareLink) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <Check size={32} className="text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">¡Partido Creado!</h2>
                        <p className="text-sm text-slate-600">Compartí este link para que se sumen</p>

                        <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300">
                            <p className="text-xs text-slate-600 break-all font-mono">{shareLink}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <Copy size={18} />
                                Copiar
                            </button>
                            <button
                                onClick={shareWhatsApp}
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <Phone size={18} />
                                WhatsApp
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full text-slate-600 py-2 font-bold"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Crear Partido Rápido</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Partido</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'public' })}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${formData.type === 'public'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                <Users size={18} />
                                Público
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'private' })}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${formData.type === 'private'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                <Lock size={18} />
                                Privado
                            </button>
                        </div>
                    </div>

                    {/* Cancha y Hora */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cancha</label>
                            <select
                                value={formData.court}
                                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                                required
                            >
                                <option value="">Elegir</option>
                                <option value="Cancha 1">Cancha 1</option>
                                <option value="Cancha 2">Cancha 2</option>
                                <option value="Cancha 3">Cancha 3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Hora</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                                required
                            />
                        </div>
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Precio por Persona</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="1500"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                            required
                        />
                    </div>

                    {/* Género */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Género</label>
                        <div className="flex gap-2">
                            {['mixto', 'masculino', 'femenino'].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: g })}
                                    className={`flex-1 py-2 rounded-xl font-bold text-sm capitalize ${formData.gender === g
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Edad */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Edad Mín.</label>
                            <input
                                type="number"
                                value={formData.minAge}
                                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                                placeholder="18"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Edad Máx.</label>
                            <input
                                type="number"
                                value={formData.maxAge}
                                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                                placeholder="50"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Ranking */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nivel Mínimo</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(rank => (
                                <button
                                    key={rank}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, minRanking: rank })}
                                    className={`flex-1 py-3 rounded-xl font-bold ${formData.minRanking === rank
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {rank}★
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
                    >
                        {formData.type === 'private' ? 'Crear y Generar Link' : 'Crear Partido'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ========== MODAL ASIGNAR CANCHA ==========
const AssignCourtModal = ({ match, onClose, onAssign }) => {
    const [courtNumber, setCourtNumber] = useState('');

    const handleAssign = () => {
        if (courtNumber) {
            onAssign(match.id, courtNumber);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm mx-4 rounded-3xl p-6 space-y-4 animate-in zoom-in duration-300">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                        <Bell size={32} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">¡Partido Listo!</h2>
                    <p className="text-sm text-slate-600">
                        El partido llegó a 5 jugadores. Asigná una cancha.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Número de Cancha</label>
                    <select
                        value={courtNumber}
                        onChange={(e) => setCourtNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none font-medium"
                    >
                        <option value="">Seleccionar cancha</option>
                        <option value="Cancha 1">Cancha 1</option>
                        <option value="Cancha 2">Cancha 2</option>
                        <option value="Cancha 3">Cancha 3</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold"
                    >
                        Después
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!courtNumber}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Asignar
                    </button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [role, setRole] = useState('player'); // 'player' o 'owner'
    const [activeTab, setActiveTab] = useState('inicio');
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedCourt, setSelectedCourt] = useState('all');

    // Estados para funcionalidad
    const [toasts, setToasts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(null);
    const [matches, setMatches] = useState([
        { id: 1, court: "Cancha El Diez", city: "Buenos Aires", time: "19:00", type: "Público", players: 8, total: 10, price: 1500, status: "active", minRanking: 2, gender: "mixto" },
        { id: 2, court: "Predio Central", city: "Córdoba", time: "21:30", type: "Privado", players: 4, total: 10, price: 2000, status: "locked", minRanking: 3, gender: "masculino" },
        { id: 3, court: "La Bombonerita", city: "Buenos Aires", time: "23:00", type: "Público", players: 10, total: 10, price: 1200, status: "full", minRanking: 1, gender: "mixto" },
    ]);
    const [joinedMatches, setJoinedMatches] = useState([]);

    // Perfil del usuario (simulado)
    const userProfile = {
        name: 'Leo',
        ranking: 3,
        age: 25,
        gender: 'masculino'
    };

    // Sistema de Toasts
    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Crear partido
    const handleCreateMatch = (formData) => {
        const newMatch = {
            id: Date.now(),
            court: "Por Confirmar",
            city: formData.city,
            time: "Por Confirmar",
            type: "Público",
            players: 1,
            total: formData.totalPlayers,
            price: 0,
            status: "active",
            minRanking: formData.minRanking,
            gender: formData.gender,
            minAge: formData.minAge,
            maxAge: formData.maxAge,
            createdBy: userProfile.name
        };

        setMatches(prev => [newMatch, ...prev]);
        setJoinedMatches(prev => [...prev, newMatch.id]);
        addToast('¡Partido creado exitosamente!', 'success');
    };

    // Unirse a partido
    const handleJoinMatch = (matchId) => {
        const match = matches.find(m => m.id === matchId);

        // Validaciones
        if (match.players >= match.total) {
            addToast('El partido está completo', 'error');
            return;
        }

        if (userProfile.ranking < match.minRanking) {
            addToast(`No cumplís con el nivel mínimo requerido (${match.minRanking}★)`, 'error');
            return;
        }

        if (joinedMatches.includes(matchId)) {
            addToast('Ya estás en este partido', 'warning');
            return;
        }

        // Unirse
        setMatches(prev => prev.map(m =>
            m.id === matchId
                ? { ...m, players: m.players + 1 }
                : m
        ));
        setJoinedMatches(prev => [...prev, matchId]);
        addToast('¡Te uniste al partido!', 'success');

        // Notificar al dueño si llega a 5
        const updatedMatch = matches.find(m => m.id === matchId);
        if (updatedMatch && updatedMatch.players + 1 === 5 && role === 'owner') {
            setTimeout(() => {
                setShowAssignModal(updatedMatch);
            }, 500);
        }
    };

    // Salir de partido
    const handleLeaveMatch = (matchId) => {
        setMatches(prev => prev.map(m =>
            m.id === matchId
                ? { ...m, players: Math.max(0, m.players - 1) }
                : m
        ));
        setJoinedMatches(prev => prev.filter(id => id !== matchId));
        addToast('Saliste del partido', 'info');
    };

    // Asignar cancha
    const handleAssignCourt = (matchId, courtNumber) => {
        setMatches(prev => prev.map(m =>
            m.id === matchId
                ? { ...m, court: courtNumber, status: 'reserved' }
                : m
        ));
        addToast(`Cancha ${courtNumber} asignada`, 'success');
    };

    const balances = [
        { label: "Hoy", amount: "$45.000", growth: "+12%" },
        { label: "Semanal", amount: "$280.000", growth: "+5%" },
        { label: "Mensual", amount: "$1.120.000", growth: "+18%" },
    ];

    // Datos para la vista de Turnos
    const weekDays = [
        { day: "Lun", date: 11, isToday: true },
        { day: "Mar", date: 12, isToday: false },
        { day: "Mié", date: 13, isToday: false },
        { day: "Jue", date: 14, isToday: false },
        { day: "Vie", date: 15, isToday: false },
        { day: "Sáb", date: 16, isToday: false },
        { day: "Dom", date: 17, isToday: false },
    ];

    const courts = [
        { id: 'all', name: 'Todas' },
        { id: 'cancha1', name: 'Cancha 1' },
        { id: 'cancha2', name: 'Cancha 2' },
    ];

    // Timeline de turnos (18:00 a 23:00)
    const timeSlots = [
        { time: "18:00", court: "Cancha 1", status: "available" },
        { time: "18:00", court: "Cancha 2", status: "reserved", client: "Juan Pérez", paid: true, phone: "+54 9 11 1234-5678" },
        { time: "19:00", court: "Cancha 1", status: "matchmaking", players: 8, total: 10, price: 1500 },
        { time: "19:00", court: "Cancha 2", status: "available" },
        { time: "20:00", court: "Cancha 1", status: "reserved", client: "María González", paid: false, phone: "+54 9 11 8765-4321" },
        { time: "20:00", court: "Cancha 2", status: "matchmaking", players: 6, total: 10, price: 1800 },
        { time: "21:00", court: "Cancha 1", status: "available" },
        { time: "21:00", court: "Cancha 2", status: "reserved", client: "Club Los Amigos", paid: true, phone: "+54 9 11 5555-6666" },
        { time: "22:00", court: "Cancha 1", status: "matchmaking", players: 10, total: 10, price: 2000 },
        { time: "22:00", court: "Cancha 2", status: "available" },
        { time: "23:00", court: "Cancha 1", status: "reserved", client: "Torneo Nocturno", paid: true, phone: "+54 9 11 9999-0000" },
        { time: "23:00", court: "Cancha 2", status: "available" },
    ];

    // Filtrar slots por cancha seleccionada
    const filteredSlots = selectedCourt === 'all'
        ? timeSlots
        : timeSlots.filter(slot => slot.court === courts.find(c => c.id === selectedCourt)?.name);

    // --- VISTA DUEÑO (CANCHERO) ---
    const OwnerView = () => (
        <div className="p-4 space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Hola, <span className="text-emerald-600">Complejo VIP</span></h1>
                    <p className="text-sm text-slate-500">Gestión de tus canchas</p>
                </div>
                <div className="bg-emerald-100 p-2 rounded-full relative">
                    <Bell size={20} className="text-emerald-700" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
            </header>

            {/* Balance Section */}
            <section className="grid grid-cols-3 gap-3">
                {balances.map((b) => (
                    <div key={b.label} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">{b.label}</p>
                        <p className="text-lg font-bold text-slate-800">{b.amount}</p>
                        <span className="text-[10px] text-emerald-500 font-bold">{b.growth}</span>
                    </div>
                ))}
            </section>

            {/* Acciones Rápidas */}
            <section className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex flex-col items-center gap-2 min-w-[80px]"
                >
                    <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200">
                        <PlusCircle size={24} />
                    </div>
                    <span className="text-xs font-medium">Crear</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="bg-white p-4 rounded-2xl text-slate-600 border border-slate-200">
                        <Users size={24} />
                    </div>
                    <span className="text-xs font-medium">Usuarios</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="bg-white p-4 rounded-2xl text-slate-600 border border-slate-200">
                        <Wallet size={24} />
                    </div>
                    <span className="text-xs font-medium">Precios</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="bg-white p-4 rounded-2xl text-slate-600 border border-slate-200">
                        <ShieldCheck size={24} />
                    </div>
                    <span className="text-xs font-medium">Permisos</span>
                </button>
            </section>

            {/* Lista de Partidos Próximos */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-slate-800">Partidos de Hoy</h2>
                    <span className="text-xs text-emerald-600 font-bold">Ver todos</span>
                </div>
                {matches.map((m) => (
                    <div key={m.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group active:scale-95 transition-transform">
                        <div className="flex gap-4 items-center">
                            <div className="bg-slate-50 w-12 h-12 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                <span className="text-xs font-bold text-emerald-600 leading-none">{m.time.split(':')[0]}</span>
                                <span className="text-[10px] text-slate-400 font-bold leading-none">PM</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{m.court}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${m.type === 'Público' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {m.type}
                                    </span>
                                    {m.status === 'locked' && <Lock size={10} className="text-slate-400" />}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <MatchmakingBar current={m.players} max={m.total} />
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );

    // --- VISTA JUGADOR ---
    const PlayerView = () => (
        <div className="p-4 space-y-6 animate-in slide-in-from-right duration-500">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-none">Hola, {userProfile.name}</h1>
                        <p className="text-xs text-slate-500 font-medium">Nivel {userProfile.ranking}★ • Buscá un partido</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="bg-slate-100 p-2 rounded-xl">
                        <Search size={20} className="text-slate-500" />
                    </div>
                </div>
            </header>

            {/* Status Cards */}
            <section className="bg-slate-900 rounded-[2rem] p-5 text-white flex items-center justify-between overflow-hidden relative shadow-xl shadow-emerald-100">
                <div className="space-y-1 relative z-10">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Nivel {userProfile.ranking}★</p>
                    <h2 className="text-xl font-bold leading-tight">Tu conducta es impecable</h2>
                    <div className="flex gap-2 mt-2">
                        <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">0 Inasistencias</span>
                        <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">{userProfile.ranking}★ Rating</span>
                    </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] text-emerald-500/20 rotate-12">
                    <ShieldCheck size={120} />
                </div>
            </section>

            {/* Partidos Disponibles */}
            <section className="space-y-4 pb-20">
                <div className="flex justify-between items-center">
                    <h2 className="font-extrabold text-slate-800 text-lg">Partidos Abiertos</h2>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">En tiempo real</span>
                    </div>
                </div>

                {matches.filter(m => m.type === 'Público').map((m) => {
                    const isJoined = joinedMatches.includes(m.id);
                    const isFull = m.players >= m.total;

                    return (
                        <div key={m.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4 hover:border-emerald-200 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{m.court}</h3>
                                        <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {m.time} HS</span>
                                            <span className="flex items-center gap-1"><Users size={12} /> {m.total / 2} vs {m.total / 2}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-600">
                                                Nivel {m.minRanking}★+
                                            </span>
                                            <span className="text-[10px] text-slate-400 capitalize">{m.gender}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-800">${m.price}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Por Persona</p>
                                </div>
                            </div>

                            <MatchmakingBar current={m.players} max={m.total} />

                            <div className="pt-2 flex gap-3">
                                {isJoined ? (
                                    <button
                                        onClick={() => handleLeaveMatch(m.id)}
                                        className="flex-1 font-bold py-3 rounded-2xl shadow-lg bg-red-600 text-white shadow-red-100 active:scale-95 transition-all"
                                    >
                                        Salir del Partido
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoinMatch(m.id)}
                                        disabled={isFull}
                                        className={`flex-1 font-bold py-3 rounded-2xl shadow-lg transition-all ${isFull
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                            : 'bg-emerald-600 text-white shadow-emerald-100 active:scale-95'
                                            }`}
                                    >
                                        {isFull ? 'Partido Completo' : 'Unirme ahora'}
                                    </button>
                                )}
                                <button className="bg-slate-100 text-slate-600 p-3 rounded-2xl active:scale-95 transition-transform">
                                    <MessageSquare size={20} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );

    // --- VISTA TURNOS DUEÑO ---
    const OwnerScheduleView = () => {
        const occupiedSlots = timeSlots.filter(s => s.status !== 'available').length;
        const totalSlots = timeSlots.length;
        const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);
        const estimatedRevenue = timeSlots
            .filter(s => s.status === 'matchmaking')
            .reduce((sum, s) => sum + (s.price * s.players), 0) +
            timeSlots.filter(s => s.status === 'reserved').length * 15000;

        return (
            <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión de <span className="text-emerald-600">Turnos</span></h1>
                        <p className="text-sm text-slate-500">Administrá tu agenda</p>
                    </div>
                    <button className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
                        <PlusCircle size={20} />
                    </button>
                </header>

                {/* Selector de Fecha */}
                <section className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex gap-2 min-w-max">
                        {weekDays.map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(idx)}
                                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl min-w-[70px] transition-all ${selectedDate === idx
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                    : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                            >
                                <span className="text-xs font-bold">{day.day}</span>
                                <span className="text-2xl font-black">{day.date}</span>
                                {day.isToday && selectedDate !== idx && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Filtro de Canchas */}
                <section className="flex gap-2">
                    {courts.map((court) => (
                        <button
                            key={court.id}
                            onClick={() => setSelectedCourt(court.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCourt === court.id
                                ? 'bg-slate-800 text-white'
                                : 'bg-white text-slate-600 border border-slate-200'
                                }`}
                        >
                            {court.name}
                        </button>
                    ))}
                </section>

                {/* Resumen del Día */}
                <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-5 text-white shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Resumen del Día</p>
                            <h2 className="text-3xl font-black mt-1">${estimatedRevenue.toLocaleString()}</h2>
                            <p className="text-emerald-100 text-xs mt-1">Recaudación estimada</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                            <p className="text-2xl font-black">{occupancyRate}%</p>
                            <p className="text-[10px] font-bold text-emerald-100">Ocupación</p>
                        </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <span className="text-emerald-50">{occupiedSlots} Reservados</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                            <span className="text-emerald-50">{totalSlots - occupiedSlots} Disponibles</span>
                        </div>
                    </div>
                </section>

                {/* Timeline de Turnos */}
                <section className="space-y-3">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} className="text-emerald-600" />
                        Timeline del Día
                    </h3>

                    {filteredSlots.map((slot, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
                            {/* Header del Slot */}
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3 items-center">
                                    <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                                        <span className="text-sm font-black text-slate-800">{slot.time}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{slot.court}</h4>
                                        <p className="text-xs text-slate-500">
                                            {slot.status === 'available' && 'Disponible'}
                                            {slot.status === 'reserved' && `Reservado - ${slot.client}`}
                                            {slot.status === 'matchmaking' && 'Partido Público'}
                                        </p>
                                    </div>
                                </div>

                                {/* Badge de Estado */}
                                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${slot.status === 'available'
                                    ? 'bg-slate-100 text-slate-500'
                                    : slot.status === 'reserved'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {slot.status === 'available' && 'LIBRE'}
                                    {slot.status === 'reserved' && 'RESERVADO'}
                                    {slot.status === 'matchmaking' && 'PÚBLICO'}
                                </div>
                            </div>

                            {/* Contenido según el estado */}
                            {slot.status === 'available' && (
                                <button className="w-full bg-slate-50 border-2 border-dashed border-slate-300 text-slate-600 py-3 rounded-xl font-bold text-sm hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95">
                                    + Anotar Reserva
                                </button>
                            )}

                            {slot.status === 'reserved' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {slot.paid ? (
                                                <div className="bg-emerald-100 p-1.5 rounded-lg">
                                                    <Check size={14} className="text-emerald-600" />
                                                </div>
                                            ) : (
                                                <div className="bg-red-100 p-1.5 rounded-lg">
                                                    <DollarSign size={14} className="text-red-600" />
                                                </div>
                                            )}
                                            <span className="text-xs font-bold text-slate-600">
                                                {slot.paid ? 'Pagado' : 'Pendiente de pago'}
                                            </span>
                                        </div>
                                        <a
                                            href={`https://wa.me/${slot.phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-emerald-600 text-white p-2 rounded-lg active:scale-95 transition-transform"
                                        >
                                            <Phone size={14} />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {slot.status === 'matchmaking' && (
                                <div className="space-y-2">
                                    <MatchmakingBar current={slot.players} max={slot.total} />
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">
                                            Ver Jugadores
                                        </button>
                                        <button className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">
                                            Cerrar Partido
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto bg-slate-50 min-h-screen font-sans relative shadow-2xl overflow-hidden border-x border-slate-200">

            {/* Toast Container */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Modales */}
            {showCreateModal && role === 'player' && (
                <CreateMatchModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateMatch}
                    userRanking={userProfile.ranking}
                />
            )}

            {showCreateModal && role === 'owner' && (
                <OwnerCreateMatchModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={(match) => {
                        setMatches(prev => [match, ...prev]);
                        addToast('Partido creado exitosamente', 'success');
                    }}
                />
            )}

            {showAssignModal && (
                <AssignCourtModal
                    match={showAssignModal}
                    onClose={() => setShowAssignModal(null)}
                    onAssign={handleAssignCourt}
                />
            )}

            {/* Switcher de Vista (Para propósitos de Demo) */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md px-1 py-1 rounded-full border border-slate-200 shadow-sm flex gap-1">
                <button
                    onClick={() => setRole('player')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${role === 'player' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500'}`}
                >
                    Jugador
                </button>
                <button
                    onClick={() => setRole('owner')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${role === 'owner' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500'}`}
                >
                    Dueño
                </button>
            </div>

            <main className="pt-10">
                {activeTab === 'buscar' && role === 'owner' ? (
                    <OwnerScheduleView />
                ) : activeTab === 'inicio' && role === 'owner' ? (
                    <OwnerView />
                ) : activeTab === 'inicio' && role === 'player' ? (
                    <PlayerView />
                ) : (
                    role === 'owner' ? <OwnerView /> : <PlayerView />
                )}
            </main>

            {/* Tab Bar Inferior */}
            <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-between items-center z-40">
                <button onClick={() => setActiveTab('inicio')} className={`flex flex-col items-center gap-1 ${activeTab === 'inicio' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <LayoutDashboard size={22} />
                    <span className="text-[10px] font-bold">Inicio</span>
                </button>
                <button onClick={() => setActiveTab('buscar')} className={`flex flex-col items-center gap-1 ${activeTab === 'buscar' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <Calendar size={22} />
                    <span className="text-[10px] font-bold">Turnos</span>
                </button>
                <div className="relative -top-4">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-200 ring-4 ring-slate-50 active:scale-90 transition-transform"
                    >
                        <PlusCircle size={28} />
                    </button>
                </div>
                <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <MessageSquare size={22} />
                    <span className="text-[10px] font-bold">Mensajes</span>
                </button>
                <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 ${activeTab === 'perfil' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <Settings size={22} />
                    <span className="text-[10px] font-bold">Ajustes</span>
                </button>
            </nav>
        </div>
    );
};

export default App;