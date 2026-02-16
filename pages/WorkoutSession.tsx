import React, { useState, useEffect } from 'react';
import { Workout, Exercise, Page, UserWorkoutState, WorkoutHistoryEntry } from '../types';

interface WorkoutSessionProps {
    workout: Workout;
    onFinish: (durationMin: number) => void;
    onCancel: () => void;
}

const WorkoutSession: React.FC<WorkoutSessionProps> = ({ workout, onFinish, onCancel }) => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(0); // Total session timer
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval: any;
        if (isResting && restTimer > 0) {
            interval = setInterval(() => setRestTimer(t => t - 1), 1000);
        } else if (restTimer === 0) {
            setIsResting(false);
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer]);

    const currentExercise = workout.exercicios[currentExerciseIndex];

    const startRest = () => {
        setRestTimer(currentExercise.descansoSeg);
        setIsResting(true);
    };

    const toggleExercise = (index: number) => {
        if (completedExercises.includes(index)) {
            setCompletedExercises(prev => prev.filter(i => i !== index));
        } else {
            setCompletedExercises(prev => [...prev, index]);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFinish = () => {
        onFinish(Math.ceil(timer / 60));
    };

    return (
        <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-[100] flex flex-col">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <button onClick={onCancel} className="text-slate-400 hover:text-red-500">
                    <span className="material-icons-round">close</span>
                </button>
                <div className="text-center">
                    <h2 className="text-xs font-bold uppercase text-slate-500 tracking-widest">{workout.nome}</h2>
                    <div className="text-2xl font-black tabular-nums">{formatTime(timer)}</div>
                </div>
                <div className="w-8"></div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-slate-100 dark:bg-white/5">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(completedExercises.length / workout.exercicios.length) * 100}%` }}
                ></div>
            </div>

            {/* Current Exercise */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black">{currentExercise.nome}</h1>
                    <div className="flex gap-3">
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-xl font-bold text-sm">
                            {currentExercise.series} séries
                        </span>
                        <span className="bg-secondary-light/20 text-secondary-light px-3 py-1 rounded-xl font-bold text-sm">
                            {currentExercise.repsOuTempo}
                        </span>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{currentExercise.dicas}"
                    </p>
                    <button
                        onClick={startRest}
                        disabled={isResting}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isResting ? 'bg-slate-200 dark:bg-white/10 text-slate-400' : 'bg-slate-800 dark:bg-white/20 text-white'
                            }`}
                    >
                        <span className="material-icons-round text-[20px]">timer</span>
                        {isResting ? `Descansando... ${restTimer}s` : `Descanso (${currentExercise.descansoSeg}s)`}
                    </button>
                </div>

                {/* Exercise List */}
                <div className="space-y-3">
                    <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">Próximos</h3>
                    {workout.exercicios.map((ex, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                toggleExercise(idx);
                                setCurrentExerciseIndex(idx);
                            }}
                            className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${idx === currentExerciseIndex
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-transparent border-slate-100 dark:border-white/5 opacity-60'
                                } ${completedExercises.includes(idx) ? 'bg-green-500/10 border-green-500/50 opacity-100' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${completedExercises.includes(idx) ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-white/10'
                                    }`}>
                                    {completedExercises.includes(idx) ? <span className="material-icons-round text-sm">check</span> : idx + 1}
                                </div>
                                <div>
                                    <p className="font-bold">{ex.nome}</p>
                                    <p className="text-[10px] text-slate-500">{ex.series} x {ex.repsOuTempo}</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-300 text-[20px]">chevron_right</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-white/5">
                <button
                    onClick={handleFinish}
                    className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-xl shadow-2xl active:scale-95 transition-transform"
                >
                    Concluir Treino
                </button>
            </div>
        </div>
    );
};

export default WorkoutSession;
