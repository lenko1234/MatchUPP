// =============================================================
//  MATCHUP — BASE DE DATOS SIMULADA (MOCK DB)
//  ---------------------------------------------------------------
//  Cuando conectemos Firebase, estos datos se reemplazarán por
//  listeners de Firestore. La estructura de los objetos debe
//  mantenerse igual para que las vistas no necesiten cambios.
//
//  Convención de IDs:
//    users      → "u1", "u2", ...
//    complexes  → "cx1", "cx2", ...
//    courts     → "ct1", "ct2", ...
//    bookings   → "b1",  "b2",  ...
//    matches    → "m1",  "m2",  ...
// =============================================================


// ─── USUARIOS ──────────────────────────────────────────────────
// role: 'player' | 'owner'
// ranking: 1–5 (estrellas para jugadores)
// strikes: infracciones acumuladas (3 = suspensión temporal)
export const MOCK_USERS = [
    {
        id: 'u1',
        name: 'Brandon',
        email: 'brandon@matchup.app',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brandon',
        role: 'player',
        ranking: 3,
        age: 25,
        gender: 'masculino',
        city: 'Buenos Aires',
        matchesPlayed: 42,
        strikes: 0,
        isSuspended: false,
    },
    {
        id: 'u2',
        name: 'Complejo VIP',
        email: 'vip@matchup.app',
        avatar: null,
        role: 'owner',
        complexId: 'cx1', // A qué complejo pertenece
        ranking: null,
        strikes: null,
    },
];

// Usuario actualmente logueado (simulado).
// TODO Firebase: esto vendrá de auth.currentUser + Firestore
export const CURRENT_USER = MOCK_USERS[0]; // Cambiá a [1] para ver como dueño


// ─── COMPLEJOS DEPORTIVOS ───────────────────────────────────────
export const MOCK_COMPLEXES = [
    {
        id: 'cx1',
        ownerId: 'u2',
        name: 'Complejo VIP',
        address: 'Av. Corrientes 1234, CABA',
        city: 'Buenos Aires',
        phone: '+54 9 11 1111-2222',
        pricePerHour: 15000,   // precio base por hora
        depositAmount: 5000,   // seña automática al reservar
        openTime: '08:00',
        closeTime: '23:00',
        rating: 4.5,
        reviewCount: 128,
    },
];


// ─── CANCHAS ───────────────────────────────────────────────────
// surface: 'cemento' | 'sintetico' | 'parquet'
// coverType: 'techado' | 'al_aire'
export const MOCK_COURTS = [
    { id: 'ct1', complexId: 'cx1', name: 'Cancha 1', surface: 'sintetico', coverType: 'techado', lights: true },
    { id: 'ct2', complexId: 'cx1', name: 'Cancha 2', surface: 'sintetico', coverType: 'al_aire', lights: true },
    { id: 'ct3', complexId: 'cx1', name: 'Cancha 3', surface: 'cemento', coverType: 'techado', lights: false },
];


