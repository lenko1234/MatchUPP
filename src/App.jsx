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
    Copy,
    Moon,
    Sun
} from 'lucide-react';

// ========== SISTEMA DE TEMA ==========
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('matchup-theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        localStorage.setItem('matchup-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return { theme, setTheme, toggleTheme };
};

// ========== SISTEMA DE TOASTS ==========
const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${type === 'success'
            ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
            : type === 'error'
                ? 'bg-red-500 border-red-400 text-white shadow-red-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white'
            }`}>
            {type === 'success' ? <ShieldCheck size={20} /> : <Bell size={20} />}
            <span className="font-bold text-sm flex-1">{message}</span>
            <button onClick={onClose} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
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
            <div className="flex justify-between text-xs mb-1 text-slate-500 dark:text-slate-400 font-medium">
                <span>{current} / {max} Jugadores</span>
                <span>{isFull ? '¡Listo!' : `Faltan ${max - current}`}</span>
            </div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${percentage < 50 ? 'bg-slate-400 dark:bg-slate-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Crear Partido</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            {cities.map(city => (
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

                    {/* Edad */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Edad Mín.</label>
                            <input
                                type="number"
                                value={formData.minAge}
                                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                                placeholder="18"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Edad Máx.</label>
                            <input
                                type="number"
                                value={formData.maxAge}
                                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                                placeholder="50"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Ranking Mínimo */}
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

                    {/* Jugadores */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Total de Jugadores</label>
                        <select
                            value={formData.totalPlayers}
                            onChange={(e) => setFormData({ ...formData, totalPlayers: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium transition-colors"
                        >
                            <option value={6}>6 (3 vs 3)</option>
                            <option value={8}>8 (4 vs 4)</option>
                            <option value={10}>10 (5 vs 5)</option>
                            <option value={12}>12 (6 vs 6)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end justify-center animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                            <Check size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">¡Partido Creado!</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Compartí este link para que se sumen</p>

                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-xs text-slate-600 dark:text-slate-400 break-all font-mono">{shareLink}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Copy size={18} />
                                Copiar
                            </button>
                            <button
                                onClick={shareWhatsApp}
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                            >
                                <Phone size={18} />
                                WhatsApp
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full text-slate-600 dark:text-slate-400 py-2 font-bold hover:text-slate-800 dark:hover:text-white"
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
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center text-slate-800 dark:text-white">
                    <h2 className="text-xl font-bold">Crear Partido Rápido</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tipo */}
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
                                <Users size={18} />
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
                                <Lock size={18} />
                                Privado
                            </button>
                        </div>
                    </div>

                    {/* Cancha y Hora */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cancha</label>
                            <select
                                value={formData.court}
                                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium transition-colors"
                                required
                            >
                                <option value="">Elegir</option>
                                <option value="Cancha 1">Cancha 1</option>
                                <option value="Cancha 2">Cancha 2</option>
                                <option value="Cancha 3">Cancha 3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Hora</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Precio por Persona</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="1500"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium transition-colors"
                            required
                        />
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

                    {/* Edad */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Edad Mín.</label>
                            <input
                                type="number"
                                value={formData.minAge}
                                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                                placeholder="18"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Edad Máx.</label>
                            <input
                                type="number"
                                value={formData.maxAge}
                                onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                                placeholder="50"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Ranking */}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm mx-4 rounded-3xl p-6 space-y-4 animate-in zoom-in duration-300 shadow-2xl">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                        <Bell size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">¡Partido Listo!</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        El partido llegó a 5 jugadores. Asigná una cancha.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Número de Cancha</label>
                    <select
                        value={courtNumber}
                        onChange={(e) => setCourtNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-emerald-500 outline-none font-medium transition-colors"
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
                        className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Después
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!courtNumber}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
                    >
                        Asignar
                    </button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const { theme, setTheme } = useTheme();
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
        name: 'Brandon',
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
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hola, <span className="text-emerald-600">Complejo VIP</span></h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gestión de tus canchas</p>
                </div>
                <div className="p-2 rounded-full relative bg-emerald-100 dark:bg-emerald-600/20">
                    <Bell size={20} className="text-emerald-700 dark:text-emerald-400" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </div>
            </header>

            {/* Balance Section */}
            <section className="grid grid-cols-3 gap-3">
                {balances.map((b) => (
                    <div key={b.label} className="p-3 rounded-2xl shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 transition-colors shadow-slate-light">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{b.label}</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">{b.amount}</p>
                        <span className="text-[10px] text-emerald-500 font-bold">{b.growth}</span>
                    </div>
                ))}
            </section>

            {/* Acciones Rápidas */}
            <section className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex flex-col items-center gap-2 min-w-[80px] group"
                >
                    <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                        <PlusCircle size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Crear</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px] group">
                    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-all shadow-slate-light">
                        <Users size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Usuarios</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px] group">
                    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-all shadow-slate-light">
                        <Wallet size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Precios</span>
                </button>
                <button className="flex flex-col items-center gap-2 min-w-[80px] group">
                    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-all shadow-slate-light">
                        <ShieldCheck size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Permisos</span>
                </button>
            </section>

            {/* Lista de Partidos Próximos */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 dark:text-white">Partidos de Hoy</h2>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer hover:underline underline-offset-4">Ver todos</span>
                </div>
                {matches.map((m) => (
                    <div key={m.id} className="p-4 rounded-3xl border flex items-center justify-between group active:scale-95 transition-all bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-slate-light hover:border-emerald-200 dark:hover:border-emerald-500/50">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center border bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-bold text-emerald-600 leading-none">{m.time.split(':')[0]}</span>
                                <span className="text-[10px] font-bold leading-none text-slate-400 dark:text-slate-500">PM</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-white">{m.court}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${m.type === 'Público' ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400'}`}>
                                        {m.type}
                                    </span>
                                    {m.status === 'locked' && <Lock size={10} className="text-slate-400 dark:text-slate-500" />}
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
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-600/20 border-2 border-emerald-500 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none text-slate-800 dark:text-white">Hola, {userProfile.name}</h1>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Nivel {userProfile.ranking}★ • Buscá un partido</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        <Search size={20} />
                    </div>
                </div>
            </header>

            {/* Status Cards */}
            <section className="rounded-[2rem] p-5 text-white flex items-center justify-between overflow-hidden relative shadow-xl bg-slate-900 dark:bg-slate-800 shadow-slate-light">
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
                    <h2 className="font-extrabold text-lg text-slate-800 dark:text-white">Partidos Abiertos</h2>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-500">En tiempo real</span>
                    </div>
                </div>

                {matches.filter(m => m.type === 'Público').map((m) => {
                    const isJoined = joinedMatches.includes(m.id);
                    const isFull = m.players >= m.total;

                    return (
                        <div key={m.id} className="rounded-3xl p-5 shadow-sm border space-y-4 hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-colors bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-slate-light">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white">{m.court}</h3>
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {m.time} HS</span>
                                            <span className="flex items-center gap-1"><Users size={12} /> {m.total / 2} vs {m.total / 2}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
                                                Nivel {m.minRanking}★+
                                            </span>
                                            <span className="text-[10px] capitalize text-slate-400 dark:text-slate-500">{m.gender}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-800 dark:text-white">${m.price}</p>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Por Persona</p>
                                </div>
                            </div>

                            <MatchmakingBar current={m.players} max={m.total} />

                            <div className="pt-2 flex gap-3">
                                {isJoined ? (
                                    <button
                                        onClick={() => handleLeaveMatch(m.id)}
                                        className="flex-1 font-bold py-3 rounded-2xl shadow-lg bg-red-600 dark:bg-red-500 text-white shadow-red-100 dark:shadow-red-900/20 active:scale-95 transition-all"
                                    >
                                        Salir del Partido
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoinMatch(m.id)}
                                        disabled={isFull}
                                        className={`flex-1 font-bold py-3 rounded-2xl shadow-lg transition-all ${isFull
                                            ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
                                            : 'bg-emerald-600 dark:bg-emerald-600 text-white shadow-emerald-100 dark:shadow-emerald-900/20 active:scale-95'
                                            }`}
                                    >
                                        {isFull ? 'Partido Completo' : 'Unirme ahora'}
                                    </button>
                                )}
                                <button className="p-3 rounded-2xl active:scale-95 transition-transform bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
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
        // Generar días de la semana actual
        const getDaysOfWeek = () => {
            const days = [];
            const start = new Date();
            start.setDate(start.getDate() - start.getDay() + 1); // Empezar Lunes

            for (let i = 0; i < 7; i++) {
                const d = new Date(start);
                d.setDate(start.getDate() + i);
                days.push(d);
            }
            return days;
        };

        const [calendarDate, setCalendarDate] = useState(new Date());
        const daysOfWeek = getDaysOfWeek();

        const formatDayName = (date) => {
            return date.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '');
        };

        return (
            <div className="min-h-screen pb-24 animate-in fade-in duration-500 transition-colors bg-slate-50 dark:bg-slate-900">
                {/* Header Fijo */}
                <header className="p-6 pb-2 rounded-b-[2.5rem] shadow-sm transition-colors bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-black flex items-center gap-2 text-slate-800 dark:text-white">
                            <Calendar size={28} className="text-emerald-600 dark:text-emerald-400" />
                            Febrero <span className="font-light text-slate-400 dark:text-slate-500">2026</span>
                        </h1>
                        <button className="p-2.5 rounded-2xl transition-colors bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-600/20 hover:text-emerald-600 dark:hover:text-emerald-400">
                            <Settings size={20} />
                        </button>
                    </div>

                    {/* Selector de Días Horizontal */}
                    <div className="flex justify-between items-center gap-2 pb-4 overflow-x-auto no-scrollbar">
                        {daysOfWeek.map((day, idx) => {
                            const isSelected = day.getDate() === calendarDate.getDate();
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCalendarDate(day)}
                                    className={`flex flex-col items-center min-w-[50px] py-3 rounded-2xl transition-all duration-300 ${isSelected
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-110'
                                        : 'bg-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {formatDayName(day)}
                                    </span>
                                    <span className="text-lg font-black">{day.getDate()}</span>
                                    {isSelected && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Cuerpo del Calendario (Timeline) */}
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-xs uppercase tracking-tighter text-slate-400 dark:text-slate-500">Agenda de hoy</h2>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Libre</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Ocupado</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                        {filteredSlots.map((slot, idx) => (
                            <div key={idx} className="flex gap-6 items-start group relative">
                                {/* Hora */}
                                <div className="text-[11px] font-black w-10 pt-4 z-10 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 transition-colors">
                                    {slot.time}
                                </div>

                                {/* Card de Turno */}
                                <div className={`flex-1 rounded-[1.8rem] p-4 border-2 transition-all duration-300 ${slot.status === 'available'
                                    ? 'bg-emerald-50/30 dark:bg-emerald-600/10 border-dashed border-emerald-200 dark:border-emerald-600/30 hover:border-emerald-500 cursor-pointer'
                                    : slot.status === 'matchmaking'
                                        ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-xl shadow-slate-light'
                                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-light'
                                    }`}>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`font-bold text-sm ${slot.status === 'available'
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-800 dark:text-white'
                                                }`}>
                                                {slot.status === 'available' ? 'Cancha Disponible' :
                                                    slot.status === 'matchmaking' ? 'Partido Abierto' :
                                                        `Reservado: ${slot.client}`}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                                                    <MapPin size={12} />
                                                    {slot.court}
                                                </span>
                                            </div>
                                        </div>

                                        {slot.status === 'available' && (
                                            <div className="text-right">
                                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">$1500</span>
                                                <p className="text-[8px] font-bold text-emerald-400 dark:text-emerald-500 uppercase">Seña $500</p>
                                            </div>
                                        )}
                                    </div>

                                    {slot.status === 'matchmaking' && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-[10px] mb-1 font-bold">
                                                <span className="text-emerald-600 dark:text-emerald-400">{slot.players}/{slot.total} jugadores</span>
                                                <span className="text-slate-400 dark:text-slate-500">Faltan {slot.total - slot.players}</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                                    style={{ width: `${(slot.players / slot.total) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex -space-x-2 mt-3">
                                                {[...Array(Math.min(4, slot.players))].map((_, i) => (
                                                    <img
                                                        key={i}
                                                        className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800"
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + idx}`}
                                                        alt="avatar"
                                                    />
                                                ))}
                                                {slot.players > 4 && (
                                                    <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                                        +{slot.players - 4}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {slot.status === 'reserved' && (
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {slot.paid ? (
                                                    <>
                                                        <div className="bg-emerald-100 dark:bg-emerald-600/20 p-1.5 rounded-lg">
                                                            <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Pagado</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="bg-red-100 dark:bg-red-600/20 p-1.5 rounded-lg">
                                                            <DollarSign size={14} className="text-red-600 dark:text-red-400" />
                                                        </div>
                                                        <span className="text-xs font-bold text-red-600 dark:text-red-400">Pendiente</span>
                                                    </>
                                                )}
                                            </div>
                                            <a
                                                href={`https://wa.me/${slot.phone?.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-emerald-600 text-white p-2 rounded-lg active:scale-95 transition-transform hover:bg-emerald-700"
                                            >
                                                <Phone size={14} />
                                            </a>
                                        </div>
                                    )}

                                    {slot.status === 'available' && (
                                        <button className="mt-3 w-full py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors active:scale-95">
                                            Reservar Ahora
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Action Button */}
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 dark:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-slate-900 z-50"
                >
                    <PlusCircle size={24} />
                </button>
            </div>
        );
    };

    // --- VISTA CONFIGURACIÓN ---
    const SettingsView = () => (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500 transition-colors bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="p-6 pb-8 bg-white dark:bg-slate-800 rounded-b-[2.5rem] shadow-sm transition-colors border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20">
                        <Settings size={28} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                            Configuración
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Personalizá tu experiencia
                        </p>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <div className="p-6 space-y-6">
                {/* Sección Apariencia */}
                <section className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Apariencia
                    </h2>

                    {/* Selector de Tema */}
                    <div className="rounded-3xl p-5 shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 transition-colors shadow-slate-light">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors">
                                    {theme === 'dark' ? (
                                        <Moon size={20} className="text-emerald-400" />
                                    ) : (
                                        <Sun size={20} className="text-amber-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                                        Tema
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Toggle Buttons */}
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-50 dark:bg-slate-900 transition-colors">
                            <button
                                onClick={() => setTheme('light')}
                                className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'light'
                                    ? 'bg-white text-slate-800 shadow-lg shadow-slate-200'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Sun size={18} />
                                Claro
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-lg dark:shadow-emerald-900/20 border border-transparent dark:border-slate-700'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Moon size={18} />
                                Oscuro
                            </button>
                        </div>
                    </div>
                </section>

                {/* Sección Cuenta */}
                <section className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Cuenta
                    </h2>

                    <div className="rounded-3xl overflow-hidden shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 transition-colors shadow-slate-light">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors text-emerald-600 dark:text-emerald-400">
                                    <Users size={20} />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">
                                    Editar Perfil
                                </span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

                        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors text-emerald-600 dark:text-emerald-400">
                                    <Bell size={20} />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">
                                    Notificaciones
                                </span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

                        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">
                                    Privacidad y Seguridad
                                </span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
                        </button>
                    </div>
                </section>

                {/* Sección Ayuda */}
                <section className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Ayuda y Soporte
                    </h2>

                    <div className="rounded-3xl overflow-hidden shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 transition-colors shadow-slate-light">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors text-emerald-600 dark:text-emerald-400">
                                    <MessageSquare size={20} />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">
                                    Centro de Ayuda
                                </span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

                        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors text-emerald-600 dark:text-emerald-400">
                                    <AlertCircle size={20} />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">
                                    Reportar un Problema
                                </span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
                        </button>
                    </div>
                </section>

                {/* Versión */}
                <div className="text-center pt-4">
                    <p className="text-xs text-slate-400 dark:text-slate-600">
                        MatchUP v1.0.0
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-md mx-auto min-h-screen font-sans relative shadow-2xl overflow-hidden border-x border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
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
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-1 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex gap-1">
                <button
                    onClick={() => setRole('player')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${role === 'player' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Jugador
                </button>
                <button
                    onClick={() => setRole('owner')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${role === 'owner' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    Dueño
                </button>
            </div>

            <main className="pt-10">
                {activeTab === 'perfil' ? (
                    <SettingsView />
                ) : activeTab === 'buscar' && role === 'owner' ? (
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
            <nav className="fixed bottom-0 w-full max-w-md backdrop-blur-xl border-t px-8 py-4 flex justify-between items-center z-40 transition-colors duration-300 bg-white/90 dark:bg-slate-800/90 border-slate-100 dark:border-slate-700">
                <button onClick={() => setActiveTab('inicio')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'inicio' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <LayoutDashboard size={22} />
                    <span className="text-[10px] font-bold">Inicio</span>
                </button>
                <button onClick={() => setActiveTab('buscar')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'buscar' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <Calendar size={22} />
                    <span className="text-[10px] font-bold">Turnos</span>
                </button>
                <div className="relative -top-4">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-600/20 active:scale-90 transition-all ring-4 ring-slate-50 dark:ring-slate-900"
                    >
                        <PlusCircle size={28} />
                    </button>
                </div>
                <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'chat' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <MessageSquare size={22} />
                    <span className="text-[10px] font-bold">Mensajes</span>
                </button>
                <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'perfil' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <Settings size={22} />
                    <span className="text-[10px] font-bold">Ajustes</span>
                </button>
            </nav>
        </div>
    );
};

export default App;