import React from 'react';
import { Settings, Moon, Sun, Users, Bell, ShieldCheck, MessageSquare, AlertCircle, ChevronRight } from 'lucide-react';

export const SettingsView = ({ theme, setTheme }) => (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500 transition-colors bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <header className="p-6 pb-8 bg-white dark:bg-slate-800 rounded-b-[2.5rem] shadow-sm transition-colors border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20">
                    <Settings size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Configuración</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Personalizá tu experiencia</p>
                </div>
            </div>
        </header>

        <div className="p-6 space-y-6">
            {/* Apariencia */}
            <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Apariencia</h2>
                <div className="rounded-3xl p-5 shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 transition-colors">
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
                                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Tema</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-50 dark:bg-slate-900 transition-colors">
                        <button
                            onClick={() => setTheme('light')}
                            className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'light'
                                ? 'bg-white text-slate-800 shadow-lg shadow-slate-200'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                                }`}
                        >
                            <Sun size={18} />
                            Claro
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'dark'
                                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-lg dark:shadow-emerald-900/20 border border-transparent dark:border-slate-700'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                                }`}
                        >
                            <Moon size={18} />
                            Oscuro
                        </button>
                    </div>
                </div>
            </section>

            {/* Cuenta */}
            <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cuenta</h2>
                <div className="rounded-3xl overflow-hidden shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 transition-colors">
                    {[
                        { icon: Users, label: 'Editar Perfil' },
                        { icon: Bell, label: 'Notificaciones' },
                        { icon: ShieldCheck, label: 'Privacidad y Seguridad' },
                    ].map(({ icon: Icon, label }, i) => (
                        <React.Fragment key={label}>
                            {i > 0 && <div className="h-px bg-slate-100 dark:bg-slate-700"></div>}
                            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors text-emerald-600 dark:text-emerald-400">
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-bold text-sm text-slate-800 dark:text-white">{label}</span>
                                </div>
                                <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* Ayuda */}
            <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ayuda y Soporte</h2>
                <div className="rounded-3xl overflow-hidden shadow-sm border bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 transition-colors">
                    {[
                        { icon: MessageSquare, label: 'Centro de Ayuda' },
                        { icon: AlertCircle, label: 'Reportar un Problema' },
                    ].map(({ icon: Icon, label }, i) => (
                        <React.Fragment key={label}>
                            {i > 0 && <div className="h-px bg-slate-100 dark:bg-slate-700"></div>}
                            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 transition-colors text-emerald-600 dark:text-emerald-400">
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-bold text-sm text-slate-800 dark:text-white">{label}</span>
                                </div>
                                <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </section>

            <div className="text-center pt-4">
                <p className="text-xs text-slate-400 dark:text-slate-600">MatchUP v1.0.0</p>
            </div>
        </div>
    </div>
);
