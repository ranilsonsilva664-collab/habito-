
import React, { useState } from 'react';
import { CATEGORIES, COLORS, WEEKDAYS } from '../constants';
import TimePicker from '../components/TimePicker';
import { Activity, Category, Difficulty } from '../types';

interface NewActivityProps {
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}

const NewActivity: React.FC<NewActivityProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [selectedCat, setSelectedCat] = useState(Category.FOCO);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(['S', 'T', 'Q', 'Q', 'S']);
  const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00']);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIO);
  const [showTimePicker, setShowTimePicker] = useState<{ index: number; value: string } | null>(null);

  const calculateXP = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.FACIL: return 10;
      case Difficulty.MEDIO: return 25;
      case Difficulty.DIFICIL: return 50;
      default: return 25;
    }
  };

  const handleSubmit = () => {
    if (!name || reminderTimes.length === 0) return;

    const primaryTime = reminderTimes[0];
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      category: selectedCat,
      icon: CATEGORIES.find(c => c.id === selectedCat)?.icon || 'star',
      color: selectedColor,
      time: `${primaryTime} - ${primaryTime}`,
      xp: calculateXP(difficulty),
      frequency: selectedDays,
      completed: false,
      streak: 0,
      history: [],
      remindersEnabled: true,
      reminderTimes: reminderTimes,
      difficulty
    };
    onAdd(newActivity);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const addTime = () => setReminderTimes([...reminderTimes, '12:00']);
  const removeTime = (index: number) => setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  const updateTime = (index: number, val: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = val;
    setReminderTimes(newTimes);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-y-auto">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl shrink-0">
        <button onClick={onClose} className="text-slate-500 dark:text-slate-400 font-medium text-sm">Cancelar</button>
        <h1 className="text-lg font-bold tracking-tight">Novo Hábito</h1>
        <button onClick={handleSubmit} className="text-primary font-black text-sm disabled:opacity-50" disabled={!name}>Salvar</button>
      </header>

      <main className="flex-1 px-6 pb-32 space-y-8 pt-4">
        {/* Input Nome */}
        <section>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Objetivo</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-0 text-2xl font-black px-0 py-3 placeholder:text-slate-200 dark:placeholder:text-slate-800 transition-colors"
            placeholder="Ex: Ler 20 min"
            type="text"
          />
        </section>

        {/* Dificuldade Selector */}
        <section className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Nível de Esforço</label>
            <span className="text-[10px] font-black text-primary uppercase">+{calculateXP(difficulty)} XP</span>
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

        {/* Categorias */}
        <section>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Categoria</label>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${selectedCat === cat.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
                <span className="material-icons-round">{cat.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-wider">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Cores */}
        <section>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Identidade Visual</label>
          <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
            {COLORS.map((color, i) => (
              <button key={i} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full transition-all ${selectedColor === color ? 'scale-125 ring-4 ring-primary/20 ring-offset-2 dark:ring-offset-background-dark shadow-lg shadow-black/20' : 'opacity-40 hover:opacity-100'}`} style={{ backgroundColor: color }}></button>
            ))}
          </div>
        </section>

        {/* Horários Aprimorados */}
        <section className="space-y-4">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Horários de Alerta</label>
          <div className="grid grid-cols-1 gap-3">
            {reminderTimes.map((t, i) => (
              <div key={i} className="flex items-center gap-3 animate-pop-in">
                <button
                  onClick={() => setShowTimePicker({ index: i, value: t })}
                  className="flex-1 bg-slate-50 dark:bg-card-dark p-4 rounded-[22px] border border-slate-100 dark:border-white/5 flex items-center justify-between px-5 shadow-sm group hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                  <span className="text-xl font-black text-slate-900 dark:text-white">{t}</span>
                  <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors">schedule</span>
                </button>
                {reminderTimes.length > 1 && (
                  <button
                    onClick={() => removeTime(i)}
                    className="w-12 h-14 rounded-[22px] bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 active:scale-95 transition-transform"
                  >
                    <span className="material-icons-round">remove_circle_outline</span>
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addTime}
              className="w-full h-14 rounded-[22px] border-2 border-dashed border-primary/20 bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors active:scale-95 group"
            >
              <span className="material-icons-round text-lg transition-transform group-hover:rotate-90">add_task</span>
              Adicionar outro horário
            </button>
          </div>
        </section>

        {showTimePicker && (
          <TimePicker
            value={showTimePicker.value}
            onClose={() => setShowTimePicker(null)}
            onChange={(newVal) => {
              updateTime(showTimePicker.index, newVal);
              setShowTimePicker(null);
            }}
          />
        )}

        {/* Repetição (Glow Squircle) */}
        <section>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Repetir em:</label>
          <div className="flex justify-between gap-1.5">
            {WEEKDAYS.map((day, i) => {
              const isActive = selectedDays.includes(day);
              return (
                <button
                  key={i}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 h-12 rounded-[14px] flex items-center justify-center text-[12px] font-black transition-all duration-300 ${isActive
                      ? 'bg-primary text-background-dark shadow-[0_4px_20px_-4px_rgba(19,236,146,0.6)] scale-105 z-10'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark/95 to-transparent pt-12 z-50">
        <button
          onClick={handleSubmit}
          disabled={!name}
          className="w-full bg-primary text-background-dark font-black text-sm tracking-[0.2em] py-5 rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-transform disabled:opacity-50"
        >
          CRIAR ATIVIDADE
        </button>
      </footer>
    </div>
  );
};

export default NewActivity;
