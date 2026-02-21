import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Users, Clock, ArrowLeft } from 'lucide-react';

// Mensajes iniciales simulados por partido (a futuro: Firestore realtime)
const MOCK_MESSAGES = {
    'm1': [
        { id: 1, senderId: 'p3', senderName: 'Florencia', text: '¿Alguien lleva pelota?', time: '18:20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Flor' },
        { id: 2, senderId: 'p2', senderName: 'Agustín', text: 'Yo llevo una', time: '18:22', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus' },
        { id: 3, senderId: 'p4', senderName: 'Marcelo', text: 'Me apunto, ¿a qué cancha vamos?', time: '18:45', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcelo' },
    ],
    'm2': [
        { id: 1, senderId: 'p5', senderName: 'Valentina', text: 'Hay vestuarios en el complejo?', time: '19:05', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vale' },
    ],
    default: [],
};

// Vista de un chat específico
const MatchChat = ({ match, currentUser, messages, onSendMessage, onBack }) => {
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(match.id, input.trim());
        setInput('');
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="flex items-center gap-3 p-4 pt-12 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shadow-sm">
                <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
                <div className="flex-1">
                    <h2 className="font-bold text-slate-800 dark:text-white text-sm">
                        Chat — {match.time} hs
                    </h2>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Users size={10} /> {match.playerIds?.length || 0} jugadores anotados
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 font-bold">LIVE</span>
                </div>
            </header>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                    Chat del partido • {match.date}
                </p>

                {messages.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                        <MessageSquare size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="text-sm text-slate-400 dark:text-slate-500">No hay mensajes todavía</p>
                        <p className="text-xs text-slate-300 dark:text-slate-600">¡Rompé el hielo!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex gap-2 items-end ${isMe ? 'flex-row-reverse' : ''}`}>
                                {!isMe && (
                                    <img src={msg.avatar} alt={msg.senderName} className="w-7 h-7 rounded-full shrink-0" />
                                )}
                                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                    {!isMe && (
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1">{msg.senderName}</p>
                                    )}
                                    <div className={`px-4 py-2.5 rounded-2xl ${isMe
                                        ? 'bg-emerald-600 text-white rounded-br-sm'
                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 rounded-bl-sm shadow-sm'
                                        }`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    <p className={`text-[9px] text-slate-400 dark:text-slate-500 px-1 flex items-center gap-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <Clock size={9} /> {msg.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 pb-28 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribí un mensaje..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm font-medium"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 rounded-2xl bg-emerald-600 text-white disabled:opacity-40 active:scale-90 transition-all shadow-md shadow-emerald-600/20"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

// Vista principal: lista de chats activos
export const ChatView = ({ matches = [], joinedMatchIds = [], currentUser }) => {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [openMatchId, setOpenMatchId] = useState(null);

    // Solo los partidos en los que el usuario está anotado
    const myMatches = matches.filter(m =>
        joinedMatchIds.includes(m.id) || m.playerIds?.includes(currentUser?.id)
    );

    const sendMessage = (matchId, text) => {
        const newMsg = {
            id: Date.now(),
            senderId: currentUser.id,
            senderName: currentUser.name,
            text,
            time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
            avatar: currentUser.avatar,
        };
        setMessages(prev => ({
            ...prev,
            [matchId]: [...(prev[matchId] || []), newMsg],
        }));
    };

    if (openMatchId) {
        const match = matches.find(m => m.id === openMatchId);
        return (
            <MatchChat
                match={match}
                currentUser={currentUser}
                messages={messages[openMatchId] || []}
                onSendMessage={sendMessage}
                onBack={() => setOpenMatchId(null)}
            />
        );
    }

    return (
        <div className="min-h-screen pb-28 animate-in fade-in duration-500">
            {/* Header */}
            <header className="p-6 pt-8 bg-white dark:bg-slate-800 rounded-b-[2rem] border-b border-slate-100 dark:border-slate-700 shadow-sm">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <MessageSquare size={26} className="text-emerald-600 dark:text-emerald-400" />
                    Mensajes
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Chats de tus partidos activos
                </p>
            </header>

            <div className="p-4 space-y-3">
                {myMatches.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                        <MessageSquare size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="font-bold text-slate-500 dark:text-slate-400">No tenés chats activos</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">Al unirte a un partido aparecerá el chat acá</p>
                    </div>
                ) : (
                    myMatches.map(match => {
                        const matchMessages = messages[match.id] || [];
                        const lastMsg = matchMessages[matchMessages.length - 1];
                        const unread = matchMessages.filter(m => m.senderId !== currentUser?.id).length;

                        return (
                            <button
                                key={match.id}
                                onClick={() => setOpenMatchId(match.id)}
                                className="w-full p-4 rounded-3xl border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:border-emerald-200 dark:hover:border-emerald-500/50 active:scale-[0.98] transition-all text-left"
                            >
                                {/* Ícono del partido */}
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <MessageSquare size={22} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">
                                            Partido {match.time} hs
                                        </p>
                                        {lastMsg && (
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">{lastMsg.time}</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'Sin mensajes aún — ¡arrancá la conversación!'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                                            <Users size={10} /> {match.playerIds?.length || 0}/{match.totalPlayers}
                                        </span>
                                    </div>
                                </div>

                                {unread > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                        <span className="text-[9px] font-black text-white">{unread}</span>
                                    </div>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
