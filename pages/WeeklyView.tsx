
import React from 'react';
import { Page, Activity } from '../types';
import { WEEKDAYS } from '../constants';

interface WeeklyViewProps {
  activities: Activity[];
  navigate: (page: Page, habitId?: string) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ activities, navigate }) => {
  // Gerar os dias da semana atual (Segunda a Domingo)
  const generateCurrentWeek = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Encontrar a Segunda-feira desta semana
    // No JS: 0=Dom, 1=Seg, 2=Ter...
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      const isoDate = date.toISOString().split('T')[0];
      const dayIndex = date.getDay();
      const dayLabel = WEEKDAYS[dayIndex];
      
      // Filtrar atividades agendadas para este dia da semana
      const scheduledForDay = activities.filter(a => a.frequency.includes(dayLabel));
      
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isFuture = date > today;

      // Lógica de conclusão
      const completedOnDay = scheduledForDay.filter(a => {
        if (isToday) return a.completed;
        if (isPast) return a.history?.includes(isoDate);
        return false; // Futuro ainda não pode estar concluído
      });

      const total = scheduledForDay.length;
      const done = completedOnDay.length;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;

      days.push({
        date: date.getDate(),
        dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', ''),
        fullDayName: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
        isoDate,
        percent,
        total,
        done,
        isToday,
        isPast,
        isFuture
      });
    }
    return days;
  };

  const weeklyData = generateCurrentWeek();
  
  // Média apenas dos dias que já passaram ou são hoje
  const activeDays = weeklyData.filter(d => !d.isFuture);
  const averagePercent = activeDays.length > 0 
    ? Math.round(activeDays.reduce((acc, d) => acc + d.percent, 0) / activeDays.length)
    : 0;

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background-light dark:bg-background-dark">
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-white/5">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">Sua Semana</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Calendário de Performance</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="material-icons-round text-primary">calendar_view_week</span>
        </div>
      </header>

      {/* Resumo da Semana */}
      <section className="px-6 py-6">
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-widest font-black text-primary/60">Foco Semanal</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-primary leading-none">{averagePercent}%</span>
              <span className="text-xs text-primary/40 font-bold">concluído</span>
            </div>
          </div>
          <div className="flex gap-1.5 h-12 items-end relative z-10">
            {weeklyData.map((d, i) => (
              <div 
                key={i} 
                className={`w-2 rounded-full transition-all duration-500 ${d.isToday ? 'bg-primary ring-4 ring-primary/20' : d.isPast ? 'bg-primary/40' : 'bg-slate-200 dark:bg-white/5'}`}
                style={{ height: `${Math.max(15, d.percent || 15)}%` }}
              ></div>
            ))}
          </div>
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
        </div>
      </section>

      <main className="px-6 space-y-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Segunda a Domingo</h2>
        
        {weeklyData.map((day, idx) => (
          <div 
            key={idx}
            className={`bg-white dark:bg-surface-dark p-4 rounded-2xl flex flex-col gap-3 shadow-sm border transition-all ${
              day.isToday ? 'border-primary shadow-lg shadow-primary/5 scale-[1.02]' : 'border-slate-100 dark:border-border-dark'
            } ${day.isFuture ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl border ${
                  day.isToday ? 'bg-primary border-primary text-background-dark' : 'bg-slate-50 dark:bg-background-dark border-slate-100 dark:border-border-dark text-slate-400'
                }`}>
                  <span className={`text-[7px] font-black leading-none mb-1 ${day.isToday ? 'text-background-dark/70' : 'text-slate-400'}`}>{day.dayName}</span>
                  <span className={`text-sm font-black leading-none ${day.isToday ? 'text-background-dark' : 'text-slate-600 dark:text-slate-300'}`}>{day.date}</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs capitalize">
                    {day.isToday ? 'Hoje' : day.fullDayName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {day.isFuture ? (
                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-tighter">
                        {day.total} {day.total === 1 ? 'tarefa agendada' : 'tarefas agendadas'}
                      </span>
                    ) : (
                      <>
                        <span className={`material-icons-round text-xs ${day.percent === 100 ? 'text-primary' : 'text-slate-300'}`}>
                          {day.percent === 100 ? 'stars' : 'check_circle'}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-tight ${day.percent === 100 ? 'text-primary' : 'text-slate-500'}`}>
                          {day.total === 0 ? 'Sem tarefas' : `${day.done}/${day.total} Concluídos`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {!day.isFuture && (
                <div className="text-right">
                  <div className="text-xl font-black tabular-nums tracking-tighter">
                    {day.percent}<span className="text-[9px] font-bold opacity-30">%</span>
                  </div>
                </div>
              )}
            </div>

            {!day.isFuture && day.total > 0 && (
              <div className="w-full h-1 bg-slate-100 dark:bg-background-dark rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${day.percent === 100 ? 'bg-primary' : 'bg-primary/50'}`} 
                  style={{ width: `${day.percent}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </main>

      <footer className="px-6 py-10 text-center opacity-20">
        <p className="text-[8px] font-black uppercase tracking-[0.4em]">Foco e Constância</p>
      </footer>
    </div>
  );
};

export default WeeklyView;
