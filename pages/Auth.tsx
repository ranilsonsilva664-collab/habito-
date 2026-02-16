
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
    onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Confirme seu e-mail para ativar a conta!');
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark p-6 justify-center">
            <div className="w-full max-w-md mx-auto space-y-8 animate-pop-in">
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-primary/20 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
                        <span className="material-icons-round text-4xl text-primary">auto_graph</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">{isLogin ? 'Bem-vindo ao Hábito+' : 'Crie sua conta no Hábito+'}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{isLogin ? 'Entre para marcar cada conquista e acompanhar seu progresso' : 'Comece hoje mesmo a transformar seus hábitos com o Hábito+'}</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">E-mail</label>
                        <div className="relative">
                            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-slate-50 dark:bg-card-dark border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Senha</label>
                        <div className="relative">
                            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-card-dark border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] p-4 rounded-2xl animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span>{isLogin ? 'ENTRAR' : 'CRIAR CONTA'}</span>
                                <span className="material-icons-round">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
                    >
                        {isLogin ? (
                            <>Não tem uma conta? <span className="text-primary">Cadastre-se</span></>
                        ) : (
                            <>Já tem uma conta? <span className="text-primary">Entre aqui</span></>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-widest font-black opacity-30">
                Hábito+ • Habit Tracker Premium
            </div>
        </div>
    );
};

export default Auth;
