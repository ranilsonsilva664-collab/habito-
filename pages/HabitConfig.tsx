
import React, { useState } from 'react';
import { Activity, Difficulty } from '../types';
import { WEEKDAYS } from '../constants';
import TimePicker from '../components/TimePicker';

interface HabitConfigProps {
  habit: Activity;
  onBack: () => void;
  onUpdate: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const HabitConfig: React.FC<HabitConfigProps> = ({ habit, onBack, onUpdate, onDelete }) => {
  const [name, setName] = useState(habit.name);
  const [remindersEnabled, setRemindersEnabled] = useState(habit.remindersEnabled ?? false);
  const [reminderTimes, setReminderTimes] = useState<string[]>(habit.reminderTimes ?? [habit.time.split(' - ')[0] || '08:00']);
  const [localFrequency, setLocalFrequency] = useState<string[]>(habit.frequency);
  const [difficulty, setDifficulty] = useState<Difficulty>(habit.difficulty || Difficulty.MEDIO);
  const [showTimePicker, setShowTimePicker] = useState<{ index: number; value: string } | null>(null);

  const calculateXP = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.FACIL: return 10;
      case Difficulty.MEDIO: return 25;
      case Difficulty.DIFICIL: return 50;
      default: return 25;
    }
  };

  const calculateRealStreak = (history: string[]) => {
    if (!history || history.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (!history.includes(todayStr) && !history.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    let checkDate = history.includes(todayStr) ? new Date(today) : new Date(yesterday);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (history.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const handleToggleDate = (dateStr: string) => {
    let newHistory = [...(habit.history || [])];

    if (newHistory.includes(dateStr)) {
      newHistory = newHistory.filter(d => d !== dateStr);
    } else {
      newHistory.push(dateStr);
    }

    const newStreak = calculateRealStreak(newHistory);
    const isCompletedToday = newHistory.includes(new Date().toISOString().split('T')[0]);

    onUpdate({
      ...habit,
      history: newHistory,
      streak: newStreak,
      completed: isCompletedToday
    });
  };

  const handleSave = () => {
    onUpdate({
      ...habit,
      name,
      remindersEnabled,
      reminderTimes,
      difficulty,
      xp: calculateXP(difficulty),
      frequency: localFrequency,
      time: reminderTimes[0] ? `${reminderTimes[0]} - ${reminderTimes[0]}` : habit.time
    });
  };

  const toggleDay = (day: string) => {
    setLocalFrequency(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, "12:00"]);
  };

  const removeReminderTime = (index: number) => {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  };

  const updateReminderTime = (index: number, val: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = val;
    setReminderTimes(newTimes);
  };

  const getHistoryGrid = () => {
    const grid = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      grid.push({
        date: dateStr,
        completed: habit.history?.includes(dateStr) || false,
        isToday: dateStr === todayStr
      });
    }
    return grid;
  };

  const historyGrid = getHistoryGrid();
  const totalCompleted = habit.history?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 shrink-0 border-b border-slate-100 dark:border-white/5">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest">Configuração</h1>
        <button onClick={() => onDelete(habit.id)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <span className="material-icons-round">delete</span>
        </button>
      </header>

      <main className="flex-1 px-6 pt-4 space-y-8 pb-32 overflow-y-auto">
        <section>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Hábito</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-0 text-xl font-black px-0 py-2 placeholder:opacity-30"
            type="text"
          />
        </section>

        {/* Dificuldade Selector */}
        <section className="bg-slate-50 dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary">Dificuldade:</label>
            <span className="text-[10px] font-black text-primary uppercase">+{calculateXP(difficulty)} XP / dia</span>
          </div>
          <div className="flex justify-between gap-1.5">
            {[Difficulty.FACIL, Difficulty.MEDIO, Difficulty.DIFICIL].map((diff) => {
              const isActive = difficulty === diff;
              let activeColor = 'bg-primary';
              if (diff === Difficulty.MEDIO) activeColor = 'bg-amber-400';
              if (diff === Difficulty.DIFICIL) activeColor = 'bg-rose-500';

              return (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 h-12 rounded-[14px] flex items-center justify-center text-[11px] font-black transition-all duration-300 ${isActive
                      ? `${activeColor} text-background-dark shadow-lg scale-105 z-10`
                      : 'bg-white dark:bg-background-dark text-slate-400 border border-slate-100 dark:border-white/5'
                    }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </section>

        {/* Frequência Selector */}
        <section className="bg-slate-50 dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-3xl space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Repetir em:</label>
          <div className="flex justify-between gap-1.5">
            {WEEKDAYS.map((day, i) => {
              const isActive = localFrequency.includes(day);
              return (
                <button
                  key={i}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 h-12 rounded-[14px] flex items-center justify-center text-[12px] font-black transition-all duration-300 ${isActive
                      ? 'bg-primary text-background-dark shadow-[0_4px_20px_-4px_rgba(19,236,146,0.6)] scale-105 z-10'
                      : 'bg-white dark:bg-background-dark text-slate-400 border border-slate-100 dark:border-white/5'
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </section>

        {/* Reminders Section */}
        <section className="bg-slate-50 dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-primary">notifications_active</span>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lembretes</h3>
            </div>
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${remindersEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white dark:bg-background-dark rounded-full transition-all duration-300 ${remindersEnabled ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          {remindersEnabled && (
            <div className="space-y-4 animate-pop-in">
              <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">Horários de Alerta</label>
              <div className="space-y-3">
                {reminderTimes.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button
                      onClick={() => setShowTimePicker({ index: i, value: t })}
                      className="flex-1 bg-white dark:bg-background-dark border border-slate-100 dark:border-white/5 px-5 py-4 rounded-[22px] flex items-center justify-between group hover:border-primary/30 transition-all active:scale-[0.98]"
                    >
                      <span className="text-xl font-black text-slate-900 dark:text-white">{t}</span>
                      <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors">schedule</span>
                    </button>
                    <button onClick={() => removeReminderTime(i)} className="w-12 h-14 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/10 hover:border-red-500/30 transition-colors">
                      <span className="material-icons-round text-xl">close</span>
                    </button>
                  </div>
                ))}
                <button onClick={addReminderTime} className="w-full h-14 rounded-[22px] bg-primary/10 text-primary flex items-center justify-center border border-dashed border-primary/30 gap-2 hover:bg-primary/20 transition-all active:scale-95 group">
                  <span className="material-icons-round transition-transform group-hover:rotate-90">add</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Horário</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {showTimePicker && (
          <TimePicker
            value={showTimePicker.value}
            onClose={() => setShowTimePicker(null)}
            onChange={(newVal) => {
              updateReminderTime(showTimePicker.index, newVal);
              setShowTimePicker(null);
            }}
          />
        )}

        {/* Historical Data Section */}
        <section className="bg-slate-50 dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Histórico de Conclusão</h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Heatmap
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {historyGrid.map((day, idx) => (
              <button
                key={idx}
                onClick={() => handleToggleDate(day.date)}
                className={`aspect-square rounded-md flex items-center justify-center transition-all duration-300 relative group active:scale-90 hover:opacity-80 ${day.completed
                    ? 'bg-primary shadow-[0_0_8px_rgba(19,236,146,0.3)]'
                    : 'bg-slate-200 dark:bg-background-dark'
                  } ${day.isToday ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark' : ''}`}
              >
                {day.completed && <span className="material-icons-round text-[10px] text-background-dark">check</span>}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {new Date(day.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Total</p>
              <p className="text-sm font-black">{totalCompleted}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Streak</p>
              <p className="text-sm font-black text-primary">{habit.streak}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Eficiência</p>
              <p className="text-sm font-black">{Math.round((totalCompleted / 35) * 100)}%</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 dark:bg-card-dark border border-slate-100 dark:border-white/5 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">XP Acumulado</p>
              <p className="text-xl font-black">{totalCompleted * habit.xp} XP</p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-background-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(19,236,146,0.5)]"
              style={{ width: `${Math.min(100, (habit.streak / 30) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[9px] text-slate-400 mt-2 text-right uppercase font-bold tracking-tighter">Streak Meta: {habit.streak}/30 dias</p>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent pt-10 z-50">
        <button onClick={handleSave} className="w-full bg-primary text-background-dark font-black text-sm tracking-[0.2em] py-5 rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-transform">
          SALVAR ALTERAÇÕES
        </button>
      </footer>
    </div>
  );
};

export default HabitConfig;