// ─── RESERVAS / TURNOS (TABLA MAESTRA) ─────────────────────────
// status:
//   'available'   → libre (no existe registro; se infiere por ausencia)
//   'reserved'    → reserva manual del dueño o reserva de jugador
//   'matchmaking' → partido público buscando jugadores
//   'blocked'     → bloqueado por mantenimiento
//
// paid:
//   null   → aún no corresponde cobrar
//   false  → debe seña
//   true   → seña/total cobrado
//
// Una reserva bloquea TODA esa hora en esa cancha.
// El ID de matchId solo se rellena si el turno es tipo 'matchmaking'.
export const MOCK_BOOKINGS = [
    {
        id: 'b1',
        courtId: 'ct1',
        complexId: 'cx1',
        date: '2026-02-20',   // YYYY-MM-DD
        time: '18:00',        // HH:MM (inicio del turno de 1h)
        status: 'reserved',
        clientName: 'Juan Pérez',
        clientPhone: '+5491112345678',
        clientId: null,       // null si fue reserva telefónica
        price: 15000,
        paid: true,
        notes: '',
        matchId: null,
    },
    {
        id: 'b2',
        courtId: 'ct2',
        complexId: 'cx1',
        date: '2026-02-20',
        time: '18:00',
        status: 'matchmaking',
        clientName: null,
        clientPhone: null,
        clientId: null,
        price: 15000,
        paid: null,
        notes: '',
        matchId: 'm1',
    },
    {
        id: 'b3',
        courtId: 'ct1',
        complexId: 'cx1',
        date: '2026-02-20',
        time: '19:00',
        status: 'reserved',
        clientName: 'María González',
        clientPhone: '+5491187654321',
        clientId: null,
        price: 15000,
        paid: false,
        notes: 'Llama antes para confirmar',
        matchId: null,
    },
    {
        id: 'b4',
        courtId: 'ct2',
        complexId: 'cx1',
        date: '2026-02-20',
        time: '19:00',
        status: 'matchmaking',
        clientName: null,
        clientPhone: null,
        clientId: null,
        price: 15000,
        paid: null,
        notes: '',
        matchId: 'm2',
    },
    {
        id: 'b5',
        courtId: 'ct1',
        complexId: 'cx1',
        date: '2026-02-20',
        time: '20:00',
        status: 'blocked',
        clientName: null,
        clientPhone: null,
        clientId: null,
        price: 0,
        paid: null,
        notes: 'Mantenimiento de red',
        matchId: null,
    },
    {
        id: 'b6',
        courtId: 'ct2',
        complexId: 'cx1',
        date: '2026-02-20',
        time: '21:00',
        status: 'reserved',
        clientName: 'Club Los Amigos',
        clientPhone: '+5491155556666',
        clientId: null,
        price: 15000,
        paid: true,
        notes: '',
        matchId: null,
    },
    {
        id: 'b7',
        courtId: 'ct1',
        complexId: 'cx1',
        date: '2026-02-20',
        time: '22:00',
        status: 'matchmaking',
        clientName: null,
        clientPhone: null,
        clientId: null,
        price: 15000,
        paid: null,
        notes: '',
        matchId: 'm3',
    },
];


// ─── PARTIDOS DE MATCHMAKING ────────────────────────────────────
// Vinculados a un booking.
// type:    'public' | 'private'
// gender:  'mixto' | 'masculino' | 'femenino'
// playerIds: lista de IDs de jugadores anotados
export const MOCK_MATCHES = [
    {
        id: 'm1',
        bookingId: 'b2',
        complexId: 'cx1',
        courtId: 'ct2',
        date: '2026-02-20',
        time: '18:00',
        type: 'public',
        gender: 'mixto',
        minRanking: 2,
        minAge: 18,
        maxAge: 45,
        totalPlayers: 10,
        playerIds: ['u1'],          // quién se anotó
        createdBy: 'u2',            // dueño lo creó
        status: 'open',             // 'open' | 'full' | 'played' | 'cancelled'
        price: 1500,                // por jugador
    },
    {
        id: 'm2',
        bookingId: 'b4',
        complexId: 'cx1',
        courtId: 'ct2',
        date: '2026-02-20',
        time: '19:00',
        type: 'public',
        gender: 'masculino',
        minRanking: 3,
        minAge: 20,
        maxAge: 40,
        totalPlayers: 10,
        playerIds: [],
        createdBy: 'u2',
        status: 'open',
        price: 1800,
    },
    {
        id: 'm3',
        bookingId: 'b7',
        complexId: 'cx1',
        courtId: 'ct1',
        date: '2026-02-20',
        time: '22:00',
        type: 'public',
        gender: 'mixto',
        minRanking: 1,
        minAge: 16,
        maxAge: 99,
        totalPlayers: 10,
        playerIds: [],
        createdBy: 'u2',
        status: 'open',
        price: 2000,
    },
];


// ─── RATINGS / VALORACIONES POST-PARTIDO ───────────────────────
// Se generan después de cada partido para actualizar el ranking
// TODO: implementar lógica de promedio para actualizar MOCK_USERS.ranking
export const MOCK_RATINGS = [];


// ─── HORARIOS DE OPERACIÓN DEL DÍA ─────────────────────────────
// Helper: slots de tiempo desde apertura hasta cierre (cada 1 hora)
export const generateTimeSlots = (openTime = '08:00', closeTime = '23:00') => {
    const slots = [];
    const [openH] = openTime.split(':').map(Number);
    const [closeH] = closeTime.split(':').map(Number);
    for (let h = openH; h < closeH; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00`);
    }
    return slots;
};
