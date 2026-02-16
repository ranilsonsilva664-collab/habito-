import React, { useState, useEffect } from 'react';
import { Page, Workout, UserWorkoutState, WorkoutHistoryEntry } from '../types';
import { workouts, programs } from '../data/workoutData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import WorkoutSession from './WorkoutSession';
import WorkoutConfig from './WorkoutConfig';

interface WorkoutDashboardProps {
    navigate: (page: Page) => void;
}

const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({ navigate }) => {
    const [userState, setUserState] = useState<UserWorkoutState | null>(null);
    const [suggestedWorkout, setSuggestedWorkout] = useState<Workout | null>(null);
    const [view, setView] = useState<'dashboard' | 'session' | 'config'>('dashboard');

    useEffect(() => {
        loadState();
    }, []);

    const loadState = () => {
        const saved = localStorage.getItem('habito_plus_workout_state');
        if (saved) {
            const parsed: UserWorkoutState = JSON.parse(saved);
            setUserState(parsed);

            const program = programs.find(p => p.id === parsed.programId);
            if (program) {
                const nextIndex = parsed.lastWorkoutIndex % program.rotacao.length;
                const workoutId = program.rotacao[nextIndex];
                const workout = workouts.find(w => w.id === workoutId);
                setSuggestedWorkout(workout || null);
            }
        } else {
            setView('config');
        }
    };

    const handleFinishWorkout = (durationMin: number) => {
        if (!userState || !suggestedWorkout) return;

        const program = programs.find(p => p.id === userState.programId);
        if (!program) return;

        const newHistoryEntry: WorkoutHistoryEntry = {
            id: Math.random().toString(36).substr(2, 9),
            workoutId: suggestedWorkout.id,
            workoutNome: suggestedWorkout.nome,
            data: new Date().toISOString().split('T')[0],
            duracaoRealMin: durationMin,
            concluido: true
        };

        const newState: UserWorkoutState = {
            ...userState,
            history: [...userState.history, newHistoryEntry],
            lastWorkoutIndex: userState.lastWorkoutIndex + 1
        };

        localStorage.setItem('habito_plus_workout_state', JSON.stringify(newState));
        setUserState(newState);

        // Update suggestion for next time
        const nextIndex = newState.lastWorkoutIndex % program.rotacao.length;
        const nextWorkoutId = program.rotacao[nextIndex];
        const nextWorkout = workouts.find(w => w.id === nextWorkoutId);
        setSuggestedWorkout(nextWorkout || null);

        setView('dashboard');
    };

    const getStreak = () => {
        if (!userState?.history.length) return 0;
        const history = [...userState.history].sort((a, b) => b.data.localeCompare(a.data));
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (history[0].data === today || history[0].data === yesterday) {
            streak = 1;
            for (let i = 0; i < history.length - 1; i++) {
                const d1 = new Date(history[i].data);
                const d2 = new Date(history[i + 1].data);
                const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
                if (diff === 1) streak++;
                else break;
            }
        }
        return streak;
    };

    const getCompletionData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = userState?.history.filter(h => h.data === dateStr && h.concluido).length || 0;
            data.push({ name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), treinos: count });
        }
        return data;
    };

    if (view === 'config') {
        return <WorkoutConfig navigate={() => { loadState(); setView('dashboard'); }} onBack={() => userState ? setView('dashboard') : navigate(Page.TODAY)} />;
    }

    if (view === 'session' && suggestedWorkout) {
        return (
            <WorkoutSession
                workout={suggestedWorkout}
                onFinish={handleFinishWorkout}
                onCancel={() => setView('dashboard')}
            />
        );
    }

    if (!userState?.programId) {
        return null;
    }

    return (
        <div className="p-6 space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Treinos</h1>
                    <p className="text-slate-500 dark:text-slate-400">Sua evolução física</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-2xl">
                    <span className="material-icons-round text-primary">fitness_center</span>
                </div>
            </div>

            {suggestedWorkout && (
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                            Sugestão de Hoje
                        </span>
                        <span className="text-[12px] text-slate-400">{suggestedWorkout.duracaoMin} min</span>
                    </div>
                    <h2 className="text-xl font-bold">{suggestedWorkout.nome}</h2>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-[12px] text-slate-500">
                            <span className="material-icons-round text-[16px]">location_on</span>
                            {suggestedWorkout.local}
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-slate-500">
                            <span className="material-icons-round text-[16px]">speed</span>
                            {suggestedWorkout.nivel}
                        </div>
                    </div>
                    <button
                        onClick={() => setView('session')}
                        className="w-full bg-primary text-background-dark py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-transform"
                    >
                        Iniciar Treino
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-4 flex flex-col items-center justify-center gap-1 text-center">
                    <span className="text-3xl font-black text-primary">{getStreak()}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Streak Atual</span>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-4 flex flex-col items-center justify-center gap-1 text-center">
                    <span className="text-3xl font-black text-secondary-light">{userState.history.length > 0 ? 'Ativo' : '0%'}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold px-1">Atividade Semanal</h3>
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-4 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getCompletionData()}>
                            <XAxis dataKey="name" hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="treinos" fill="#4ade80" radius={[4, 4, 4, 4]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
                <span className="material-icons-round text-amber-500 text-[20px]">warning</span>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-tight">
                    Treinos são sugestões gerais. Ajuste à sua condição e procure um profissional se necessário.
                </p>
            </div>

            <button
                onClick={() => setView('config')}
                className="w-full border border-slate-200 dark:border-white/10 text-slate-500 py-3 rounded-2xl text-sm font-bold active:bg-slate-100 transition-colors"
            >
                Trocar Programa
            </button>
        </div>
    );
};

export default WorkoutDashboard;
