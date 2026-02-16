import React from 'react';
import { Page, WorkoutProgram, UserWorkoutState, WorkoutLocation, WorkoutLevel } from '../types';
import { programs } from '../data/workoutData';

interface WorkoutConfigProps {
    navigate: (page: Page) => void;
    onBack: () => void;
}

const WorkoutConfig: React.FC<WorkoutConfigProps> = ({ navigate, onBack }) => {
    const selectProgram = (program: WorkoutProgram) => {
        const newState: UserWorkoutState = {
            programId: program.id,
            history: [],
            lastWorkoutIndex: 0
        };
        localStorage.setItem('habito_plus_workout_state', JSON.stringify(newState));
        navigate(Page.TREINOS);
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">Escolha seu Programa</h1>
            </div>

            <div className="space-y-6">
                <p className="text-slate-500 dark:text-slate-400">
                    Selecione o plano que melhor se adapta à sua rotina e objetivos atuais.
                </p>

                {programs.map(program => (
                    <button
                        key={program.id}
                        onClick={() => selectProgram(program)}
                        className="w-full text-left bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-3 active:scale-98 transition-transform"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-primary font-bold text-sm tracking-wide">
                                {program.local.toUpperCase()}
                            </span>
                            <span className="bg-slate-200 dark:bg-white/10 text-[10px] font-bold px-2 py-1 rounded-full">
                                {program.nivel.toUpperCase()}
                            </span>
                        </div>
                        <h3 className="text-xl font-black">{program.nome}</h3>
                        <p className="text-sm text-slate-500">
                            Foco em {program.local === 'Casa' ? 'resistência e condicionamento' : 'ganho de força e massa muscular'}.
                        </p>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4, 5, 6].map(day => (
                                <div
                                    key={day}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${program.diasAtivos.includes(day)
                                            ? 'bg-primary text-background-dark'
                                            : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                                        }`}
                                >
                                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][day]}
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <p className="text-[11px] text-blue-600 dark:text-blue-400 text-center">
                    Você poderá mudar de programa a qualquer momento, mas seu progresso semanal será reiniciado.
                </p>
            </div>
        </div>
    );
};

export default WorkoutConfig;
