import React, { useState } from 'react';
import { Activity, Page } from '../types';
import { WEEKDAYS } from '../constants';

interface TodayViewProps {
  activities: Activity[];
  toggleTask: (id: string) => void;
  navigate: (page: Page, habitId?: string) => void;
}

const ConfettiBurst: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="confetti-particle bg-primary animate-pop-in"
          style={{
            '--tw-translate-x': `${(Math.random() - 0.5) * 80}px`,
            '--tw-translate-y': `${(Math.random() - 0.5) * 80}px`,
            backgroundColor: ['#13ec92', '#3b82f6', '#a855f7', '#f43f5e', '#f59e0b'][Math.floor(Math.random() * 5)],
            animation: `sparkle 0.6s ease-out forwards`,
            left: '50%',
            top: '50%',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const TodayView: React.FC<TodayViewProps> = ({ activities, toggleTask, navigate }) => {
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  // Obter dia atual (D, S, T, Q, Q, S, S)
  const todayIndex = new Date().getDay();
  const todayLabel = WEEKDAYS[todayIndex];

  const todayActivities = activities.filter(a => a.frequency.includes(todayLabel));


  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      setJustCompletedId(id);
      setTimeout(() => setJustCompletedId(null), 700);
    }
    toggleTask(id);
  };

  const completedCount = todayActivities.filter(a => a.completed).length;
  const total = todayActivities.length || 1;
  const progressPercent = Math.round((completedCount / total) * 100);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="px-6 pb-6 flex-1 flex flex-col">
      <header className="pt-4 pb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Olá, Campeão!</h1>
            <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer" onClick={() => navigate(Page.DASHBOARD)}>
            <img alt="Avatar" className="w-full h-full object-cover" src="https://picsum.photos/seed/alex/200/200" />
          </div>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center py-4 mb-4">
        <div className="relative flex items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 192 192" className="overflow-visible">
            <g transform="rotate(-90 96 96)">
              <circle cx="96" cy="96" r={radius} fill="transparent" stroke="currentColor" strokeWidth="14" className="text-slate-200 dark:text-neutral-dark opacity-30" />
              <circle cx="96" cy="96" r={radius} fill="transparent" stroke="currentColor" strokeWidth="14" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-primary progress-ring-circle" />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black tracking-tighter">{progressPercent}%</span>
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-50 dark:text-primary/80">Meta Diária</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold tracking-tight">
            {todayActivities.length - completedCount === 0
              ? "🎉 Incrível! Tudo concluído!"
              : `Faltam ${todayActivities.length - completedCount} tarefas para hoje!`}
          </p>
        </div>
      </section>

      <section className="space-y-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Hoje ({todayActivities.length})</h2>
          <button onClick={() => navigate(Page.WEEKLY)} className="text-[10px] font-bold text-primary uppercase tracking-wider">Ver Calendário</button>
        </div>

        {todayActivities.length === 0 && (
          <div className="py-10 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
            <span className="material-icons-round text-slate-300 text-4xl mb-2">event_busy</span>
            <p className="text-sm text-slate-400">Nenhum hábito para hoje.</p>
          </div>
        )}

        {todayActivities.map(activity => (
          <div
            key={activity.id}
            onClick={() => navigate(Page.FOCUS_MODE, activity.id)}
            className={`bg-white dark:bg-card-dark rounded-2xl p-4 flex items-center shadow-sm border border-slate-100 dark:border-primary/5 active:scale-[0.98] transition-all cursor-pointer group ${activity.completed ? 'animate-bounce-subtle' : ''}`}
          >
            <div className="w-1.5 h-10 rounded-full mr-4 shrink-0" style={{ backgroundColor: activity.color }}></div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm transition-colors truncate ${activity.completed ? 'text-primary' : 'group-hover:text-primary'}`}>{activity.name}</h3>
              <div className="flex items-center text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="material-icons-round text-xs mr-1 opacity-70 tracking-tighter">local_fire_department</span>
                {activity.streak} dias • {activity.time}
              </div>
            </div>
            <div className="ml-4 relative" onClick={(e) => { e.stopPropagation(); handleToggle(activity.id, activity.completed); }}>
              <ConfettiBurst active={justCompletedId === activity.id} />
              <button className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all relative overflow-visible ${activity.completed ? 'bg-primary border-primary text-background-dark shadow-lg shadow-primary/20' : 'border-slate-300 dark:border-white/10 text-slate-400 hover:border-primary'}`}>
                {activity.completed && (
                  <span className="material-icons-round text-lg animate-pop-in">check</span>
                )}
                {/* Glow layer when completed */}
                {activity.completed && (
                  <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping" style={{ animationIterationCount: 1, animationDuration: '0.6s' }}></div>
                )}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TodayView;